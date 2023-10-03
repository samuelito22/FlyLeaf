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

const publicAttributes = ['id', 'firstName', 'dateOfBirth', 'primaryGenderId', 'secondaryGenderId', 'bio', 'height', 'city', 'verified', 'longitude', 'latitude'];


async function getMyProfile(req: express.Request, res: express.Response) {
  try {

    const { grantType, longitude, latitude} = req.body;
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
    }).validate({longitude, latitude }); // Assuming coordinates are in the request body

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

   user = await Model.User.findByPk(decode.sub, {
  include: [
    { model: Model.PrimaryGender, as: 'primaryGender' },
    { model: Model.SecondaryGender, as: 'secondaryGender', include: [{model: Model.PrimaryGender, as: 'primaryGender'}] },
    { model: Model.NotificationSettings },
    { model: Model.FilterSettings, include: [
      {
        model: Model.RelationshipGoal,
        as: 'relationshipGoal',  // The alias you may have defined in your FilterSettings model for RelationshipGoal
      }
    ] },
    { model: Model.PrivacySettings },
    { model: Model.AccountSettings },
    { model: Model.UserSubscriptionFeatures },
    { model: Model.UserLanguages, include: [{model: Model.Languages, as: 'language'}] },
    { model: Model.UserInterests, include: [{model: Model.Interests, as: 'interest'}] },
    { model: Model.UserAnswers,  include: [
      {
        model: Model.Answers,
        as: 'answer', 
        include: [
          {
            model: Model.Questions,
            as: 'question',  // The alias you may have defined in your FilterSettings model for RelationshipGoal
          }
        ]
      }
    ] },
    { model: Model.UserMatches, as: 'matches' },
    { model: Model.UserMatches, as: 'matchedBy' },
    { model: Model.UserPictures },
    { model: Model.Conversations, as: 'conversationsInitiated' },
    { model: Model.Conversations, as: 'conversationsReceived' },
    { model: Model.Payments },
    { model: Model.NotificationsHistory },
    { model: Model.UserBlocked, as: 'blockedUsers' },
    { model: Model.DeviceInfo },
    { model: Model.UserTopArtists },
    { model: Model.InstagramImages },
    { model: Model.UserSubscriptions },
    { model: Model.UserConnects},
    { model: Model.UserSeekingGender }
  ]
});


    if (user) {
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
    console.log(error)
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
      include: [
        { model: Model.PrivacySettings },
        { model: Model.UserTopArtists },
        { model: Model.UserSeekingGender },
        { model: Model.PrimaryGender, as: 'primaryGender' },
        { model: Model.SecondaryGender, as: 'secondaryGender', include: [{model: Model.PrimaryGender, as: 'primaryGender'}] },
        { model: Model.InstagramImages },
        { model: Model.UserLanguages, include: [{model: Model.Languages, as: 'language'}] },
        { model: Model.UserInterests, include: [{model: Model.Interests, as: 'interest'}] },
        { model: Model.UserAnswers,  include: [
          {
            model: Model.Answers,
            as: 'answer', 
            include: [
              {
                model: Model.Questions,
                as: 'question',  // The alias you may have defined in your FilterSettings model for RelationshipGoal
              }
            ]
          }
        ] },
        { model: Model.FilterSettings, include: [
          {
            model: Model.RelationshipGoal,
            as: 'relationshipGoal',  // The alias you may have defined in your FilterSettings model for RelationshipGoal
          }
        ] },
        { model: Model.UserPictures },

      ]
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
    console.log(error)
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
