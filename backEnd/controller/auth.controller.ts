import {
  BAD_REQUEST,
  EMAIL_NOT_EXIST,
  EXPIRED_TOKEN,
  FAILED_CREATION_ACCESS_AND_REFRESH_TOKEN,
  INVALID_TOKEN,
  PHONE_NUMBER_NOT_EXIST,
  REVOKED_TOKEN,
  SERVER_ERR,
  TOKEN_NOT_FOUND,
  USER_ALREADY_EXIST,
  USER_CREATED,
  USER_NOT_FOUND_ERR,
} from "../constants/errors";
import AuthServices from "../services/auth.services";
import express from "express";
import {
  validateChangeEmail,
  validateChangePhoneNumber,
  validateToken,
  validateId,
  validateUser,
  validatePhoneNumber,
  validateEmail,
} from "../validators/auth.validator";
import UserModel from "../models/user.model";
import mongoose from "mongoose";
import PicturesModel from "../models/pictures.model";
import SettingsModel from "../models/settings.model";
import RefreshTokenModel from "../models/refreshToken.model";
import PremiumModel from "../models/premium.model";
import InstagramModel from "../models/instagram.model";
import SpotifyModel from "../models/spotify.model";
import {
  createAccessToken,
  createRefreshToken,
  decodeAccessToken,
  decodeRefreshToken,
  extractTokenFromHeader,
  validateGrantType,
} from "../utils/token.utils";
import centralizedErrorHandler from "../utils/centralizedErrorHandler.utils";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response.utils";
import { convertToObjectIdRecursive } from "../utils/converter.utils";
import UserResponse from "../models/response.model";


// @route POST auth/users/register
// @desc Register user
// @access Public
async function registerUser(req: express.Request, res: express.Response) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Check if the req body is valid
    let { error, value } = validateUser(req.body);
    if (error) {
      return sendErrorResponse(res,400, error.details[0].message)

    }

    value = await convertToObjectIdRecursive(value)

    // Check if user already exists
    const userExist = await UserModel.findOne({ _id: value._id }, null, {
      session,
    });
    if (userExist) {
      throw new Error(USER_ALREADY_EXIST);
    }

    // Create the user's response model
    await AuthServices.addUserResponsesToDB({_id: value._id, responses: value.additionalInformation}, session)

    // Create the user's settings model
    await AuthServices.addUserSettingsToDB({ _id: value._id }, session);

    // Create the user's photo model
    const picturePromises = value.pictures.map((pic: any) =>
      AuthServices.addUserPicturesToDB(
        { user_id: value._id, url: pic },
        session
      )
    );
    const pictureResponses = await Promise.all(picturePromises);
    value.pictures = pictureResponses.map((response) =>
      response._id
    );

    // Create the user's user model
    await AuthServices.addUserToDB(value, session);

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

    const status = centralizedErrorHandler(errorMessage)

    return sendErrorResponse(res,status, status != 500 ? errorMessage : SERVER_ERR)

  } finally {
    session.endSession();
  }
}

async function logOutUser(req: express.Request, res: express.Response) {
  try {
    const {grantType} = req.body
    validateGrantType(grantType , 'refresh_token')


    const refreshToken = extractTokenFromHeader(req) as string

    const { error, value } = validateToken({ token: refreshToken });
    if (error) {
      return sendErrorResponse(res,400, error.details[0].message)

    }

    await AuthServices.deactivateRefreshToken(value.token);

    return sendSuccessResponse(res, 200,"Logged out successfully.")
  } catch (error) {
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage)

    return sendErrorResponse(res,status, status != 500 ? errorMessage : SERVER_ERR)
  }
}

async function deleteUser(req: express.Request, res: express.Response) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {grantType} = req.body
    validateGrantType(grantType , 'access_token')


    const accessToken = extractTokenFromHeader(req) as string
    const { error, value } = validateToken({ token: accessToken });

    if (error) {
      return sendErrorResponse(res,400, error.details[0].message)

    }

    const decode = decodeAccessToken(value.token);
    if (!decode) throw new Error(EXPIRED_TOKEN);

    
    const user = await UserModel.findById(decode.sub).session(session);
    if (!user) {
      throw new Error(USER_NOT_FOUND_ERR);
    }

    // delete user's repsonses
    await UserResponse.deleteOne({_id: decode.sub}).session(session)

    // delete user's pictures
    await PicturesModel.deleteMany({ user_id: decode.sub }).session(session);

    // delete user's instagram
    if (user?.instagram) {
      await InstagramModel.deleteOne({ _id: user.instagram }).session(session);
    }

    // delete user's spotify (fix the model name here)
    if (user?.spotify) {
      await SpotifyModel.deleteOne({ _id: user.spotify }).session(session);
    }

    // delete user's settings
    await SettingsModel.deleteOne({ _id: decode.sub }).session(session);

    // delete user's refresh token
    await RefreshTokenModel.deleteMany({ _id: decode.sub }).session(session);

    // delete user's premium
    await PremiumModel.deleteOne({ _id: decode.sub }).session(session);

    // delete user
    await UserModel.deleteOne({ _id: decode.sub }).session(session);

    await session.commitTransaction();

    return sendSuccessResponse(res, 200,"User's account successfully deleted.")

  } catch (error) {
    await session.abortTransaction();

    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage)

    return sendErrorResponse(res,status, status != 500 ? errorMessage : SERVER_ERR)
  } finally {
    session.endSession();
  }
}

async function logInUser(req: express.Request, res: express.Response) {}

async function refreshToken(req: express.Request, res: express.Response) {
  try {
    const {grantType} = req.body
    validateGrantType(grantType , 'refresh_token')


    const refreshToken = extractTokenFromHeader(req) as string

    const { error, value } = validateToken({ token: refreshToken });
    if (error) {
      return sendErrorResponse(res,400, error.details[0].message)

    }

    const tokenDoc = await RefreshTokenModel.findOne({
      token: value.token,
    });
    if (!tokenDoc) throw new Error(TOKEN_NOT_FOUND);

    if (tokenDoc.revoked) throw new Error(REVOKED_TOKEN);

    const currentDate = new Date();
    if (tokenDoc.expiresAt <= currentDate) {
      throw new Error(EXPIRED_TOKEN);
    }

    const decoded = decodeRefreshToken(value.token);

    if (decoded) {
      const accessToken = createAccessToken(decoded.sub.toString());
      const refreshToken = createRefreshToken(decoded.sub.toString());

      if (!accessToken || !refreshToken) {
        throw new Error(FAILED_CREATION_ACCESS_AND_REFRESH_TOKEN);
      }

      const currentDate = new Date();
      const expiresAt = new Date(currentDate);
      expiresAt.setDate(currentDate.getDate() + 30);

      tokenDoc.replacedByToken = tokenDoc.token;
      tokenDoc.token = refreshToken;
      tokenDoc.expiresAt = expiresAt;

      await tokenDoc.save().catch((e) => {
        throw new Error(e.message);
      });

      return sendSuccessResponse(res, 200, "Tokens were refreshed successfully.", {refreshToken, accessToken} )
    
    } else {
      throw new Error(INVALID_TOKEN);
    }
  } catch (error) {
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage)

    return sendErrorResponse(res,status, status != 500 ? errorMessage : SERVER_ERR)
  }

}

// @route GET auth/users/emailExist
// @desc Get if the email exists
// @access Public
async function emailExist(req: express.Request, res: express.Response) {
  try {
    const { error, value } = validateEmail(req.body);

    if (error) {
      return sendErrorResponse(res,400, error.details[0].message)
    }

    const response = await AuthServices.emailExistService(value);

    if (response)
     
      return  sendSuccessResponse(res, 200, USER_ALREADY_EXIST)

    else
      throw new Error(EMAIL_NOT_EXIST)
  } catch (error) {
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage)

    return sendErrorResponse(res,status, status != 500 ? errorMessage : SERVER_ERR)
  }
}

// @route GET auth/users/phoneExist
// @desc Get if the phone exists
// @access Public
async function phoneNumberExist(req: express.Request, res: express.Response) {
  try {
    const { error, value } = validatePhoneNumber(req.body);

    if (error) {
      return sendErrorResponse(res,400, error.details[0].message)

    }

    const response = await AuthServices.phoneNumberExistService(value);

    if (response)
    return  sendSuccessResponse(res, 200, USER_ALREADY_EXIST)

    else
      throw new Error(PHONE_NUMBER_NOT_EXIST)
  } catch (error) {
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage)

    return sendErrorResponse(res,status, status != 500 ? errorMessage : SERVER_ERR)
  }
}

// @route GET auth/users/uidExist
// @desc Get if the user uid exists
// @access Public
async function idExist(req: express.Request, res: express.Response) {
  try {
    const { error, value } = validateId(req.body);

    if (error) {
      return sendErrorResponse(res,400, error.details[0].message)

    }

    const response = await AuthServices.uidExistService(value);

    if (response)
    return  sendSuccessResponse(res, 200, USER_ALREADY_EXIST)

    else
      throw new Error(USER_NOT_FOUND_ERR)
  } catch (error) {
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage)

    return sendErrorResponse(res,status, status != 500 ? errorMessage : SERVER_ERR)
  }
}

async function changePhoneNumber(req: express.Request, res: express.Response) {
  try {
    const {grantType, oldPhoneNumber, newPhoneNumber} = req.body
    validateGrantType(grantType , 'access_token')

    const accessToken = extractTokenFromHeader(req) as string
    const { error, value } = validateChangePhoneNumber({
      accessToken,
      oldPhoneNumber,
      newPhoneNumber
    });

    if (error) {
      return sendErrorResponse(res,400, error.details[0].message)

    }

    const decode = decodeAccessToken(value.accessToken);
    if (!decode) throw new Error(EXPIRED_TOKEN);

    const user = await UserModel.findById(decode.sub);
    if (!user) throw new Error(USER_NOT_FOUND_ERR);

    if (user.phoneNumber != value.oldPhoneNumber) throw new Error(BAD_REQUEST);
    user.phoneNumber = value.newPhoneNumber;

    const UserWithPhoneNumber = await UserModel.findOne({phoneNumber: newPhoneNumber})
    if(UserWithPhoneNumber) throw new Error(USER_ALREADY_EXIST)

    await user.save();

    return  sendSuccessResponse(res, 200,  "User's phone number has been updated.")

  } catch (error) {
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage)

    return sendErrorResponse(res,status, status != 500 ? errorMessage : SERVER_ERR)
  }
}

async function changeEmail(req: express.Request, res: express.Response) {
  try {
   const {grantType, oldEmail, newEmail} = req.body
    validateGrantType(grantType , 'access_token')

    const accessToken = extractTokenFromHeader(req) as string
    const { error, value } = validateChangeEmail({ accessToken, oldEmail, newEmail});

    if (error) {
      return sendErrorResponse(res,400, error.details[0].message)

    }

    const decode = decodeAccessToken(accessToken);
    if (!decode) throw new Error(EXPIRED_TOKEN);

    const user = await UserModel.findById(decode.sub);
    if (!user) throw new Error(USER_NOT_FOUND_ERR);

    if (user.email && user.email != value.oldEmail)
      throw new Error(BAD_REQUEST);
    if (value.newEmail == value.oldEmail) throw new Error(BAD_REQUEST);

    user.email = value.newEmail;

    await user.save();

    return  sendSuccessResponse(res, 200, "User's email has been updated.")

  } catch (error) {
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage)

    return sendErrorResponse(res,status, status != 500 ? errorMessage : SERVER_ERR)
  }
}

async function removeEmail(req: express.Request, res: express.Response) {
  try {
    const {grantType} = req.body
    validateGrantType(grantType , 'access_token')

    const accessToken = extractTokenFromHeader(req) as string
    const { error, value } = validateToken({ token: accessToken });

    if (error) {
      return sendErrorResponse(res,400, error.details[0].message)

    }

    const decode = decodeAccessToken(value.token);
    if (!decode) throw new Error(EXPIRED_TOKEN);

    const user = await UserModel.findById(decode.sub);
    if (!user) throw new Error(USER_NOT_FOUND_ERR);

    if (user.email) {
      user.email = undefined;
      await user.save();
    }

    return  sendSuccessResponse(res, 200, "User's email has been updated.")

  } catch (error) {
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage)

    return sendErrorResponse(res,status, status != 500 ? errorMessage : SERVER_ERR)
  }
}

const authController = {
  idExist,
  phoneNumberExist,
  emailExist,
  registerUser,
  logOutUser,
  deleteUser,
  refreshToken,
  changePhoneNumber,
  changeEmail,
  removeEmail,
};
export default authController;
