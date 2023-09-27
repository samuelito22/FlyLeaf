import {
  BAD_REQUEST,
  EMAIL_NOT_EXIST,
  EXPIRED_OR_INCORRECT_OTP,
  EXPIRED_TOKEN,
  FAILED_CREATION_ACCESS_AND_REFRESH_TOKEN,
  FAILED_SEND_OTP,
  INVALID_DATA,
  INVALID_TOKEN,
  OTP_ALREADY_USED,
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
import {
  createAccessToken,
  createRefreshToken,
  decodeAccessToken,
  decodeRefreshToken,
  extractTokenFromHeader,
  validateGrantType,
} from "../utils/token.utils";
import centralizedErrorHandler from "../utils/centralizedErrorHandler.utils";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../utils/response.utils";
import AWS from "aws-sdk";
import Joi from "joi";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { GOOGLE_CLIENT_ID, NODEMAILER_SECRET } from "../config/config";
import crypto from "crypto";
import axios from "axios";
import { OAuth2Client } from "google-auth-library";
import awsServices from "../services/aws.services";
import { sequelize } from "../config/sequelizeConfig";
import Model from "../models";
import { RefreshTokens } from "../models/refreshTokens";
import { Op } from "sequelize";

async function registerUser(req: express.Request, res: express.Response) {
  const t = await sequelize.transaction(); // Start a new transaction

  try {
    const files = req.files;

    if (!files || !Array.isArray(files) || files.length < 2) {
      return sendErrorResponse(
        res,
        400,
        "None or less than two pictures have been uploaded."
      );
    }

    let parsedBody = req.body;
    parsedBody.seekingIds = JSON.parse(parsedBody.seekingIds);
parsedBody.interestsIds = JSON.parse(parsedBody.interestsIds);
parsedBody.answers = JSON.parse(parsedBody.answers);
parsedBody.primaryGenderId = Number(parsedBody.primaryGenderId); 
parsedBody.secondaryGenderId =  parsedBody.secondaryGenderId && Number(parsedBody.secondaryGenderId); 
parsedBody.longitude = parseFloat(parsedBody.longitude);  
parsedBody.latitude = parseFloat(parsedBody.latitude);  
parsedBody.relationshipGoalId = Number(parsedBody.relationshipGoalId);

console.log(parsedBody)


    const value = validateUser(parsedBody);

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

    // Creating inital tables related to the user
    await Model.AccountSettings.create({userId: newUser.id} as any, {transaction: t})
    await Model.FilterSettings.create({userId: newUser.id, relationshipGoalId: value.relationshipGoalId} as any, {transaction: t})
    await Model.NotificationSettings.create({userId: newUser.id } as any, {transaction: t})
    await Model.PrivacySettings.create({userId: newUser.id} as any, {transaction: t})
    for (let interestId of value.interestsIds) {
      await Model.UserInterests.create({
          userId: newUser.id,
          interestId: interestId
      } as any, {transaction: t});
  }
  for (let answer of value.answers) {
    const answerDoc = await Model.Answers.findByPk(answer.answerId);
    if (!answerDoc || answerDoc.questionId !== answer.questionId) {
      throw new Error(INVALID_DATA)
    }
      await Model.UserAnswers.create({
          userId: newUser.id,
          answerId: answer.answerId
      } as any, {transaction: t});
  }

   // Create jwt tokens
   const accessToken = createAccessToken(newUser.id);
   const refreshToken = createRefreshToken(newUser.id);

   if (!refreshToken || !accessToken)
     throw new Error(FAILED_CREATION_ACCESS_AND_REFRESH_TOKEN);

   const currentDate = new Date();
   const expiresAt = new Date(currentDate);
   expiresAt.setDate(currentDate.getDate() + 30);

   await RefreshTokens.create({userId: newUser.id, token: refreshToken, expiresAt} as any, {transaction: t})

   await awsServices.addUserPicturesToS3(files, newUser.id.toString())
   .then(async (result) => {
     const picturePromises = result.map(async (picName: string, index: number) => {
       return Model.UserPictures.create(
         { userId: newUser.id, name: picName, orderIndex: index, isProfilePicture: index === 0 ? true : false } as any,
         { transaction: t }
       );
     });
     await Promise.all(picturePromises);
   });
 
    
    await t.commit();

    return sendSuccessResponse(res, 202, USER_CREATED, {
      accessToken,
      refreshToken,
    });

  } catch (error) {
    await t.rollback(); // If there's an error, rollback all database operations

    const errorMessage = (error as Error).message;
    const status = centralizedErrorHandler(errorMessage);
    console.log(errorMessage)
    return sendErrorResponse(res, status, status != 500 ? errorMessage : SERVER_ERR);
  }
}

async function logOutUser(req: express.Request, res: express.Response) {
  try {
    const { grantType } = req.body;
    validateGrantType(grantType, "refresh_token");

    const refreshToken = extractTokenFromHeader(req) as string;

    const { error, value } = validateToken({ token: refreshToken });
    if (error) {
      return sendErrorResponse(res, 400, error.details[0].message);
    }

    await AuthServices.deactivateRefreshToken(value.token);

    return sendSuccessResponse(res, 200, "Logged out successfully.");
  } catch (error) {
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage);

    return sendErrorResponse(
      res,
      status,
      status != 500 ? errorMessage : SERVER_ERR
    );
  }
}

async function deleteUser(req: express.Request, res: express.Response) {
  const t = await sequelize.transaction();

  try {
    const { grantType } = req.body;
    validateGrantType(grantType, "access_token");

    const accessToken = extractTokenFromHeader(req) as string;
    const { error, value } = validateToken({ token: accessToken });

    if (error) {
      return sendErrorResponse(res, 400, error.details[0].message);
    }

    const decode = decodeAccessToken(value.token);
    if (!decode) throw new Error(EXPIRED_TOKEN);

    const userId = decode.sub

    // Delete associated records for the User
  await Model.AccountSettings.destroy({ where: { userId }, transaction: t });
  await Model.PrivacySettings.destroy({ where: { userId }, transaction: t });
  await Model.FilterSettings.destroy({ where: { userId }, transaction: t });
  await Model.UserInterests.destroy({ where: { userId }, transaction: t });
  await Model.NotificationSettings.destroy({ where: { userId }, transaction: t });
  await Model.UserAnswers.destroy({ where: { userId }, transaction: t });
  await Model.UserLanguages.destroy({ where: { userId }, transaction: t });
  await Model.RefreshTokens.destroy({ where: { userId }, transaction: t });
  await Model.UserPictures.destroy({ where: { userId }, transaction: t });
  await Model.Conversations.destroy({
    where: {
      [Op.or]: [
        { user1Id: userId },
        { user2Id: userId }
      ]
    },
    transaction: t
  });
    await Model.DeviceInfo.destroy({ where: { userId }, transaction: t });
  await Model.InstagramImages.destroy({ where: { userId }, transaction: t });
  await Model.InstagramTokens.destroy({ where: { userId }, transaction: t });
  await Model.Messages.destroy({ where: { userId }, transaction: t });
  await Model.NotificationsHistory.destroy({ where: { userId }, transaction: t });
  await Model.Payments.destroy({ where: { userId }, transaction: t });
  await Model.SpotifyTokens.destroy({ where: { userId }, transaction: t });
  await Model.UserTopArtists.destroy({ where: { userId }, transaction: t });
  await Model.UserSubscriptions.destroy({ where: { userId }, transaction: t });
  await Model.UserBlocked.destroy({ where: { userId }, transaction: t });
  await Model.UserMatches.destroy({ where: { userId }, transaction: t });
  await Model.UserSeekingGender.destroy({ where: { userId }, transaction: t });

  // Finally, delete the user
  await Model.User.destroy({ where: { id: userId }, transaction: t });

    await t.commit();

    await awsServices.deleteUserFolderFromS3(decode.sub.toString());

    return sendSuccessResponse(
      res,
      200,
      "User's account successfully deleted."
    );
  } catch (error) {
    await t.rollback(); // If there's an error, rollback all database operations

    const errorMessage = (error as Error).message;
    const status = centralizedErrorHandler(errorMessage);
    return sendErrorResponse(res, status, status != 500 ? errorMessage : SERVER_ERR);
  }
}

async function refreshToken(req: express.Request, res: express.Response) {
  try {
    const { grantType } = req.body;
    validateGrantType(grantType, 'refresh_token');

    const refreshToken = extractTokenFromHeader(req) as string;

    const { error, value } = validateToken({ token: refreshToken });
    if (error) {
      return sendErrorResponse(res, 400, error.details[0].message);
    }

    const tokenDoc = await Model.RefreshTokens.findOne({ where: { token: value.token } });
    if (!tokenDoc) throw new Error(TOKEN_NOT_FOUND);

    if (tokenDoc.revoked) throw new Error(REVOKED_TOKEN);

    const currentDate = new Date();
    if (new Date(tokenDoc.expiresAt) <= currentDate) {
      throw new Error(EXPIRED_TOKEN);
    }

    const decoded = decodeRefreshToken(value.token);

    if (decoded) {
      const accessToken = createAccessToken(decoded.sub.toString());
      const refreshToken = createRefreshToken(decoded.sub.toString());

      if (!accessToken || !refreshToken) {
        throw new Error(FAILED_CREATION_ACCESS_AND_REFRESH_TOKEN);
      }

      const expiresAt = new Date();
      expiresAt.setDate(currentDate.getDate() + 30);

      tokenDoc.replacedByToken = tokenDoc.token;
      tokenDoc.token = refreshToken;
      tokenDoc.expiresAt = expiresAt;

      await tokenDoc.save().catch((e) => {
        throw new Error(e.message);
      });

      return sendSuccessResponse(res, 200, 'Tokens were refreshed successfully.', { refreshToken, accessToken });
    } else {
      throw new Error(INVALID_TOKEN);
    }
  } catch (error) {
    console.error("Error while refreshing token:", error)
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage); // Assume you have this function

    return sendErrorResponse(res, status, status != 500 ? errorMessage : SERVER_ERR);
  }
}

async function emailExist(req: express.Request, res: express.Response) {
  try {
    const { error, value } = validateEmail(req.body);

    if (error) {
      return sendErrorResponse(res, 400, error.details[0].message);
    }

    const response = await AuthServices.emailExistService(value);

    if (response) return sendSuccessResponse(res, 200, USER_ALREADY_EXIST);
    else throw new Error(EMAIL_NOT_EXIST);
  } catch (error) {
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage);

    return sendErrorResponse(
      res,
      status,
      status != 500 ? errorMessage : SERVER_ERR
    );
  }
}

async function phoneNumberExist(req: express.Request, res: express.Response) {
  try {
    const { error, value } = validatePhoneNumber(req.body);

    if (error) {
      return sendErrorResponse(res, 400, error.details[0].message);
    }

    const response = await AuthServices.phoneNumberExistService(value);

    if (response) return sendSuccessResponse(res, 200, USER_ALREADY_EXIST);
    else throw new Error(PHONE_NUMBER_NOT_EXIST);
  } catch (error) {
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage);

    return sendErrorResponse(
      res,
      status,
      status != 500 ? errorMessage : SERVER_ERR
    );
  }
}

async function idExist(req: express.Request, res: express.Response) {
  try {
    const { error, value } = validateId(req.body);

    if (error) {
      return sendErrorResponse(res, 400, error.details[0].message);
    }

    const response = await AuthServices.uidExistService(value);

    if (response) return sendSuccessResponse(res, 200, USER_ALREADY_EXIST);
    else throw new Error(USER_NOT_FOUND_ERR);
  } catch (error) {
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage);

    return sendErrorResponse(
      res,
      status,
      status != 500 ? errorMessage : SERVER_ERR
    );
  }
}

async function changePhoneNumber(req: express.Request, res: express.Response) {
  try {
    const { grantType, oldPhoneNumber, newPhoneNumber } = req.body;
    validateGrantType(grantType, 'access_token');

    const accessToken = extractTokenFromHeader(req) as string;
    const { error } = validateChangePhoneNumber({
      accessToken,
      oldPhoneNumber,
      newPhoneNumber,
    });

    if (error) {
      return sendErrorResponse(res, 400, error.details[0].message);
    }

    const decode = decodeAccessToken(accessToken);
    if (!decode) throw new Error(EXPIRED_TOKEN);

    const userWithPhoneNumber = await Model.User.findOne({ where: { phoneNumber: newPhoneNumber } });
    if (userWithPhoneNumber) throw new Error(USER_ALREADY_EXIST);

    const user = await Model.User.findByPk(decode.sub);
    if (!user || user.phoneNumber !== oldPhoneNumber) {
      throw new Error(user ? BAD_REQUEST : USER_NOT_FOUND_ERR);
    }

    await user.update({ phoneNumber: newPhoneNumber });

    return sendSuccessResponse(res, 200, "User's phone number has been updated.");
  } catch (error) {
    const errorMessage = (error as Error).message;
    const status = centralizedErrorHandler(errorMessage);
    return sendErrorResponse(res, status, status !== 500 ? errorMessage : SERVER_ERR);
  }
}

async function changeEmail(req: express.Request, res: express.Response) {
  try {
    const { grantType, oldEmail, newEmail } = req.body;
    validateGrantType(grantType, "access_token");

    const accessToken = extractTokenFromHeader(req) as string;
    const { error, value } = validateChangeEmail({
      accessToken,
      oldEmail,
      newEmail,
    });

    if (error) {
      return sendErrorResponse(res, 400, error.details[0].message);
    }

    const decode = decodeAccessToken(accessToken);
    if (!decode) throw new Error(EXPIRED_TOKEN);

    // Check for user and email validity together
    const user = await Model.User.findOne({ where: { id: decode.sub, email: value.oldEmail } });
    if (!user) throw new Error(USER_NOT_FOUND_ERR);

    // Check if new email is the same as old email
    if (value.newEmail === value.oldEmail) throw new Error(BAD_REQUEST);

    // Update the email directly
    await user.update({ email: value.newEmail });

    return sendSuccessResponse(res, 200, "User's email has been updated.");
  } catch (error) {
    const errorMessage = (error as Error).message;
    const status = centralizedErrorHandler(errorMessage);
    return sendErrorResponse(
      res,
      status,
      status != 500 ? errorMessage : SERVER_ERR
    );
  }
}


async function removeEmail(req: express.Request, res: express.Response) {
  try {
    const { grantType } = req.body;
    validateGrantType(grantType, "access_token");

    const accessToken = extractTokenFromHeader(req) as string;
    const { error, value } = validateToken({ token: accessToken });

    if (error) {
      return sendErrorResponse(res, 400, error.details[0].message);
    }

    const decode = decodeAccessToken(value.token);
    if (!decode) throw new Error(EXPIRED_TOKEN);

    // Find the user by ID
    const user = await Model.User.findByPk(decode.sub);
    if (!user) throw new Error(USER_NOT_FOUND_ERR);

    // Remove the email directly if it exists
    if (user.email) {
      await user.update({ email: undefined });
    }

    return sendSuccessResponse(res, 200, "User's email has been removed.");
  } catch (error) {
    const errorMessage = (error as Error).message;
    const status = centralizedErrorHandler(errorMessage);
    return sendErrorResponse(
      res,
      status,
      status != 500 ? errorMessage : SERVER_ERR
    );
  }
}

async function sendOTP(req: express.Request, res: express.Response) {
  try {
    const { phoneNumber } = req.body;
    const { error, value } = validatePhoneNumber({ phoneNumber });

    if (error) {
      return sendErrorResponse(res, 400, error.details[0].message);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // OTP will expire in 15 minutes
    await Model.PhoneNumberOTP.destroy({where: {phoneNumber}})

    // Create a new OTP document
    const otpDocument = new Model.PhoneNumberOTP({
      phoneNumber,
      otp,
     } as any);

    const sns = new AWS.SNS();

    const params = {
      Message: `Your FlyLeaf OTP code is ${otp}`,
      PhoneNumber: phoneNumber,
    };

    sns.publish(params, async (err: any, data: any) => {
      if (err) {
        throw new Error(FAILED_SEND_OTP);
      }
      await otpDocument.save();
      return sendSuccessResponse(res, 200, "OTP sent successfully");
    });
  } catch (error) {
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage);

    return sendErrorResponse(
      res,
      status,
      status != 500 ? errorMessage : SERVER_ERR
    );
  }
}

async function verifyOTP(req: express.Request, res: express.Response) {
  const t = await sequelize.transaction(); // Start Sequelize transaction
  try {
    const { phoneNumber, otp } = req.body;
    const { error, value } = Joi.object({
      phoneNumber: Joi.string().required(),
      otp: Joi.string().required(),
    }).validate({ phoneNumber, otp });

    if (error) {
      return sendErrorResponse(res, 400, error.details[0].message);
    }

    const otpDocument = await Model.PhoneNumberOTP.findOne({
      where: { phoneNumber },
      transaction: t,
    });

    if (!otpDocument) {
      throw new Error(SERVER_ERR);
    }

    if (otpDocument.otp !== otp) {
      throw new Error(EXPIRED_OR_INCORRECT_OTP);
    }

    await Model.PhoneNumberOTP.destroy({ where: { id: otpDocument.id }, transaction: t });

    const userDoc = await Model.User.findOne({ where: { phoneNumber }, transaction: t });

    if (userDoc) {
      const accessToken = createAccessToken(userDoc.id) as string
      const refreshToken = createRefreshToken(userDoc.id) as string
      await AuthServices.updateUserRefreshTokenInDB(userDoc.id, refreshToken, t);

      await t.commit();
      return sendSuccessResponse(res, 200, "OTP verified and correct.", {
        newUser: false,
        accessToken,
        refreshToken,
      });
    }

    await t.commit();
    return sendSuccessResponse(res, 200, "OTP verified and correct.", { newUser: true });
  } catch (error) {
    await t.rollback();
    const errorMessage = (error as Error).message;
    const status = centralizedErrorHandler(errorMessage);
    return sendErrorResponse(res, status, status !== 500 ? errorMessage : SERVER_ERR);
  }
}

async function sendLink(req: express.Request, res: express.Response) {
  try {
    const { email, grantType } = req.body;
    const { error, value } = validateEmail({ email });

    if (error) {
      return sendErrorResponse(res, 400, error.details[0].message);
    }

    if (!["login", "register"].includes(grantType)) {
      return sendErrorResponse(
        res,
        400,
        "Grant type can either be login or register."
      );
    }

    const userDoc = await Model.User.findOne({ where:{email} })

    if (grantType === "login" && !userDoc) {
      throw new Error(USER_NOT_FOUND_ERR);

    }

    if (grantType === "register" && userDoc) {
      throw new Error(USER_ALREADY_EXIST);

    }

    if (!NODEMAILER_SECRET) {
      return res.status(500).json({ error: SERVER_ERR });
    }

    const token = jwt.sign(
      { email, purpose: grantType === "login" ? "login" : "register" },
      NODEMAILER_SECRET,
      { expiresIn: "15m" }
    );

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    await Model.EmailToken.destroy({ where:{email} })

    const EmailTokenDoc = new Model.EmailToken({
      token,
      email,
    } as any);

    await EmailTokenDoc.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "flyleaf.dev@gmail.com",
        pass: "nzriccfimllfmuhx",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const info = await transporter.sendMail({
      from: '"Flyleaf Team" <no-reply@flyleaf.com>',
      to: email,
      subject: "Secure Login Link from Flyleaf",
      html: `
  <p>Hello,</p>
  <p>Thank you for choosing Flyleaf! We're excited to help you make meaningful connections.</p>
  <p>For your security, please use the link below to log in to your Flyleaf account:</p>
  <a href="http://192.168.4.79:4000/api/auth/log-in/verify-login-link/${token}">Log in to Flyleaf</a>
  <p>This link will expire in 15 minutes. If you did not request this link, you can safely ignore this email.</p>
  <p>Best regards,</p>
  <p>The Flyleaf Team</p>
`,
    });

    return sendSuccessResponse(res, 200, "Email link sent successfully.");
  } catch (error) {
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage);

    return sendErrorResponse(
      res,
      status,
      status != 500 ? errorMessage : SERVER_ERR
    );
  }
}

async function verifyLink(req: express.Request, res: express.Response) {
  const t = await sequelize.transaction(); // Start Sequelize transaction
  try {
    const { token } = req.params;
    const { error, value } = validateToken({ token });

    if (error) {
      return sendErrorResponse(res, 400, error.details[0].message);
    }

    if (!NODEMAILER_SECRET) {
      return res.status(500).json({ error: SERVER_ERR });
    }

    const result = await Model.EmailToken.destroy({
      where: { token },
      transaction: t
    });

    if (!result) {
      throw new Error(INVALID_TOKEN);
    }

    let decoded;
    try {
      decoded = jwt.verify(token, NODEMAILER_SECRET) as {
        email: string;
        purpose: string;
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error(EXPIRED_TOKEN);
      } else {
        throw new Error(INVALID_TOKEN);
      }
    }

     const userDoc = await Model.User.findOne({ where:{email: decoded.email}, transaction:t })

    if (decoded.purpose === "login") {
     

      if (userDoc) {
        const authCode = crypto.randomBytes(16).toString("hex");

        // You can create a new model for storing this one-time use code or use existing models
        const authCodeDoc = new Model.AuthCode({
          code: authCode,
          userId: userDoc.id,
        } as any);

        await authCodeDoc.save({transaction: t});
        await t.commit()
        return res.status(200).redirect(`flyleaf://login/verify?emailVerified=true&authCode=${authCode}`);
      }

      else{
        return res.status(200).redirect(`flyleaf://`);
      }
    } else if (decoded.purpose === "register") {
      if(!userDoc) return res.status(200).redirect(`flyleaf://register/verify?emailVerified=true`);
      else return res.status(200).redirect(`flyleaf://`);
    } else {
      throw new Error(INVALID_TOKEN);
    }
  } catch (error) {
    await t.rollback()
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage);

    return sendErrorResponse(res, status, errorMessage)
  }
}

async function validateAuthCodeAndFetchTokens(
  req: express.Request,
  res: express.Response
) {
  const t = await sequelize.transaction(); // Start Sequelize transaction

  try {
    const { authCode } = req.body;

    // Validate that an authCode was actually sent in the request
    if (!authCode) {
      return sendErrorResponse(res, 400, "Missing authCode");
    }

    // Search for the authCode in the database
    const authCodeDoc = await Model.AuthCode.findOne({ where:{code: authCode}, transaction:t })

    if (!authCodeDoc) {
      return sendErrorResponse(res, 400, "Invalid or expired authCode");
    }

    // If the code is valid, fetch or create the accessToken and refreshToken
    const userId = authCodeDoc.userId;
    const accessToken = createAccessToken(userId.toString()) as string;
    const refreshToken = createRefreshToken(userId.toString()) as string;

    // Create or update refreshToken in database
    await AuthServices.updateUserRefreshTokenInDB(
      userId,
      refreshToken,
      t
    );

    // Remove the used authCode
    await Model.AuthCode.destroy({
      where: { id: authCodeDoc.id },
      transaction:t
    });

    await t.commit()

    return sendSuccessResponse(res, 200, "Tokens fetched successfully", {
      accessToken,
      refreshToken,
    });
  } catch (error) {
    await t.rollback()
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage);

    return sendErrorResponse(
      res,
      status,
      status !== 500 ? errorMessage : SERVER_ERR
    );
  }
}

// Google Sign-In
async function googleSignIn(req: express.Request, res: express.Response) {
  try {
    const { grantType } = req.body;
    validateGrantType(grantType, "access_token");

    const accessToken = extractTokenFromHeader(req) as string;
    const { error, value } = validateToken({ token: accessToken });

    if (error) {
      return sendErrorResponse(res, 400, error.details[0].message);
    }

    const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

    const ticket = await googleClient.verifyIdToken({
      idToken: accessToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return sendErrorResponse(res, 400, "Invalid token payload");
    }

    const { email } = payload;

    // Find or create a user based on their email
    const user = await Model.User.findOne({ where: {email} });
    if (user) {
      const accessToken = createAccessToken(user.id.toString()) as string;
      const refreshToken = createRefreshToken(user.id.toString()) as string;

      // Create or update refreshToken in database
      await AuthServices.updateUserRefreshTokenInDB(user.id, refreshToken);
      return sendSuccessResponse(res, 200, "Logged in with Google", {
        user,
        accessToken,
        refreshToken,
        newUser: false
      });
    } else {
      return sendSuccessResponse(res, 202, "Logged in with Google", { email, newUser: true });
    }
  } catch (error) {
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage);

    return sendErrorResponse(
      res,
      status,
      status !== 500 ? errorMessage : SERVER_ERR
    );
  }
}

// Facebook Sign-In
async function facebookSignIn(req: express.Request, res: express.Response) {
  try {
    const { grantType } = req.body;
    validateGrantType(grantType, "access_token");

    const accessToken = extractTokenFromHeader(req) as string;
    const { error, value } = validateToken({ token: accessToken });

    if (error) {
      return sendErrorResponse(res, 400, error.details[0].message);
    }
    const fbResponse = await axios.get(
      `https://graph.facebook.com/me?fields=id,email&access_token=${accessToken}`
    );
    const { email } = fbResponse.data;

    // Find or create a user based on their email
    const user = await Model.User.findOne({ where:{email} });
    if (user) {
      const accessToken = createAccessToken(user.id.toString()) as string;
      const refreshToken = createRefreshToken(user.id.toString()) as string;

      // Create or update refreshToken in database
      await AuthServices.updateUserRefreshTokenInDB(user.id, refreshToken);
      return sendSuccessResponse(res, 200, "Logged in with Facebook", {
        user,
        accessToken,
        refreshToken,
        newUser: false
      });
    } else {
      return sendSuccessResponse(res, 200, "Logged in with Facebook", {
        email,
        newUser: true
      });
    }
  } catch (error) {
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage);

    return sendErrorResponse(
      res,
      status,
      status !== 500 ? errorMessage : SERVER_ERR
    );
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
  sendOTP,
  verifyOTP,
  sendLink,
  verifyLink,
  validateAuthCodeAndFetchTokens,
  googleSignIn,
  facebookSignIn,
};
export default authController;
