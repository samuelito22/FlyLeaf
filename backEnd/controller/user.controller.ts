import express from "express";
import {
  EXPIRED_TOKEN,
  UNAUTHORIZED_REQUEST,
  USER_NOT_FOUND_ERR,
} from "../constants/errors";
import UserModel from "../models/user.model";
import { decodeAccessToken, extractTokenFromHeader, validateGrantType } from "../utils/token.utils";
import { validateToken } from "../validators/auth.validator";
import centralizedErrorHandler from "../utils/centralizedErrorHandler.utils";
import { sendErrorResponse } from "../utils/response.utils";
import { COLLECT_ADDITIONAL_INFORMATION, COLLECT_GENDER, COLLECT_INSTAGRAM, COLLECT_INTERESTS, COLLECT_LANGUAGES, COLLECT_PICTURES, COLLECT_PREMIUM_FEATURES, COLLECT_SEEKING, COLLECT_SETTINGS, COLLECT_SPOTIFY } from "../utils/aggregate.utils";

async function getProfile(req: express.Request, res: express.Response) {
  try {
    const {grantType} = req.body
    validateGrantType(grantType , 'access_token')

    const accessToken = extractTokenFromHeader(req) as string
    const { error, value } = validateToken({ token: accessToken });

    if (error) {
      return res.status(400).json({
        type: "error",
        message: error.details[0].message,
      });
    }

    const decode = decodeAccessToken(accessToken);
    if (!decode) throw new Error(EXPIRED_TOKEN);

    let user = await UserModel.findById(decode.sub);
    if (!user) throw new Error(USER_NOT_FOUND_ERR);

    user.lastActive = new Date();

    await user.save();

    const pipeline = [
      {
        $match: { _id: decode.sub } // to filter out the specific user
      },
      ...COLLECT_PICTURES,
      ...COLLECT_SEEKING,  
      ...COLLECT_INTERESTS ,
      ...COLLECT_GENDER   ,
      ...COLLECT_SETTINGS,
      ...COLLECT_ADDITIONAL_INFORMATION,
    ];

    if (user.languages && user.languages.length > 0) {
      pipeline.push(...COLLECT_LANGUAGES as any) ;
    }

    if (user.spotify) {
      pipeline.push(...COLLECT_SPOTIFY as any) ;
    }

    if (user.instagram) {
      pipeline.push(...COLLECT_INSTAGRAM as any) ;
    }

    if (user.premium) {
      pipeline.push(...COLLECT_PREMIUM_FEATURES as any) ;
    }

  
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

const userController = {
  getProfile,
};
export default userController;
