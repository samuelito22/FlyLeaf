import express from "express";
import { EXPIRED_TOKEN, USER_NOT_FOUND_ERR } from "../constants/errors";
import {
  decodeAccessToken,
  extractTokenFromHeader,
  validateGrantType,
} from "../utils/token.utils";
import { validateId, validateToken } from "../validators/auth.validator";
import centralizedErrorHandler from "../utils/centralizedErrorHandler.utils";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/response.utils";
import Joi from "joi";
import awsServices from "../services/aws.services";
import { User } from "../models/user";
import Model from "../models";

const publicAttributes = ['id', 'firstName', 'dateOfBirth', 'primaryGender', 'secondaryGender', 'bio', 'height', 'email', 'phoneNumber', 'city', 'verified', 'pictures', 'interests', 'answers', 'topArtists', 'images', 'seeking', 'languages'];


async function getMyProfile(req: express.Request, res: express.Response) {
  try {

    const { grantType, coordinates } = req.body;
    validateGrantType(grantType, "access_token");

    const accessToken = extractTokenFromHeader(req) as string;

    // First validation
    let { error, value } = validateToken({ token: accessToken });
    if (error) {
      return sendErrorResponse(res, 400, error.details[0].message);
    }

    // Second validation
    const coordinatesValidation = Joi.object({
      longitude: Joi.number().required(),
      latitude: Joi.number().required(),
    }).validate({ ...coordinates }); // Assuming coordinates are in the request body

    if (coordinatesValidation.error) {
      return sendErrorResponse(
        res,
        400,
        coordinatesValidation.error.details[0].message
      );
    }

    const decode = decodeAccessToken(accessToken);
    if (!decode) throw new Error(EXPIRED_TOKEN);

    let user = await User.findByPk(decode.sub);
    if (!user) throw new Error(USER_NOT_FOUND_ERR);

    user.longitude = value.longitude;
    user.latitude = value.latitude;

    await user.save();

    user = await Model.User.findByPk(decode.sub)

    if (user && user.pictures && Array.isArray(user.pictures)) {
      // Extract the picture names into an array
      const pictureNames = user.pictures.map(
        (pictureObj: any) => pictureObj.name
      );

      // Get the picture URLs in a single function call
      const updatedPictureUrls = await awsServices.getUserPicturesFromS3(
        pictureNames
      );

      for (let i = 0; i < updatedPictureUrls.length; i++) {
      user.pictures[i].setDataValue('url', updatedPictureUrls[i]);
    }
    } else {
      console.warn("user.pictures is not defined or not an array");
    }

    return res.status(200).json({
      type: "success",
      message: "User's profile successfully fetched",
      user,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage);

    return sendErrorResponse(res, status, errorMessage);
  }
}

async function getUserProfile(req: express.Request, res: express.Response) {
  try {
    const { id } = req.params;
    const { error, value } = validateId({ id });

    if (error) {
      return sendErrorResponse(res, 400, error.details[0].message);
    }

    let user = await User.findByPk(id, {
      attributes: publicAttributes, 
    });
    if (!user) throw new Error(USER_NOT_FOUND_ERR);

    if (user.pictures && Array.isArray(user.pictures)) {
      // Extract the picture names into an array
      const pictureNames = user.pictures.map(
        (pictureObj: any) => pictureObj.name
      );

      // Get the picture URLs in a single function call
      const updatedPictureUrls = await awsServices.getUserPicturesFromS3(
        pictureNames
      );

      // Associate the URLs with the pictures
      for (let i = 0; i < updatedPictureUrls.length; i++) {
        user.pictures[i].setDataValue('url', updatedPictureUrls[i]);
      }
    } else {
      console.warn("user.pictures is not defined or not an array");
    }

    return sendSuccessResponse(
      res,
      200,
      "User's profile successfully fetched",
      { user }
    );
  } catch (error) {
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage);

    return sendErrorResponse(res, status, errorMessage);
  }
}

async function updateUserProfile(req: express.Request, res: express.Response) {
  try {
    const { grantType} = req.body;

    // The rest of your logic stays the same
    validateGrantType(grantType, "access_token");

    const accessToken = extractTokenFromHeader(req) as string;
    const { error, value } = validateToken({ token: accessToken });

    return sendSuccessResponse(
      res,
      200,
      "User's profile successfully updated",
    );
  } catch (error) {
    const errorMessage = (error as Error).message;
    const status = centralizedErrorHandler(errorMessage);
    return sendErrorResponse(res, status, errorMessage);
  } 
}


const userController = {
  getMyProfile,
  getUserProfile,
  updateUserProfile,
};
export default userController;
