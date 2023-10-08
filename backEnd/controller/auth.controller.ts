import {
  BAD_REQUEST,
  EMAIL_ALREADY_IN_USE,
  EMAIL_NOT_EXIST,
  EXPIRED_OR_INCORRECT_OTP,
  EXPIRED_TOKEN,
  INVALID_TOKEN,
  PHONE_NUMBER_NOT_EXIST,
  REVOKED_TOKEN,
  SERVER_ERR,
  TOKEN_NOT_FOUND,
  USER_ALREADY_EXIST,
  USER_CREATED,
  USER_NOT_FOUND_ERR,
} from "../constants/errors";
import * as AuthServices from "../services/auth.services";
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

/**
 * Register a new user.
 * This function handles the entire user registration process, including validation,
 * creating various user settings, and issuing JWT tokens.
 */
async function registerUser(req: express.Request, res: express.Response) {
  const t = await sequelize.transaction(); // Start a new transaction

  try {
    // Validate uploaded pictures
    const files = AuthServices.validateUploadedPictures(req);

    // Transform and validate request body
    const parsedBody = AuthServices.transformRequestBody(req.body);
    const value = validateUser(parsedBody);

    // Create a new user
    const newUser = await AuthServices.createUser(value, t);

    // Create initial settings and data for the user
    await AuthServices.createInitialUserSettings(newUser.id, value, t);

    // Create JWT tokens
    const { accessToken, refreshToken } = await AuthServices.createJWTTokens(
      newUser.id,
      t
    );

    // Add pictures to S3 and user records
    await AuthServices.handleUserPictures(files, newUser.id, t);

    await t.commit();

    return sendSuccessResponse(res, 202, USER_CREATED, {
      accessToken,
      refreshToken,
    });
  } catch (error) {
    await t.rollback();
    const errorMessage = (error as Error).message;
    const status = centralizedErrorHandler(errorMessage);
    console.error(`User registration failed: ${errorMessage}`);
    return sendErrorResponse(
      res,
      status,
      status !== 500 ? errorMessage : SERVER_ERR
    );
  }
}

/**
 * Logs out a user by deactivating their refresh token.
 *
 * This function performs several steps:
 * 1. Validates the 'grantType' from the request body to ensure it's a "refresh_token".
 * 2. Extracts the refresh token from the request header.
 * 3. Validates the extracted token.
 * 4. Deactivates the token using an Auth service.
 *
 * @throws {Error} Throws an error if token validation fails or if the token cannot be deactivated.
 *
 * @example
 * // Expected usage:
 * logOutUser(req, res);
 *
 * Note: This function is part of the authentication flow and is expected to be called
 * after the user is already authenticated and wishes to log out.
 */

async function logOutUser(req: express.Request, res: express.Response) {
  try {
    // Extract and validate grant type from the request body
    const { grantType } = req.body;
    validateGrantType(grantType, "refresh_token");

    // Extract and validate the refresh token from the request header
    const refreshToken = extractTokenFromHeader(req) as string;
    const { error, value } = validateToken({ token: refreshToken });

    // If token is invalid, send an error response
    if (error) {
      return sendErrorResponse(res, 400, error.details[0].message);
    }

    // Deactivate the refresh token
    await AuthServices.deactivateRefreshToken(value.token);

    // Send a success response
    return sendSuccessResponse(res, 200, "Logged out successfully.");
  } catch (error) {
    // Handle unexpected errors
    const errorMessage = (error as Error).message;
    const status = centralizedErrorHandler(errorMessage);

    // Log the error for debugging
    console.error("Logout failed:", error);

    return sendErrorResponse(
      res,
      status,
      status != 500 ? errorMessage : SERVER_ERR
    );
  }
}

/**
 * Deletes a user and all associated records.
 */
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

    const userId = decode.sub;
    await AuthServices.deleteUserAssociations(userId, t);
    await AuthServices.deleteUserRecord(userId, t);

    await awsServices.deleteUserFolderFromS3(decode.sub.toString());

    await t.commit();

    return sendSuccessResponse(
      res,
      200,
      "User's account successfully deleted."
    );
  } catch (error) {
    await t.rollback(); // If there's an error, rollback all database operations
    console.error("Error while deleting user:", error);
    const errorMessage = (error as Error).message;
    const status = centralizedErrorHandler(errorMessage);
    return sendErrorResponse(
      res,
      status,
      status != 500 ? errorMessage : SERVER_ERR
    );
  }
}

/**
 * Refreshes access and refresh tokens.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 *
 * @throws Will throw an error if the refresh token is invalid, revoked, or expired.
 * @returns A JSON response containing the new tokens if successful.
 */
async function refreshToken(req: express.Request, res: express.Response) {
  try {
    const { grantType } = req.body;
    validateGrantType(grantType, "refresh_token");

    const refreshToken = extractTokenFromHeader(req) as string;

    const { error, value } = validateToken({ token: refreshToken });
    if (error) {
      return sendErrorResponse(res, 400, error.details[0].message);
    }

    const tokenDoc = await Model.RefreshTokens.findOne({
      where: { token: value.token },
    });
    if (!tokenDoc) throw new Error(TOKEN_NOT_FOUND);

    if (tokenDoc.revoked) throw new Error(REVOKED_TOKEN);

    const currentDate = new Date();
    if (new Date(tokenDoc.expiresAt) <= currentDate) {
      throw new Error(EXPIRED_TOKEN);
    }

    const decoded = decodeRefreshToken(value.token);

    if (decoded) {
      const { refreshToken, accessToken } = await AuthServices.refreshUserToken(
        decoded.sub,
        tokenDoc
      );

      return sendSuccessResponse(
        res,
        200,
        "Tokens were refreshed successfully.",
        { refreshToken, accessToken }
      );
    } else {
      throw new Error(INVALID_TOKEN);
    }
  } catch (error) {
    console.error("Error while refreshing token:", error);
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage); // Assume you have this function

    return sendErrorResponse(
      res,
      status,
      status != 500 ? errorMessage : SERVER_ERR
    );
  }
}

/**
 * Checks if an email already exists in the database.
 *
 * @async
 * @param {express.Request} req - The incoming HTTP request.
 * @param {express.Response} res - The outgoing HTTP response.
 * @throws Will throw an error if email validation fails or if other exceptions occur.
 * @returns - HTTP response with status code and message.
 */
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

/**
 * Checks if a phone number already exists in the database.
 *
 * @async
 * @param {express.Request} req - The incoming HTTP request containing the phone number to validate.
 * @param {express.Response} res - The outgoing HTTP response to be sent.
 * @throws Will throw an error if phone number validation fails or other exceptions occur.
 * @returns - HTTP response with status code and either a success or error message.
 */
async function phoneNumberExist(req: express.Request, res: express.Response) {
  try {
    const { error, value } = validatePhoneNumber(req.body);

    if (error) {
      return sendErrorResponse(res, 400, error.details[0].message);
    }

    const response = await AuthServices.findUserByPhoneNumber(value.phoneNumber);

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

/**
 * Checks if a user ID already exists in the database.
 *
 * @async
 * @param {express.Request} req - The incoming HTTP request containing the user ID to validate.
 * @param {express.Response} res - The outgoing HTTP response to be sent.
 * @throws Will throw an error if ID validation fails or other exceptions occur.
 * @returns - HTTP response with status code and either a success or error message.
 */
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

/**
 * Changes a user's phone number.
 * 
 * @async
 * @function changePhoneNumber
 * @param {express.Request} req - Express request object containing the access token and phone numbers.
 * @param {express.Response} res - Express response object used to send the response back to the client.
 * @throws Will throw an error if any validation fails or if the operation couldn't be completed.
 * @returns  Returns a response with a status code indicating the result of the operation.
 */
async function changePhoneNumber(req: express.Request, res: express.Response) {
  try {
    const { grantType, oldPhoneNumber, newPhoneNumber } = req.body;
    validateGrantType(grantType, "access_token");

    const accessToken = extractTokenFromHeader(req) as string;
    const { error } = validateChangePhoneNumber({ accessToken, oldPhoneNumber, newPhoneNumber });
    if (error) return sendErrorResponse(res, 400, error.details[0].message);

    const decode = decodeAccessToken(accessToken);
    if (!decode) throw new Error(EXPIRED_TOKEN);

    const user = await Model.User.findByPk(decode.sub);
    if (!user || user.phoneNumber !== oldPhoneNumber) throw new Error(user ? BAD_REQUEST : USER_NOT_FOUND_ERR);
    
    if (user.phoneNumber === newPhoneNumber) throw new Error("New phone number is the same as the old one.");

    await user.update({ phoneNumber: newPhoneNumber });

    return sendSuccessResponse(res, 200, "User's phone number has been updated.");
  } catch (error) {
    const errorMessage = (error as Error).message;
    const status = centralizedErrorHandler(errorMessage);
    return sendErrorResponse(res, status, status !== 500 ? errorMessage : SERVER_ERR);
  }
}

/**
 * Updates a user's email in the database.
 *
 * @async
 * @function
 * @param {express.Request} req - The request object containing the `grantType`, `oldEmail`, and `newEmail` in the body.
 * @param {express.Response} res - The response object used to send back HTTP status and messages.
 * @returns  Sends a 200 status code along with a success message if the email is successfully updated; otherwise, sends an error status code and error message.
 * 
 * @throws Will throw an error if any validation fails, such as token expiration, email validity, etc.
 * @throws Will throw an error if the new email is the same as the old email.
 * @throws Will throw an error if the new email is already in use.
 */
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

    const existingUserWithNewEmail = await Model.User.findOne({
      where: { email: value.newEmail },
    });
    if (existingUserWithNewEmail) throw new Error(EMAIL_ALREADY_IN_USE);

    const user = await Model.User.findOne({
      where: { id: decode.sub, email: value.oldEmail },
    });
    if (!user) throw new Error(USER_NOT_FOUND_ERR);
    

    if (value.newEmail === value.oldEmail) throw new Error(BAD_REQUEST);

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

/**
 * Remove a user's email from the database.
 * 
 * This function handles the logic for removing a user's email from the database.
 * It first validates the access token and then proceeds to remove the email.
 * 
 * @async
 * @function
 * @param {express.Request} req - Express request object containing user details.
 * @param {express.Response} res - Express response object for sending back responses.
 * 
 * @throws {Error} Throws an error if the access token is invalid or expired.
 * @throws {Error} Throws an error if the user is not found.
 * @throws {Error} Throws other errors based on the centralized error handler.
 * 
 */
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

    const user = await Model.User.findByPk(decode.sub);
    if (!user) throw new Error(USER_NOT_FOUND_ERR);

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

/**
 * Asynchronously sends a One-Time Password (OTP) to the user's phone number.
 *
 * @async
 * @function
 * @param {express.Request} req - Express request object, expects `phoneNumber` in the body.
 * @param {express.Response} res - Express response object.
 * @returns Returns a Promise resolving to an Express response.
 * 
 * @throws {Error} Throws an error if the phone number is invalid.
 * @throws {Error} Throws an error if sending OTP fails.
 * @throws {Error} Throws an error if unable to save OTP to the database.
 * @throws {Error} Throws an error if any other unhandled error occurs, handled by `centralizedErrorHandler`.
 */
async function sendOTP(req: express.Request, res: express.Response) {
  try {
    const { phoneNumber } = req.body;
    const { error, value } = validatePhoneNumber({ phoneNumber });

    if (error) {
      return sendErrorResponse(res, 400, error.details[0].message);
    }

    const otp = AuthServices.generateOTP();

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    await Model.PhoneNumberOTP.destroy({ where: { phoneNumber } });
    
    const otpDocument = new Model.PhoneNumberOTP({
      phoneNumber,
      otp,
      expiresAt 
    } as any);
    
    await AuthServices.sendSMS(otp, phoneNumber);
    
    await otpDocument.save();

    return sendSuccessResponse(res, 200, "OTP sent successfully");

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

/**
 * Verifies the OTP provided in the request body and either logs in the user or prepares for user registration.
 *
 * @async
 * @function
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @returns - A Promise that resolves when the OTP verification is complete and the response is sent.
 * 
 * @throws {Error} Throws an error if any of the following conditions are met:
 * - Validation fails for phone number or OTP.
 * - OTP is incorrect or expired.
 * - Transaction rollback is required due to an error.
 */
async function verifyOTP(req: express.Request, res: express.Response) {
  const t = await sequelize.transaction(); 

  try {
    const { phoneNumber, otp } = req.body;
    const { error } = Joi.object({
      phoneNumber: Joi.string().required(),
      otp: Joi.string().required(),
    }).validate({ phoneNumber, otp });
    if (error) {
      throw new Error(error.details[0].message);
    }

    await AuthServices.verifyOTPDocument(phoneNumber, otp, t);
    await Model.PhoneNumberOTP.destroy({ where: { phoneNumber }, transaction: t });

    const userDoc = await AuthServices.findUserByPhoneNumber(phoneNumber, t);
    if (userDoc) {
      const accessToken = createAccessToken(userDoc.id) as string;
      const refreshToken = createRefreshToken(userDoc.id) as string;
      await AuthServices.updateUserRefreshTokenInDB(userDoc.id, refreshToken, t);
      await t.commit();
      return sendSuccessResponse(res, 200, "OTP verified and correct.", { newUser: false, accessToken, refreshToken });
    }
    
    await t.commit();
    return sendSuccessResponse(res, 200, "OTP verified and correct.", { newUser: true });

  } catch (error) {
    console.log(error);
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

    const userDoc = await Model.User.findOne({ where: { email } });

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

    await Model.EmailToken.destroy({ where: { email } });

    const EmailTokenDoc = new Model.EmailToken({
      token,
      email,
    } as any);

    await EmailTokenDoc.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "flyleaf.dev@gmail.com",
        pass: "sayb epqp cgzn dtme",
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
    console.log(error);
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
      transaction: t,
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

    const userDoc = await Model.User.findOne({
      where: { email: decoded.email },
      transaction: t,
    });

    if (decoded.purpose === "login") {
      if (userDoc) {
        const authCode = crypto.randomBytes(16).toString("hex");

        await Model.AuthCode.destroy({
          where: {
            userId: userDoc.id,
          },
          transaction: t,
        });

        // You can create a new model for storing this one-time use code or use existing models
        const authCodeDoc = new Model.AuthCode({
          code: authCode,
          userId: userDoc.id,
        } as any);

        await authCodeDoc.save({ transaction: t });
        await t.commit();
        return res
          .status(200)
          .redirect(
            `flyleaf://login/verify?emailVerified=true&authCode=${authCode}`
          );
      } else {
        return res.status(200).redirect(`flyleaf://`);
      }
    } else if (decoded.purpose === "register") {
      if (!userDoc)
        return res
          .status(200)
          .redirect(`flyleaf://register/verify?emailVerified=true`);
      else return res.status(200).redirect(`flyleaf://`);
    } else {
      throw new Error(INVALID_TOKEN);
    }
  } catch (error) {
    console.log(error);

    await t.rollback();
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage);

    return sendErrorResponse(res, status, errorMessage);
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
    const authCodeDoc = await Model.AuthCode.findOne({
      where: { code: authCode },
      transaction: t,
    });

    if (!authCodeDoc) {
      return sendErrorResponse(res, 400, "Invalid or expired authCode");
    }

    // If the code is valid, fetch or create the accessToken and refreshToken
    const userId = authCodeDoc.userId;
    const accessToken = createAccessToken(userId.toString()) as string;
    const refreshToken = createRefreshToken(userId.toString()) as string;

    // Create or update refreshToken in database
    await AuthServices.updateUserRefreshTokenInDB(userId, refreshToken, t);

    // Remove the used authCode
    await Model.AuthCode.destroy({
      where: { id: authCodeDoc.id },
      transaction: t,
    });

    await t.commit();

    return sendSuccessResponse(res, 200, "Tokens fetched successfully", {
      accessToken,
      refreshToken,
    });
  } catch (error) {
    await t.rollback();
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage);

    return sendErrorResponse(
      res,
      status,
      status !== 500 ? errorMessage : SERVER_ERR
    );
  }
}

/**
 * THE ONES BELOW HAVE NOT BEEN CHECKED AND TESTED
 */

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
    const user = await Model.User.findOne({ where: { email } });
    if (user) {
      const accessToken = createAccessToken(user.id.toString()) as string;
      const refreshToken = createRefreshToken(user.id.toString()) as string;

      // Create or update refreshToken in database
      await AuthServices.updateUserRefreshTokenInDB(user.id, refreshToken);
      return sendSuccessResponse(res, 200, "Logged in with Google", {
        user,
        accessToken,
        refreshToken,
        newUser: false,
      });
    } else {
      return sendSuccessResponse(res, 202, "Logged in with Google", {
        email,
        newUser: true,
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
    const user = await Model.User.findOne({ where: { email } });
    if (user) {
      const accessToken = createAccessToken(user.id.toString()) as string;
      const refreshToken = createRefreshToken(user.id.toString()) as string;

      // Create or update refreshToken in database
      await AuthServices.updateUserRefreshTokenInDB(user.id, refreshToken);
      return sendSuccessResponse(res, 200, "Logged in with Facebook", {
        user,
        accessToken,
        refreshToken,
        newUser: false,
      });
    } else {
      return sendSuccessResponse(res, 200, "Logged in with Facebook", {
        email,
        newUser: true,
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
