import express from "express";
import {
  EXPIRED_TOKEN,
  USER_NOT_FOUND_ERR,
} from "../constants/errors";
import UserModel from "../models/user.model";
import { decodeAccessToken, extractTokenFromHeader, validateGrantType } from "../utils/token.utils";
import { validateId, validateToken } from "../validators/auth.validator";
import centralizedErrorHandler from "../utils/centralizedErrorHandler.utils";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response.utils";
import { buildUserProfilePipeline } from "../utils/buildUserProfilePipeline.utils";
import { userProfileValidationSchema } from "../validators/user.validator";
import Joi from "joi";
import PicturesModel from "../models/pictures.model";

async function getMyProfile(req: express.Request, res: express.Response) {
  try {
    const {grantType} = req.body
    validateGrantType(grantType , 'access_token')

    const accessToken = extractTokenFromHeader(req) as string
    const { error, value } = validateToken({ token: accessToken });

    if (error) {
      return sendErrorResponse(res,400, error.details[0].message)

    }

    const decode = decodeAccessToken(accessToken);
    if (!decode) throw new Error(EXPIRED_TOKEN);

    let user = await UserModel.findById(decode.sub);
    if (!user) throw new Error(USER_NOT_FOUND_ERR);

    user.lastActive = new Date();

    await user.save();

    const pipeline = buildUserProfilePipeline(decode.sub, user, true);

  
    user = await UserModel.aggregate(pipeline)


    return res.status(200).json({
      type: "success",
      message: "User's profile successfully fetched",
      user,
    });

  } catch (error) {
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage)

    return sendErrorResponse(res, status, errorMessage)
  }
}

async function getUserProfile(req: express.Request, res: express.Response) {
  try {
    const { _id } = req.params
    const { error, value } = validateId({_id});

    if (error) {
      return sendErrorResponse(res,400, error.details[0].message)

    }

    let user = await UserModel.findById(_id);
    if (!user) throw new Error(USER_NOT_FOUND_ERR);

    const pipeline = buildUserProfilePipeline(user._id, user, false);
  
    user = await UserModel.aggregate(pipeline)


    return sendSuccessResponse(res, 200, "User's profile successfully fetched", {user})
  } catch (error) {
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage)

    return sendErrorResponse(res, status, errorMessage)
  }
}

async function updateUserProfile(req: express.Request, res: express.Response) {
  try {

    const {grantType, pictures, ...otherFields} = req.body;

    const validationResult = userProfileValidationSchema.validate(otherFields);

    if (validationResult.error) {
      return sendErrorResponse(res,400, validationResult.error.details[0].message)
    }

    if(pictures){
      const validationResult = Joi.object({pictures: Joi.array().items(Joi.string()).max(6).optional()}).validate({pictures})
      if (validationResult.error) {
        return sendErrorResponse(res,400, validationResult.error.details[0].message)
      }
    }



    // The rest of your logic stays the same
    validateGrantType(grantType, 'access_token');
    
    const accessToken = extractTokenFromHeader(req) as string;
    const { error, value } = validateToken({ token: accessToken });

    if (error) {
      return sendErrorResponse(res,400, error.details[0].message)

    }

    const decode = decodeAccessToken(accessToken);
    if (!decode) throw new Error(EXPIRED_TOKEN);

    let user = await UserModel.findById(decode.sub);
    if (!user) throw new Error(USER_NOT_FOUND_ERR);


    Object.assign(user, validationResult.value);

    if(pictures){
      await PicturesModel.deleteMany({ user_id: decode.sub });

    }

    //await user.save();

    return sendSuccessResponse(res, 200, "User's profile successfully updated", {user});
  } catch (error) {
    const errorMessage = (error as Error).message;
    const status = centralizedErrorHandler(errorMessage);
    return sendErrorResponse(res, status, errorMessage);
  }
}

const userController = {
  getMyProfile,
  getUserProfile,
  updateUserProfile
};
export default userController;
