import { Op } from 'sequelize';
import {
  FAILED_CREATION_ACCESS_AND_REFRESH_TOKEN,
  INVALID_DATA,
  REVOKED_TOKEN,
  TOKEN_NOT_FOUND,
} from '../constants/errors';
import Model from '../models';
import { createAccessToken, createRefreshToken } from '../utils/token.utils';
import awsServices from './aws.services';

/**
 * Updates or creates a new refresh token for the given user in the database.
 *
 * @param userId - The ID of the user.
 * @param refreshToken - The new refresh token.
 * @param transaction - Optional transaction object for database operations.
 */
export async function updateUserRefreshTokenInDB(userId: string, refreshToken: string, transaction?: any) {
  let tokenDoc = await Model.RefreshTokens.findOne({ where: { userId }, transaction });

  if (tokenDoc) {
    await Model.RefreshTokens.update(
      {
        revoked: null,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // expires in 30 days
      },
      { where: { userId }, transaction }
    );
  } else {
    await Model.RefreshTokens.create(
      {
        userId,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // expires in 30 days
      } as any,
      { transaction }
    );
  }
}

/**
 * Deactivates a given refresh token.
 *
 * @param refreshToken - The refresh token to deactivate.
 * @returns An object with the status and message.
 * @throws Will throw an error if the token is not found or already revoked.
 */
export async function deactivateRefreshToken(refreshToken: string) {
  const tokenDoc = await Model.RefreshTokens.findOne({ where: { token: refreshToken } });

  if (!tokenDoc) {
    throw new Error(TOKEN_NOT_FOUND);
  }

  if (tokenDoc.revoked) {
    throw new Error(REVOKED_TOKEN);
  }

  await tokenDoc.update({ revoked: new Date() });

  return { status: 'success', message: REVOKED_TOKEN };
}

/**
 * Checks if an email already exists in the database.
 *
 * @param data - Object containing the email to check.
 * @returns A promise resolving with the user data if email exists, otherwise null.
 */
export async function emailExistService(data: { email: string }) {
  const emailExist = await Model.User.findOne({ where: { email: data.email } });
  return emailExist;
}

/**
 * Checks if a phone number already exists in the database.
 *
 * @param data - Object containing the phone number to check.
 * @returns A promise resolving with the user data if phone number exists, otherwise null.
 */
export async function phoneNumberExistService(data: { phoneNumber: string }) {
  const phoneNumberExist = await Model.User.findOne({ where: { phoneNumber: data.phoneNumber } });
  return phoneNumberExist;
}

/**
 * Checks if a user ID already exists in the database.
 *
 * @param data - Object containing the user ID to check.
 * @returns A promise resolving with the user data if user ID exists, otherwise null.
 */
export async function uidExistService(data: { id: string }) {
  const user = await Model.User.findOne({ where: { id: data.id } });
  return user;
}

/**
 * Validates uploaded pictures from the request.
 * Ensures that at least two pictures have been uploaded.
 *
 * @param req - Express request object
 * @throws {Error} - Throws an error if validation fails
 * @return {Array} - Array of validated files
 */
export function validateUploadedPictures(req: Express.Request): Array<any> { 
  const files = req.files;

  if (!files || !Array.isArray(files) || files.length < 2) {
    throw new Error("None or less than two pictures have been uploaded.");
  }

  return files;
}

/**
 * Transforms and cleans the request body.
 * Parses certain fields from strings to their proper types.
 *
 * @param body - Object containing the raw request body
 * @return {Object} - Transformed request body
 */
export function transformRequestBody(body: any): any {
  const transformedBody = body;
    transformedBody.seekingIds = JSON.parse(transformedBody.seekingIds);
  transformedBody.interestsIds = JSON.parse(transformedBody.interestsIds);
  transformedBody.answers = JSON.parse(transformedBody.answers);
  transformedBody.primaryGenderId = Number(transformedBody.primaryGenderId); 
  transformedBody.secondaryGenderId =  transformedBody.secondaryGenderId && Number(transformedBody.secondaryGenderId); 
  transformedBody.longitude = parseFloat(transformedBody.longitude);  
  transformedBody.latitude = parseFloat(transformedBody.latitude);  
  transformedBody.relationshipGoalId = Number(transformedBody.relationshipGoalId);

  return transformedBody;
}

/**
 * Creates a new user in the database.
 *
 * @param value - Object containing validated user data
 * @param t - Database transaction
 * @return {Promise<Object>} - Promise resolving to the new user
 */
export async function createUser(value: any, t: any): Promise<any> {
  const newUser = await Model.User.create({
    firstName: value.firstName,
    email: value.email,
    phoneNumber: value.phoneNumber,
    primaryGenderId: value.primaryGenderId,
    secondaryGenderId: value.secondaryGenderId,
    dateOfBirth: value.dateOfBirth,
    longitude: value.longitude,
    latitude: value.latitude,
    verified: value.email && value.phoneNumber ? true : false

  } as any, {transaction: t})
// Create UserInterests in parallel
const userInterestsPromises = value.interestsIds.map((interestId:number) => {
  return Model.UserInterests.create({
    userId: newUser.id,
    interestId: interestId
  } as any, {transaction: t});
});

// Create UserSeekingGender in parallel
const userSeekingGenderPromises = value.seekingIds.map((seekingId:number) => {
  return Model.UserSeekingGender.create({
    userId: newUser.id,
    primaryGenderId: seekingId
  } as any, {transaction: t});
});

// Validate answers and create UserAnswers in parallel
const userAnswersPromises = value.answers.map(async (answer:{questionId:number, answerId:number}) => {
  const answerDoc = await Model.Answers.findByPk(answer.answerId);
  if (!answerDoc || answerDoc.questionId !== answer.questionId) {
    throw new Error(INVALID_DATA);
  }

  return Model.UserAnswers.create({
    userId: newUser.id,
    answerId: answer.answerId
  } as any, {transaction: t});
});

// Wait for all promises to resolve
await Promise.all([...userInterestsPromises, ...userSeekingGenderPromises, ...userAnswersPromises]);


  return newUser;
}

/**
 * Sets up initial settings tables for a new user.
 *
 * @param userId - ID of the new user
 * @param value - Object containing validated user data
 * @param t - Database transaction
 */
export async function createInitialUserSettings(userId: string, value: any, t: any) {
  const promises = [
    await Model.AccountSettings.create({userId} as any, {transaction: t}),
    await Model.FilterSettings.create({userId, relationshipGoalId: value.relationshipGoalId} as any, {transaction: t}),
    await Model.NotificationSettings.create({userId } as any, {transaction: t}),
    await Model.PrivacySettings.create({userId} as any, {transaction: t}),
  ];
  
  await Promise.all(promises);
}

/**
 * Creates JWT access and refresh tokens.
 *
 * @param userId - ID of the user
 * @return {Object} - Object containing access and refresh tokens
 */
export async function createJWTTokens(userId: string, t:any){
  // Create jwt tokens
  const accessToken = createAccessToken(userId);
  const refreshToken = createRefreshToken(userId);

  if (!refreshToken || !accessToken)
    throw new Error(FAILED_CREATION_ACCESS_AND_REFRESH_TOKEN);

  const currentDate = new Date();
  const expiresAt = new Date(currentDate);
  expiresAt.setDate(currentDate.getDate() + 30);

  await Model.RefreshTokens.create({userId: userId, token: refreshToken, expiresAt} as any, {transaction: t})

  return { accessToken, refreshToken };
}

/**
 * Uploads user pictures to S3 and records them in the database.
 *
 * @param files - Array of files to upload
 * @param userId - ID of the user
 * @param t - Database transaction
 */
export async function handleUserPictures(files: Array<any>, userId: string, t: any) {
  await awsServices.addUserPicturesToS3(files, userId)
  .then(async (result) => {
    const picturePromises = result.map(async (picName: string, index: number) => {
      return Model.UserPictures.create(
        { userId: userId, name: picName, orderIndex: index, isProfilePicture: index === 0 ? true : false } as any,
        { transaction: t }
      );
    });
    await Promise.all(picturePromises);
  });
}

/**
 * Deletes a user record from the database.
 *
 * @param userId - The ID of the user to delete.
 * @param t - The transaction object for database operations.
 * @returns A promise resolving when the user is deleted.
 */
export async function deleteUserRecord(userId: string, t: any) {
  return Model.User.destroy({ where: { id: userId }, transaction: t });
}

/**
 * Deletes all associated records for a given user.
 *
 * @param userId - The ID of the user whose associations to delete.
 * @param t - The transaction object for database operations.
 * @returns A promise resolving when all associated records are deleted.
 */
export async function deleteUserAssociations(userId: string, t: any) {
  const deleteTasks = [
    Model.AccountSettings.destroy({ where: { userId }, transaction: t }),
      Model.PrivacySettings.destroy({ where: { userId }, transaction: t }),
   Model.FilterSettings.destroy({ where: { userId }, transaction: t }),
      Model.UserInterests.destroy({ where: { userId }, transaction: t }),
      Model.NotificationSettings.destroy({ where: { userId }, transaction: t }),
    Model.UserAnswers.destroy({ where: { userId }, transaction: t }),
      Model.UserLanguages.destroy({ where: { userId }, transaction: t }),
      Model.RefreshTokens.destroy({ where: { userId }, transaction: t }),
      Model.UserPictures.destroy({ where: { userId }, transaction: t }),
      Model.Conversations.destroy({
       where: {
         [Op.or]: [
           { user1Id: userId },
           { user2Id: userId }
         ]
       },
       transaction: t
     }),
      Model.DeviceInfo.destroy({ where: { userId }, transaction: t }),
      Model.InstagramImages.destroy({ where: { userId }, transaction: t }),
      Model.InstagramTokens.destroy({ where: { userId }, transaction: t }),
    Model.Messages.destroy({ where: { userId }, transaction: t }),
      Model.NotificationsHistory.destroy({ where: { userId }, transaction: t }),
      Model.Payments.destroy({ where: { userId }, transaction: t }),
    Model.SpotifyTokens.destroy({ where: { userId }, transaction: t }),
      Model.UserTopArtists.destroy({ where: { userId }, transaction: t }),
      Model.UserSubscriptions.destroy({ where: { userId }, transaction: t }),
    Model.UserBlocked.destroy({ where: { userId }, transaction: t }),
      Model.UserMatches.destroy({ where: { userId }, transaction: t }),
    Model.UserSeekingGender.destroy({ where: { userId }, transaction: t }),
   ];
  return Promise.all(deleteTasks);
}