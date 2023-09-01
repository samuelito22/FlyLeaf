import mongoose, { Schema } from "mongoose";
import * as TYPES from "../../types";
import {
  EMAIL_NOT_EXIST,
  PHONE_NUMBER_NOT_EXIST,
  REVOKED_TOKEN,
  TOKEN_NOT_FOUND,
  UID_NOT_EXIST,
  USER_ALREADY_EXIST,
  USER_CREATED,
} from "../constants/errors";
import PicturesModel from "../models/pictures.model";
import RefreshTokenModel from "../models/refreshToken.model";
import UserResponse from "../models/response.model";
import SettingsModel from "../models/settings.model";
import UserModel from "../models/user.model";

async function addUserToDB(userData: TYPES.User, session?: any) {
  const newUser = new UserModel(userData);
  await newUser.save({ session });

  return newUser;
}

async function addUserSettingsToDB(
  settingsData: TYPES.Settings,
  session?: any
) {
  const connectedSettings = new SettingsModel(settingsData);
  await connectedSettings.save({ session });

  return connectedSettings;
}

async function addUserPicturesToDB(
  picturesData: TYPES.Pictures,
  session?: any
) {
  const connectedPhotos = new PicturesModel(picturesData);
  await connectedPhotos.save({ session });

  return connectedPhotos;
}

async function addUserResponsesToDB(
  responsesData: {_id: string, responses: {questionId: Schema.Types.ObjectId, answerId: Schema.Types.ObjectId}},
  session?: any
) {
  const connectedResponses = new UserResponse(responsesData);
  await connectedResponses.save({ session });

  return connectedResponses;
}

async function addUserRefreshTokenToDB(
  refreshTokenData: TYPES.RefreshToken,
  session?: any
) {
  const connectedRefreshToken = new RefreshTokenModel(refreshTokenData);
  await connectedRefreshToken.save({ session });

  return connectedRefreshToken;
}

async function updateUserRefreshTokenInDB(userId: mongoose.Types.ObjectId, refreshToken: string ,  session?: any ){
  let tokenDoc = await RefreshTokenModel.findById(userId).session(session);
  
      if (tokenDoc) {
        tokenDoc.revoked = undefined
        tokenDoc.token = refreshToken;
        tokenDoc.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);  // expires in 30 days
        await tokenDoc.save({ session });
      } else {
        const newTokenDoc = new RefreshTokenModel({
          _id: userId,
          token: refreshToken,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),  // expires in 30 days
        });
  
        await newTokenDoc.save({ session });
      }
}

async function deactivateRefreshToken(refreshToken: string) {
  const tokenDoc = await RefreshTokenModel.findOne({ token: refreshToken });
  if (!tokenDoc) {
    throw new Error(TOKEN_NOT_FOUND);
  }

  if (tokenDoc.revoked) {
    throw new Error(REVOKED_TOKEN);
  }

  tokenDoc.revoked = new Date();
  await tokenDoc.save();

  return { status: "success", message: REVOKED_TOKEN };
}

async function emailExistService(data: { email: string }) {
  const emailExist = await UserModel.findOne({ email: data.email });
  return emailExist;
}

async function phoneNumberExistService(data: { phoneNumber: string }) {
  const phoneNumberExist = await UserModel.findOne({
    phoneNumber: data.phoneNumber,
  });
  return phoneNumberExist;
}

async function uidExistService(data: { _id: string }) {
  const user = await UserModel.findOne({ _id: data._id });
  return user;
}

const AuthServices = {
  emailExistService,
  phoneNumberExistService,
  uidExistService,
  addUserPicturesToDB,
  addUserRefreshTokenToDB,
  addUserSettingsToDB,
  addUserToDB,
  deactivateRefreshToken,
  addUserResponsesToDB,
  updateUserRefreshTokenInDB
};

export default AuthServices;
