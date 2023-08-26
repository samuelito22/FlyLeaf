import {
  SERVER_ERR, USER_ALREADY_EXIST, USER_CREATED,
} from "../errors";
import AuthServices from "../services/auth.services";
import express from "express"
import { validateUser } from "../validators/auth.validator";
import UserModel from "../models/user.model";
import mongoose from "mongoose";


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
            throw new Error(error.details[0].message);
        }

        // Check if user already exists
        const userExist = await UserModel.findOne({ _id: value._id }, null, { session });
        if (userExist) {
            throw new Error(USER_ALREADY_EXIST);
        }


        // Create the user's settings model
        const settingsResult = await AuthServices.addUserSettingsToDB({ _id: value._id }, session);
        if (settingsResult.type === "error" && typeof settingsResult.error === "string") {
            throw new Error(settingsResult.error);
        }

        // Create the user's photo model
        let picturesId = [];
        for (let i = 0; i < value.pictures.length; i++) {
            const response = await AuthServices.addUserPicturesToDB({ user_id: value._id, url: value.pictures[i] }, session);
            if (response.type === "error" && typeof response.error === "string") {
                throw new Error(response.error);
            }
            
            picturesId.push(response.photosDB?._id);
        }
        value.pictures = picturesId;

        // Create the user's user model
        const userResult = await AuthServices.addUserToDB(value, session);
        if (userResult.type === "error" && typeof userResult.error === "string") {
            throw new Error(userResult.error);
        }

        

        // Create jwt tokens
        const access_token = AuthServices.createAccessToken(value._id)
        const refresh_token = AuthServices.createRefreshToken(value._id)

        if(!refresh_token || !access_token) throw new Error("Failed to create either the access token or the refresh token.")

        const currentDate = new Date();
        const expiresAt = new Date(currentDate);
        expiresAt.setDate(currentDate.getDate() + 30); 

        const refreshTokenResponse = await AuthServices.addUserRefreshTokenToDB({ user_id: value._id, token: refresh_token, expiresAt  }, session);
        if (refreshTokenResponse.type === "error" && typeof refreshTokenResponse.error === "string") {
            throw new Error(refreshTokenResponse.error);
        }

        if (settingsResult.type === "error" && typeof settingsResult.error === "string") {
            throw new Error(settingsResult.error);
        }


        await session.commitTransaction();

        return res.status(200).json({
            type: "success",
            message: USER_CREATED,
            access_token,
            refresh_token
        });

        
    } catch (error) {
        if (session.inTransaction()) { 
            await session.abortTransaction(); 
        }

        const errorMessage = (error as Error).message;
        
        const status = errorMessage === USER_ALREADY_EXIST ? 409 : 500;
        const message = errorMessage;
        
        return res.status(status).json({
            type: "error",
            message: message,
        });
    } finally {
        session.endSession();
    }
}

// @route GET auth/users/emailExist
// @desc Get if the email exists
// @access Public
async function emailExist(req:express.Request, res: express.Response) {
  try {
      const response = await AuthServices.emailExistService(req.body);
      return res
          .status(400)
          .json({ type: "error", message: response });
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          type: "error",
          message:  SERVER_ERR,
      });
  }
}

// @route GET auth/users/phoneExist
// @desc Get if the phone exists
// @access Public
async function phoneExist(req:express.Request, res: express.Response) {
  try {
      const response = await AuthServices.phoneExistService(req.body);
      return res
          .status(400)
          .json({ type: "error", message: response });
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          type: "error",
          message: SERVER_ERR,
      });
  }
}

// @route GET auth/users/uidExist
// @desc Get if the user uid exists
// @access Public
async function uidExist(req:express.Request, res: express.Response) {
  try {
      const response = await AuthServices.uidExistService(req.body);
      return res
          .status(400)
          .json({ type: "error", message: response });
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          type: "error",
          message: SERVER_ERR,
      });
  }
}

const authController = { uidExist, phoneExist, emailExist, registerUser }
export default authController
