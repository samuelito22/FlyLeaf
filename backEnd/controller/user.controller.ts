import express from "express";
import { EXPIRED_TOKEN, USER_NOT_FOUND_ERR } from "../constants/errors";
import UserModel from "../models/user.model";
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
import { buildUserProfilePipeline } from "../utils/buildUserProfilePipeline.utils";
import {
  combinedSettingsAndPremiumSchema,
  userProfileValidationSchema,
} from "../validators/user.validator";
import Joi from "joi";
import PicturesModel from "../models/pictures.model";
import mongoose from "mongoose";
import UserServices from "../services/user.services";
import awsServices from "../services/aws.services";
import { convertToObjectIdRecursive } from "../utils/converter.utils";

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
      coordinates: Joi.object({
        longitude: Joi.number().required(),
        latitude: Joi.number().required(),
      }).required(),
    }).validate({ coordinates }); // Assuming coordinates are in the request body

    if (coordinatesValidation.error) {
      return sendErrorResponse(
        res,
        400,
        coordinatesValidation.error.details[0].message
      );
    }

    const decode = decodeAccessToken(accessToken);
    if (!decode) throw new Error(EXPIRED_TOKEN);

    let user = await UserModel.findById(decode.sub);
    if (!user) throw new Error(USER_NOT_FOUND_ERR);

    user.lastActive = new Date();

    if (!user.location) {
      user.location = {};
    }
    user.location.coordinates = coordinates;

    await user.save();

    const pipeline = buildUserProfilePipeline(decode.sub, user, true);

    user = await UserModel.aggregate(pipeline);
    user = user.length ? user[0] : null;

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
      user.pictures = updatedPictureUrls.map((url, index) => {
        return { ...user.pictures[index], url };
      });
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
    const { _id } = req.params;
    const { error, value } = validateId({ _id });

    if (error) {
      return sendErrorResponse(res, 400, error.details[0].message);
    }

    let user = await UserModel.findById(_id);
    if (!user) throw new Error(USER_NOT_FOUND_ERR);

    const pipeline = buildUserProfilePipeline(user._id, user, false);

    user = await UserModel.aggregate(pipeline);
    user = user.length ? user[0] : null;

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
      user.pictures = updatedPictureUrls.map((url, index) => {
        return { ...user.pictures[index], url };
      });
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
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { grantType, picturesToBeDeleted, ...otherFields } = req.body;

    const validationResult = userProfileValidationSchema.validate(otherFields);

    if (validationResult.error) {
      return sendErrorResponse(
        res,
        400,
        validationResult.error.details[0].message
      );
    }

    // The rest of your logic stays the same
    validateGrantType(grantType, "access_token");

    const accessToken = extractTokenFromHeader(req) as string;
    const { error, value } = validateToken({ token: accessToken });

    if (error) {
      return sendErrorResponse(res, 400, error.details[0].message);
    }

    const decode = decodeAccessToken(accessToken);
    if (!decode) throw new Error(EXPIRED_TOKEN);

    let user = await UserModel.findById(decode.sub);
    if (!user) throw new Error(USER_NOT_FOUND_ERR);

    validationResult.value = await convertToObjectIdRecursive(
      validationResult.value
    );

    Object.assign(user, validationResult.value);

    await user.save({ session });

    if (picturesToBeDeleted) {
      // Check if picturesToBeDeleted is an array of strings
      if (
        !Array.isArray(picturesToBeDeleted) ||
        !picturesToBeDeleted.every((e) => typeof e === "string")
      ) {
        return sendErrorResponse(
          res,
          400,
          "picturesToBeDeleted must be an array of strings."
        );
      }

      // Validate no duplicate pictures in picturesToBeDeleted
      const uniquePictures = new Set(picturesToBeDeleted);
      if (uniquePictures.size !== picturesToBeDeleted.length) {
        return sendErrorResponse(
          res,
          400,
          "picturesToBeDeleted should not contain duplicate entries."
        );
      }

      // Validate that picturesToBeDeleted only contains "picture-0" up to "picture-5"
      const validPictureNames = [
        "picture-0",
        "picture-1",
        "picture-2",
        "picture-3",
        "picture-4",
        "picture-5",
      ];
      if (
        !picturesToBeDeleted.every((pic) => validPictureNames.includes(pic))
      ) {
        return sendErrorResponse(
          res,
          400,
          "Invalid picture name in picturesToBeDeleted. Only 'picture-0' to 'picture-5' are allowed."
        );
      }

      // Check if picturesToBeDeleted includes any of the new files being uploaded
      if (req.files) {
        const filesObject = req.files as
          | { [fieldname: string]: Express.Multer.File[] }
          | Express.Multer.File[];
        let fileKeys: string[] = [];

        if (Array.isArray(filesObject)) {
          return sendErrorResponse(res, 400, "Malformed upload request.");
        } else {
          fileKeys = Object.keys(filesObject);
        }

        if (picturesToBeDeleted.some((pic) => fileKeys.includes(pic))) {
          return sendErrorResponse(
            res,
            400,
            "picturesToBeDeleted should not include any new pictures being uploaded."
          );
        }
      }

      picturesToBeDeleted.map(async (pic) => {
        const fileName = `${user._id}/${pic}.jpeg`;
        await PicturesModel.deleteOne({ name: fileName, user_id: user._id })
          .session(session)
          .then(async (result) => {
            if (result.deletedCount > 0) {
              await awsServices.deleteUserFileFromS3(fileName);
            }
          });
      });
    }

    await session.commitTransaction();

    if (req.files) {
      for (const fieldName of Object.keys(req.files)) {
        const filesArray = (
          req.files as { [fieldname: string]: Express.Multer.File[] }
        )[fieldName];
        for (const [index, file] of filesArray.entries()) {
          await awsServices.addUserPictureToS3(file, user._id);
        }
      }
    }

    return sendSuccessResponse(
      res,
      200,
      "User's profile successfully updated",
      { user }
    );
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    const errorMessage = (error as Error).message;
    const status = centralizedErrorHandler(errorMessage);
    return sendErrorResponse(res, status, errorMessage);
  } finally {
    session.endSession();
  }
}

async function updateSettingsAndPremium(
  req: express.Request,
  res: express.Response
) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { grantType } = req.body;
    validateGrantType(grantType, "access_token");

    const accessToken = extractTokenFromHeader(req) as string;
    // First validation
    let { error, value } = validateToken({ token: accessToken });
    if (error) {
      return sendErrorResponse(res, 400, error.details[0].message);
    }
    const decode = decodeAccessToken(accessToken);
    if (!decode) throw new Error(EXPIRED_TOKEN);

    let user = await UserModel.findById(decode.sub);
    if (!user) throw new Error(USER_NOT_FOUND_ERR);

    const { settings, premium } = req.body;

    const premiumAndSettingValidation =
      combinedSettingsAndPremiumSchema.validate({ settings, premium });
    if (premiumAndSettingValidation.error) {
      return sendErrorResponse(
        res,
        400,
        premiumAndSettingValidation.error.details[0].message
      );
    }
    // Update Settings
    const updatedSettings = await UserServices.updateSettingsInDB(
      settings,
      decode.sub,
      session
    );

    // Update Premium
    const updatedPremium = await UserServices.updatePremiumInDB(
      premium,
      decode.sub,
      session
    );

    await session.commitTransaction();

    return sendSuccessResponse(
      res,
      200,
      "Settings and Premium features successfully updated",
      { updatedSettings, updatedPremium }
    );
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    const errorMessage = (error as Error).message;
    const status = centralizedErrorHandler(errorMessage);

    return sendErrorResponse(res, status, errorMessage);
  } finally {
    session.endSession();
  }
}

const userController = {
  getMyProfile,
  getUserProfile,
  updateUserProfile,
  updateSettingsAndPremium,
};
export default userController;
