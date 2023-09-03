import {
  BAD_REQUEST,
  EMAIL_NOT_EXIST,
  EXPIRED_OR_INCORRECT_OTP,
  EXPIRED_TOKEN,
  FAILED_CREATION_ACCESS_AND_REFRESH_TOKEN,
  FAILED_SEND_OTP,
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
import UserModel from "../models/user.model";
import mongoose from "mongoose";
import PicturesModel from "../models/pictures.model";
import SettingsModel from "../models/settings.model";
import RefreshTokenModel from "../models/refreshToken.model";
import PremiumModel from "../models/premium.model";
import InstagramModel from "../models/instagram.model";
import SpotifyModel from "../models/spotify.model";
import {
  createAccessToken,
  createRefreshToken,
  decodeAccessToken,
  decodeRefreshToken,
  extractTokenFromHeader,
  validateGrantType,
} from "../utils/token.utils";
import centralizedErrorHandler from "../utils/centralizedErrorHandler.utils";
import { sendErrorResponse, sendSuccessResponse } from "../utils/response.utils";
import { convertToObjectIdRecursive } from "../utils/converter.utils";
import UserResponse from "../models/response.model";
import AWS from "aws-sdk"
import OTPModel from "../models/otp.model";
import Joi from "joi";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"
import { GOOGLE_CLIENT_ID, NODEMAILER_SECRET } from "../config/config";
import EmailTokenModel from "../models/emailToken.model";
import AuthCodeModel from "../models/authCode.model";
import crypto from "crypto"
import axios from "axios";
import { OAuth2Client } from "google-auth-library";
import awsServices from "../services/aws.services";


// @route POST auth/users/register
// @desc Register user
// @access Public
async function registerUser(req: express.Request, res: express.Response) {
  const session = await mongoose.startSession();
  const newUserId = new mongoose.Types.ObjectId();
  try {
    session.startTransaction();

    const files = req.files
  
    if (!files || !Array.isArray(files) || files.length < 2) {
      return sendErrorResponse(res, 400, "None or less than two pictures have been uploaded.")
    }
    

    // Check if the req body is valid
    let { error, value } = validateUser(req.body);
    if (error) {
      return sendErrorResponse(res,400, error.details[0].message)

    }

    value = await convertToObjectIdRecursive(value)
    value._id = newUserId;

    // Check if user already exists
    const userExist = await UserModel.findOne({ _id: value._id }, null, {
      session,
    });
    if (userExist) {
      throw new Error(USER_ALREADY_EXIST);
    }

    // Create the user's response model
    await AuthServices.addUserResponsesToDB({_id: value._id, responses: value.additionalInformation}, session)

    // Create the user's settings model
    await AuthServices.addUserSettingsToDB({ _id: value._id }, session);

    // Create the user's user model
    await AuthServices.addUserToDB(value, session);

    // Create jwt tokens
    const accessToken = createAccessToken(value._id);
    const refreshToken = createRefreshToken(value._id);

    if (!refreshToken || !accessToken)
      throw new Error(FAILED_CREATION_ACCESS_AND_REFRESH_TOKEN);

    const currentDate = new Date();
    const expiresAt = new Date(currentDate);
    expiresAt.setDate(currentDate.getDate() + 30);

    await AuthServices.addUserRefreshTokenToDB(
      { _id: value._id, token: refreshToken, expiresAt },
      session
    );

    value.pictures = await awsServices.addUserPicturesToS3(files, newUserId.toString() )
    // Create the user's photo model
    const picturePromises = value.pictures.map((pic: any) => {
      return AuthServices.addUserPicturesToDB(
        { user_id: value._id, name: pic },
        session
      );
    });
    
     await Promise.all(picturePromises);
    await session.commitTransaction();
  session.endSession();



    return res.status(202).json({
      type: "success",
      message: USER_CREATED,
      accessToken,
      refreshToken,
    });

  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage)

    return sendErrorResponse(res,status, status != 500 ? errorMessage : SERVER_ERR)

  } finally {
    session.endSession();
  }
}

async function logOutUser(req: express.Request, res: express.Response) {
  try {
    const {grantType} = req.body
    validateGrantType(grantType , 'refresh_token')


    const refreshToken = extractTokenFromHeader(req) as string

    const { error, value } = validateToken({ token: refreshToken });
    if (error) {
      return sendErrorResponse(res,400, error.details[0].message)

    }

    await AuthServices.deactivateRefreshToken(value.token);

    return sendSuccessResponse(res, 200,"Logged out successfully.")
  } catch (error) {
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage)

    return sendErrorResponse(res,status, status != 500 ? errorMessage : SERVER_ERR)
  }
}

async function deleteUser(req: express.Request, res: express.Response) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {grantType} = req.body
    validateGrantType(grantType , 'access_token')


    const accessToken = extractTokenFromHeader(req) as string
    const { error, value } = validateToken({ token: accessToken });

    if (error) {
      return sendErrorResponse(res,400, error.details[0].message)

    }

    const decode = decodeAccessToken(value.token);
    if (!decode) throw new Error(EXPIRED_TOKEN);

    
    const user = await UserModel.findById(decode.sub).session(session);
    if (!user) {
      throw new Error(USER_NOT_FOUND_ERR);
    }

    // delete user's repsonses
    await UserResponse.deleteOne({_id: decode.sub}).session(session)

    // delete user's pictures
    await PicturesModel.deleteMany({ user_id: decode.sub }).session(session);

    // delete user's instagram
    if (user?.instagram) {
      await InstagramModel.deleteOne({ _id: user.instagram }).session(session);
    }

    // delete user's spotify (fix the model name here)
    if (user?.spotify) {
      await SpotifyModel.deleteOne({ _id: user.spotify }).session(session);
    }

    // delete user's settings
    await SettingsModel.deleteOne({ _id: decode.sub }).session(session);

    // delete user's refresh token
    await RefreshTokenModel.deleteMany({ _id: decode.sub }).session(session);

    // delete user's premium
    await PremiumModel.deleteOne({ _id: decode.sub }).session(session);

    // delete user
    await UserModel.deleteOne({ _id: decode.sub }).session(session);

    await session.commitTransaction();

    await awsServices.deleteUserFolderFromS3(decode.sub.toString())

    return sendSuccessResponse(res, 200,"User's account successfully deleted.")

  } catch (error) {
    await session.abortTransaction();

    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage)

    return sendErrorResponse(res,status, status != 500 ? errorMessage : SERVER_ERR)
  } finally {
    session.endSession();
  }
}


async function refreshToken(req: express.Request, res: express.Response) {
  try {
    const {grantType} = req.body
    validateGrantType(grantType , 'refresh_token')


    const refreshToken = extractTokenFromHeader(req) as string

    const { error, value } = validateToken({ token: refreshToken });
    if (error) {
      return sendErrorResponse(res,400, error.details[0].message)

    }

    const tokenDoc = await RefreshTokenModel.findOne({
      token: value.token,
    });
    if (!tokenDoc) throw new Error(TOKEN_NOT_FOUND);

    if (tokenDoc.revoked) throw new Error(REVOKED_TOKEN);

    const currentDate = new Date();
    if (tokenDoc.expiresAt <= currentDate) {
      throw new Error(EXPIRED_TOKEN);
    }

    const decoded = decodeRefreshToken(value.token);

    if (decoded) {
      const accessToken = createAccessToken(decoded.sub.toString());
      const refreshToken = createRefreshToken(decoded.sub.toString());

      if (!accessToken || !refreshToken) {
        throw new Error(FAILED_CREATION_ACCESS_AND_REFRESH_TOKEN);
      }

      const currentDate = new Date();
      const expiresAt = new Date(currentDate);
      expiresAt.setDate(currentDate.getDate() + 30);

      tokenDoc.replacedByToken = tokenDoc.token;
      tokenDoc.token = refreshToken;
      tokenDoc.expiresAt = expiresAt;

      await tokenDoc.save().catch((e) => {
        throw new Error(e.message);
      });

      return sendSuccessResponse(res, 200, "Tokens were refreshed successfully.", {refreshToken, accessToken} )
    
    } else {
      throw new Error(INVALID_TOKEN);
    }
  } catch (error) {
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage)

    return sendErrorResponse(res,status, status != 500 ? errorMessage : SERVER_ERR)
  }

}

// @route GET auth/users/emailExist
// @desc Get if the email exists
// @access Public
async function emailExist(req: express.Request, res: express.Response) {
  try {
    const { error, value } = validateEmail(req.body);

    if (error) {
      return sendErrorResponse(res,400, error.details[0].message)
    }

    const response = await AuthServices.emailExistService(value);

    if (response)
     
      return  sendSuccessResponse(res, 200, USER_ALREADY_EXIST)

    else
      throw new Error(EMAIL_NOT_EXIST)
  } catch (error) {
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage)

    return sendErrorResponse(res,status, status != 500 ? errorMessage : SERVER_ERR)
  }
}

// @route GET auth/users/phoneExist
// @desc Get if the phone exists
// @access Public
async function phoneNumberExist(req: express.Request, res: express.Response) {
  try {
    const { error, value } = validatePhoneNumber(req.body);

    if (error) {
      return sendErrorResponse(res,400, error.details[0].message)

    }

    const response = await AuthServices.phoneNumberExistService(value);

    if (response)
    return  sendSuccessResponse(res, 200, USER_ALREADY_EXIST)

    else
      throw new Error(PHONE_NUMBER_NOT_EXIST)
  } catch (error) {
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage)

    return sendErrorResponse(res,status, status != 500 ? errorMessage : SERVER_ERR)
  }
}

// @route GET auth/users/uidExist
// @desc Get if the user uid exists
// @access Public
async function idExist(req: express.Request, res: express.Response) {
  try {
    const { error, value } = validateId(req.body);

    if (error) {
      return sendErrorResponse(res,400, error.details[0].message)

    }

    const response = await AuthServices.uidExistService(value);

    if (response)
    return  sendSuccessResponse(res, 200, USER_ALREADY_EXIST)

    else
      throw new Error(USER_NOT_FOUND_ERR)
  } catch (error) {
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage)

    return sendErrorResponse(res,status, status != 500 ? errorMessage : SERVER_ERR)
  }
}

async function changePhoneNumber(req: express.Request, res: express.Response) {
  try {
    const {grantType, oldPhoneNumber, newPhoneNumber} = req.body
    validateGrantType(grantType , 'access_token')

    const accessToken = extractTokenFromHeader(req) as string
    const { error, value } = validateChangePhoneNumber({
      accessToken,
      oldPhoneNumber,
      newPhoneNumber
    });

    if (error) {
      return sendErrorResponse(res,400, error.details[0].message)

    }

    const decode = decodeAccessToken(value.accessToken);
    if (!decode) throw new Error(EXPIRED_TOKEN);

    const user = await UserModel.findById(decode.sub);
    if (!user) throw new Error(USER_NOT_FOUND_ERR);

    if (user.phoneNumber != value.oldPhoneNumber) throw new Error(BAD_REQUEST);
    user.phoneNumber = value.newPhoneNumber;

    const UserWithPhoneNumber = await UserModel.findOne({phoneNumber: newPhoneNumber})
    if(UserWithPhoneNumber) throw new Error(USER_ALREADY_EXIST)

    await user.save();

    return  sendSuccessResponse(res, 200,  "User's phone number has been updated.")

  } catch (error) {
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage)

    return sendErrorResponse(res,status, status != 500 ? errorMessage : SERVER_ERR)
  }
}

async function changeEmail(req: express.Request, res: express.Response) {
  try {
   const {grantType, oldEmail, newEmail} = req.body
    validateGrantType(grantType , 'access_token')

    const accessToken = extractTokenFromHeader(req) as string
    const { error, value } = validateChangeEmail({ accessToken, oldEmail, newEmail});

    if (error) {
      return sendErrorResponse(res,400, error.details[0].message)

    }

    const decode = decodeAccessToken(accessToken);
    if (!decode) throw new Error(EXPIRED_TOKEN);

    const user = await UserModel.findById(decode.sub);
    if (!user) throw new Error(USER_NOT_FOUND_ERR);

    if (user.email && user.email != value.oldEmail)
      throw new Error(BAD_REQUEST);
    if (value.newEmail == value.oldEmail) throw new Error(BAD_REQUEST);

    user.email = value.newEmail;

    await user.save();

    return  sendSuccessResponse(res, 200, "User's email has been updated.")

  } catch (error) {
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage)

    return sendErrorResponse(res,status, status != 500 ? errorMessage : SERVER_ERR)
  }
}

async function removeEmail(req: express.Request, res: express.Response) {
  try {
    const {grantType} = req.body
    validateGrantType(grantType , 'access_token')

    const accessToken = extractTokenFromHeader(req) as string
    const { error, value } = validateToken({ token: accessToken });

    if (error) {
      return sendErrorResponse(res,400, error.details[0].message)

    }

    const decode = decodeAccessToken(value.token);
    if (!decode) throw new Error(EXPIRED_TOKEN);

    const user = await UserModel.findById(decode.sub);
    if (!user) throw new Error(USER_NOT_FOUND_ERR);

    if (user.email) {
      user.email = undefined;
      await user.save();
    }

    return  sendSuccessResponse(res, 200, "User's email has been updated.")

  } catch (error) {
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage)

    return sendErrorResponse(res,status, status != 500 ? errorMessage : SERVER_ERR)
  }
}

async function sendOTP(req: express.Request, res: express.Response) {
  try {
    const {phoneNumber} = req.body
    const { error, value } = validatePhoneNumber({ phoneNumber });

    if (error) {
      return sendErrorResponse(res,400, error.details[0].message)

    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 15); // OTP will expire in 15 minutes
  await OTPModel.findOneAndRemove({ phoneNumber });


  // Create a new OTP document
  const otpDocument = new OTPModel({
    phoneNumber,
    otp,
    expiresAt,
  });  

    const sns = new AWS.SNS();

  
    const params = {
      Message: `Your OTP code is ${otp}`,
      PhoneNumber: phoneNumber,
    };


    sns.publish(params,async (err:any, data:any) => {
      if (err) {
        throw new Error(FAILED_SEND_OTP)
      }
      await otpDocument.save()
      return  sendSuccessResponse(res, 200, 'OTP sent successfully')

    });

  } catch (error) {
    const errorMessage = (error as Error).message;

    const status = centralizedErrorHandler(errorMessage)

    return sendErrorResponse(res,status, status != 500 ? errorMessage : SERVER_ERR)
  }
}


async function verifyOTP(req: express.Request, res: express.Response) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {phoneNumber, otp} = req.body
    const { error, value } = Joi.object({
      phoneNumber: Joi.string().required(),
      otp: Joi.string().required()
    }).validate({ phoneNumber, otp });
    
    if (error) {
      return sendErrorResponse(res,400, error.details[0].message)

    }

    const otpDocument = await OTPModel.findOne({phoneNumber}).session(session);

    if (!otpDocument) {
      throw new Error(SERVER_ERR);
    }

    if (otpDocument.otp !== otp) {
      throw new Error(EXPIRED_OR_INCORRECT_OTP);
    }

    await OTPModel.findByIdAndRemove(otpDocument._id).session(session);

    const userDoc = await UserModel.findOne({phoneNumber}).session(session);

      if(userDoc){
        const accessToken = createAccessToken(userDoc._id) as string
        const refreshToken = createRefreshToken(userDoc._id) as string
        await AuthServices.updateUserRefreshTokenInDB(userDoc._id, refreshToken, session)

      
        await session.commitTransaction();
        session.endSession();
        return  sendSuccessResponse(res, 200, 'OTP verified and correct.', {newUser: userDoc, accessToken, refreshToken})
      }

     
      await session.commitTransaction();
      session.endSession();
      return sendSuccessResponse(res, 200, 'OTP verified and correct.', {newUser: !userDoc});
  
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      const errorMessage = (error as Error).message;
      const status = centralizedErrorHandler(errorMessage);
      return sendErrorResponse(res, status, status !== 500 ? errorMessage : SERVER_ERR);
    }
  }

  async function sendLink(req: express.Request, res: express.Response) {
    try {
      const {email} = req.body
      const { error, value } = validateEmail({ email });
  
      if (error) {
        return sendErrorResponse(res,400, error.details[0].message)
  
      }

      await UserModel.findOne({email}).then(result => {
        if(!result) throw new Error(USER_NOT_FOUND_ERR)
      })

      if (!NODEMAILER_SECRET) {
        return res.status(500).json({ error: SERVER_ERR });
      }
  
      const token = jwt.sign({ email }, NODEMAILER_SECRET, { expiresIn: '15m' });

      const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 15); // OTP will expire in 15 minutes
  
  await EmailTokenModel.findOneAndRemove({ email });

      const EmailTokenDoc = new EmailTokenModel({
        token,
        email,
        expiresAt
      })

      await EmailTokenDoc.save()
  
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'flyleaf.dev@gmail.com',
          pass: 'nzriccfimllfmuhx'
        },
        tls: {
          rejectUnauthorized: false
        }
      });
  
      const info = await transporter.sendMail({
        from: '"Flyleaf Team" <no-reply@flyleaf.com>',
        to: email,
        subject: 'Secure Login Link from Flyleaf',
        html: `
  <p>Hello,</p>
  <p>Thank you for choosing Flyleaf! We're excited to help you make meaningful connections.</p>
  <p>For your security, please use the link below to log in to your Flyleaf account:</p>
  <a href="http://localhost:4000/api/auth/log-in/verify-login-link/${token}">Log in to Flyleaf</a>
  <p>This link will expire in 15 minutes. If you did not request this link, you can safely ignore this email.</p>
  <p>Best regards,</p>
  <p>The Flyleaf Team</p>
`

      });
  
      return  sendSuccessResponse(res, 200, 'Email link sent successfully.')

    } catch (error) {
      const errorMessage = (error as Error).message;
  
      const status = centralizedErrorHandler(errorMessage)
  
      return sendErrorResponse(res,status, status != 500 ? errorMessage : SERVER_ERR)
    }
  }

  async function verifyLink(req: express.Request, res: express.Response) {
    const session = await mongoose.startSession();
  session.startTransaction();
    try {
      const {token} = req.params
      const { error, value } = validateToken({ token });
  
      if (error) {
        return sendErrorResponse(res,400, error.details[0].message)
  
      }

      if (!NODEMAILER_SECRET) {
        return res.status(500).json({ error: SERVER_ERR });
      }
  
      let decoded;
    try {
      decoded = jwt.verify(token, NODEMAILER_SECRET) as { email: string };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error(EXPIRED_TOKEN);
      } else {
        throw new Error(INVALID_TOKEN);
      }
    }

    await EmailTokenModel.findOneAndRemove({email: decoded.email}).session(session);


    const userDoc = await UserModel.findOne({email: decoded.email}).session(session);

      if(userDoc){
        const authCode = crypto.randomBytes(16).toString('hex');

      // You can create a new model for storing this one-time use code or use existing models
      const authCodeDoc = new AuthCodeModel({
        code: authCode,
        userId: userDoc._id,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000) // expires in 5 minutes
      });

      await authCodeDoc.save({session})
      await session.commitTransaction();
      session.endSession();
      return res.redirect(`flyleaf://login/verify?authCode=${authCode}`);
      
      }



  
    } catch (error) {
      const errorMessage = (error as Error).message;
    
  
      const status = centralizedErrorHandler(errorMessage)
  
      return sendErrorResponse(res,status, status != 500 ? errorMessage : SERVER_ERR)
    }
  }

  async function validateAuthCodeAndFetchTokens(req: express.Request, res: express.Response) {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const { authCode } = req.query;
  
      // Validate that an authCode was actually sent in the request
      if (!authCode) {
        return sendErrorResponse(res, 400, "Missing authCode");
      }
  
      // Search for the authCode in the database
      const authCodeDoc = await AuthCodeModel.findOne({ code: authCode }).session(session);
  
      if (!authCodeDoc) {
        return sendErrorResponse(res, 400, "Invalid or expired authCode");
      }
  
      // If the code is valid, fetch or create the accessToken and refreshToken
      const userId = authCodeDoc.userId;
      const accessToken = createAccessToken(userId.toString()) as string;
      const refreshToken = createRefreshToken(userId.toString()) as string;
  
      // Create or update refreshToken in database
      await AuthServices.updateUserRefreshTokenInDB(userId, refreshToken, session)
  
      // Remove the used authCode
      await AuthCodeModel.findByIdAndRemove(authCodeDoc._id).session(session);
  
      await session.commitTransaction();
      session.endSession();
  
      return sendSuccessResponse(res, 200, "Tokens fetched successfully", { accessToken, refreshToken });
  
    } catch (error) {
      const errorMessage = (error as Error).message;
  
      const status = centralizedErrorHandler(errorMessage);
      await session.abortTransaction();
      session.endSession();
  
      return sendErrorResponse(res, status, status !== 500 ? errorMessage : SERVER_ERR);
    }
  }

  // Google Sign-In
  async function googleSignIn(req: express.Request, res: express.Response) {

    try {
      const { grantType } = req.body;
      validateGrantType(grantType, 'access_token');
  
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
        return sendErrorResponse(res, 400, 'Invalid token payload');
      }
  
      const { email } = payload;
  
      // Find or create a user based on their email
      const user = await UserModel.findOne({ email })
    if(user){
      const accessToken = createAccessToken(user._id.toString()) as string;
      const refreshToken = createRefreshToken(user._id.toString()) as string;
  
      // Create or update refreshToken in database
      await AuthServices.updateUserRefreshTokenInDB(user._id, refreshToken)
      return sendSuccessResponse(res, 200, 'Logged in with Google', {user, accessToken, refreshToken} )
    } else{
      return sendSuccessResponse(res, 202, 'Logged in with Google', {email} )
    }
    } catch (error) {
      const errorMessage = (error as Error).message;
  
      const status = centralizedErrorHandler(errorMessage);
  
      return sendErrorResponse(res, status, status !== 500 ? errorMessage : SERVER_ERR);
    }
  }
  

// Facebook Sign-In
async function facebookSignIn(req: express.Request, res: express.Response)  {

  try {
    const {grantType} = req.body
    validateGrantType(grantType , 'access_token')

    const accessToken = extractTokenFromHeader(req) as string
    const { error, value } = validateToken({ token: accessToken });

    if (error) {
      return sendErrorResponse(res,400, error.details[0].message)

    }
    const fbResponse = await axios.get(`https://graph.facebook.com/me?fields=id,email&access_token=${accessToken}`);
    const { email } = fbResponse.data;

    // Find or create a user based on their email
    const user = await UserModel.findOne({ email })
    if(user){
      const accessToken = createAccessToken(user._id.toString()) as string;
      const refreshToken = createRefreshToken(user._id.toString()) as string;
  
      // Create or update refreshToken in database
      await AuthServices.updateUserRefreshTokenInDB(user._id, refreshToken)
      return sendSuccessResponse(res, 200, 'Logged in with Facebook', {user, accessToken, refreshToken} )
    } else{
      return sendSuccessResponse(res, 200, 'Logged in with Facebook', {email} )
    }
  } catch (error) {
    const errorMessage = (error as Error).message;
  
    const status = centralizedErrorHandler(errorMessage);

    return sendErrorResponse(res, status, status !== 500 ? errorMessage : SERVER_ERR);
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
  facebookSignIn
};
export default authController;
