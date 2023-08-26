import {
    BAD_REQUEST,
  EXPIRED_TOKEN,
  FAILED_CREATION_ACCESS_AND_REFRESH_TOKEN,
  INVALID_TOKEN,
  REVOKED_TOKEN,
  SERVER_ERR,
  TOKEN_NOT_FOUND,
  UNAUTHORIZED_REQUEST,
  USER_ALREADY_EXIST,
  USER_CREATED,
  USER_NOT_FOUND_ERR,
} from "../errors";
import AuthServices from "../services/auth.services";
import express from "express";
import {
    validateChangePhoneNumber,
  validateRefreshToken,
  validateUid,
  validateUser,
} from "../validators/auth.validator";
import UserModel from "../models/user.model";
import mongoose from "mongoose";
import PicturesModel from "../models/pictures.model";
import SettingsModel from "../models/settings.model";
import RefreshTokenModel from "../models/refreshToken.model";
import PremiumModel from "../models/premium.mode";
import InstagramModel from "../models/instagram.model";
import SpotifyModel from "../models/spotify.model";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { ACCESS_SECRET, REFRESH_SECRET } from "../config/config";
import { jwtPayload } from "../../types";
import { createAccessToken, createRefreshToken, decodeAccessToken, decodeRefreshToken } from "../utils/token.utils";

// @route POST auth/users/register
// @desc Register user
// @access Public
async function registerUser(req: express.Request, res: express.Response) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Check if the req body is valid
    const { error, value } = validateUser(req.body);
    if (error) {
      return res.status(400).json({
        type: "error",
        message: error.details[0].message,
      });
    }

    // Check if user already exists
    const userExist = await UserModel.findOne({ _id: value._id }, null, {
      session,
    });
    if (userExist) {
      throw new Error(USER_ALREADY_EXIST);
    }

    // Create the user's settings model
    await AuthServices.addUserSettingsToDB({ _id: value._id }, session);

    // Create the user's photo model
    const picturePromises = value.pictures.map((pic) =>
      AuthServices.addUserPicturesToDB(
        { user_id: value._id, url: pic },
        session
      )
    );
    const pictureResponses = await Promise.all(picturePromises);
    value.pictures = pictureResponses.map((response) =>
      response._id.toString()
    );

    // Create the user's user model
    const userResult = await AuthServices.addUserToDB(value, session);
    if (userResult.type === "error" && typeof userResult.error === "string") {
      throw new Error(userResult.error);
    }

    // Create jwt tokens
    const accessToken = createAccessToken(value._id);
    const refreshToken = createRefreshToken(value._id);

    if (!refreshToken || !accessToken)
      throw new Error(FAILED_CREATION_ACCESS_AND_REFRESH_TOKEN);

    const currentDate = new Date();
    const expiresAt = new Date(currentDate);
    expiresAt.setDate(currentDate.getDate() + 30);

    await AuthServices.addUserRefreshTokenToDB(
      { _id: value._id, token: refreshToken, expiresAt },
      session
    );

    await session.commitTransaction();

    return res.status(200).json({
      type: "success",
      message: USER_CREATED,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    const errorMessage = (error as Error).message;

    if (errorMessage === USER_ALREADY_EXIST) {
      return res.status(409).json({
        type: "error",
        message: errorMessage,
      });
    } else if (errorMessage === FAILED_CREATION_ACCESS_AND_REFRESH_TOKEN) {
      return res.status(500).json({
        type: "error",
        message: errorMessage,
      });
    } else {
      return res.status(500).json({
        type: "error",
        message: "Internal server error.", // It's better to give a generic error message here
      });
    }
  } finally {
    session.endSession();
  }
}

async function logOutUser(req: express.Request, res: express.Response) {
  try {
    const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error(UNAUTHORIZED_REQUEST)
        }

        const refreshToken = authHeader.split(' ')[1];

    const { error, value } = validateRefreshToken({refreshToken});
    if (error) {
      return res.status(400).json({
        type: "error",
        message: error.details[0].message,
      });
    }

    await AuthServices.deactivateRefreshToken(value.refreshToken);

    return res.status(200).json({
      type: "success",
      message: "Logged out successfully.",
    });
  } catch (error) {
    const errorMessage = (error as Error).message;

    if (errorMessage === TOKEN_NOT_FOUND) {
      return res.status(404).json({
        type: "error",
        message: errorMessage,
      });
    } else if (errorMessage === REVOKED_TOKEN) {
      return res.status(403).json({
        type: "error",
        message: errorMessage,
      });
    } else {
      return res.status(500).json({
        type: "error",
        message: errorMessage,
      });
    }
  }
}

async function deleteUser(req: express.Request, res: express.Response) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { error, value } = validateUid(req.body);
    if (error) {
      return res.status(400).json({
        type: "error",
        message: error.details[0].message,
      });
    }

    const user = await UserModel.findById(value._id).session(session);
    if (!user) {
      throw new Error(USER_NOT_FOUND_ERR);
    }

    // delete user's pictures
    await PicturesModel.deleteMany({ user_id: value._id }).session(session);

    // delete user's instagram
    if (user?.instagram) {
      await InstagramModel.deleteOne({ _id: user.instagram }).session(session);
    }

    // delete user's spotify (fix the model name here)
    if (user?.spotify) {
      await SpotifyModel.deleteOne({ _id: user.spotify }).session(session);
    }

    // delete user's settings
    await SettingsModel.deleteOne({ _id: value._id }).session(session);

    // delete user's refresh token
    await RefreshTokenModel.deleteMany({ _id: value._id }).session(session);

    // delete user's premium
    await PremiumModel.deleteOne({ _id: value._id }).session(session);

    // delete user
    await UserModel.deleteOne({ _id: value._id }).session(session);

    await session.commitTransaction();

    return res.status(200).json({
      type: "success",
      message: "User's account successfully deleted.",
    });
  } catch (error) {
    await session.abortTransaction();

    const errorMessage = (error as Error).message;

    let status;
    switch (errorMessage) {
      case USER_NOT_FOUND_ERR:
        status = 404;
        break;
      default:
        status = 500;
    }

    return res.status(status).json({
      type: "error",
      message: errorMessage,
    });
  } finally {
    session.endSession();
  }
}

async function logInUser(req: express.Request, res: express.Response) {}

async function refreshToken(req: express.Request, res: express.Response) {
  try {
    const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error(UNAUTHORIZED_REQUEST)
        }

        const refreshToken = authHeader.split(' ')[1];

    const { error, value } = validateRefreshToken({refreshToken});
    if (error) {
      return res.status(400).json({
        type: "error",
        message: error.details[0].message,
      });
    }

    const tokenDoc = await RefreshTokenModel.findOne({
      token: value.refreshToken,
    });
    if (!tokenDoc) throw new Error(TOKEN_NOT_FOUND);

    if (tokenDoc.revoked) throw new Error(REVOKED_TOKEN);

    const currentDate = new Date();
    if (tokenDoc.expiresAt <= currentDate){
        throw new Error(EXPIRED_TOKEN)
    }

    const decoded = decodeRefreshToken(value.refreshToken)

      if (decoded) {
        const accessToken = createAccessToken(decoded.sub);
        const refreshToken = createRefreshToken(decoded.sub)

        if (!accessToken || !refreshToken) {
            throw new Error(FAILED_CREATION_ACCESS_AND_REFRESH_TOKEN);
        }
        
        const currentDate = new Date();
    const expiresAt = new Date(currentDate);
    expiresAt.setDate(currentDate.getDate() + 30);

        tokenDoc.replacedByToken = tokenDoc.token
        tokenDoc.token = refreshToken
        tokenDoc.expiresAt = expiresAt

        await tokenDoc.save().catch(e => {throw new Error(e.message)})

        return res.status(200).json({
            type: "success",
            message: "Tokens were refreshed successfully.",
            refreshToken,
            accessToken
          });

      } else {
        throw new Error(INVALID_TOKEN);
      }
    

  } catch (error) {
    const errorMessage = (error as Error).message;

    let status;
    switch (errorMessage) {
      case TOKEN_NOT_FOUND:
        status = 404;
        break;
      case REVOKED_TOKEN:
        status = 403;
        break;
      case INVALID_TOKEN:
        status = 403;
        break;
      case EXPIRED_TOKEN:
        status = 401;
        break;
        case UNAUTHORIZED_REQUEST:
            status = 401;
            break;
      case FAILED_CREATION_ACCESS_AND_REFRESH_TOKEN: 
       status = 500
       break
      default:
        status = 500;
    }

    return res.status(status).json({
      type: "error",
      message: errorMessage,
    });
  }
}

// @route GET auth/users/emailExist
// @desc Get if the email exists
// @access Public
async function emailExist(req: express.Request, res: express.Response) {
  try {
    const response = await AuthServices.emailExistService(req.body);
    return res.status(400).json({ type: "error", message: response });
  } catch (error) {
    console.error(error);
    return res.status(200).json({
      type: "error",
      message: SERVER_ERR,
    });
  }
}

// @route GET auth/users/phoneExist
// @desc Get if the phone exists
// @access Public
async function phoneNumberExist(req: express.Request, res: express.Response) {
  try {
    const response = await AuthServices.phoneNumberExistService(req.body);
    return res.status(400).json({ type: "error", message: response });
  } catch (error) {
    console.error(error);
    return res.status(200).json({
      type: "error",
      message: SERVER_ERR,
    });
  }
}

// @route GET auth/users/uidExist
// @desc Get if the user uid exists
// @access Public
async function uidExist(req: express.Request, res: express.Response) {
  try {
    const response = await AuthServices.uidExistService(req.body);
    return res.status(400).json({ type: "error", message: response });
  } catch (error) {
    console.error(error);
    return res.status(200).json({
      type: "error",
      message: SERVER_ERR,
    });
  }
}

async function changePhoneNumber(req: express.Request, res: express.Response) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error(UNAUTHORIZED_REQUEST)
        }

    
        const accessToken = authHeader.split(' ')[1];
        const { error, value } = validateChangePhoneNumber({ accessToken, ...req.body });

        if (error) {
            return res.status(400).json({
                type: "error",
                message: error.details[0].message,
            });
        }

        const decode = decodeAccessToken(accessToken)
        if(!decode) throw new Error(EXPIRED_TOKEN)

        const user = await UserModel.findById(decode.sub)
        if(!user) throw new Error(USER_NOT_FOUND_ERR)

        if(user.phoneNumber != value.oldPhoneNumber) throw new Error(BAD_REQUEST)
        user.phoneNumber = value.newPhoneNumber

        await user.save()

        return res.status(200).json({
            type: "success",
            message: "User's phone number has been updated.",
          });

        

    } catch (error) {
        const errorMessage = (error as Error).message;

        let status;
        switch (errorMessage) {
        case UNAUTHORIZED_REQUEST:
            status = 401;
            break;
        case EXPIRED_TOKEN:
            status = 401;
            break
            case USER_NOT_FOUND_ERR:
                status = 404;
                break
        case BAD_REQUEST:
            status = 400
            break
        default:
            status = 500;
        }

        return res.status(status).json({
        type: "error",
        message: errorMessage,
        });
    }
}


const authController = {
  uidExist,
  phoneNumberExist,
  emailExist,
  registerUser,
  logOutUser,
  deleteUser,
  refreshToken,
  changePhoneNumber
};
export default authController;
