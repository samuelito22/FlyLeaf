import * as TYPES from "../../types";
import { EMAIL_NOT_EXIST, PHONE_NUMBER_NOT_EXIST, UID_NOT_EXIST, USER_ALREADY_EXIST, USER_CREATED } from "../errors";
import PicturesModel from "../models/pictures.model";
import RefreshTokenModel from "../models/refreshToken.model";
import SettingsModel from "../models/settings.model";
import UserModel from "../models/user.model";
import { 
    validateUser, 
    validateEmail, 
    validatePhoneNumber, 
    validateUid 
} from '../validators/auth.validator';
import  jwt  from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_JWT_SECRET;

async function addUserToDB(userData:TYPES.User,  session?: any) {
    try{
        const newUser = new UserModel(userData);
        await newUser.save({ session });
    
        return {userDB: newUser, type: "success"};
    } catch (error) {
        return { type: 'error', error: error}
    }
    
}

async function addUserSettingsToDB(settingsData: TYPES.Settings, session?: any) {
    try {
        const connectedSettings = new SettingsModel(settingsData);
        await connectedSettings.save({ session }); 

        return { settingsDB: connectedSettings, type: "success" };
    } catch (error) {
        return { type: 'error', error: error };
    }
}


async function addUserPicturesToDB(picturesData:TYPES.Pictures, session?: any) {
    try {
    const connectedPhotos = new PicturesModel(picturesData);
    await connectedPhotos.save({ session })

    return {photosDB: connectedPhotos, type: "success"};
    }
    catch (error) {
        return { type: 'error', error: error}
    }
}

async function addUserRefreshTokenToDB(refreshTokenData: TYPES.RefreshToken, session?: any) {
    try {
    const connectedRefreshToken = new RefreshTokenModel(refreshTokenData);
    await connectedRefreshToken.save({ session })

    return {refreshTokenDB: connectedRefreshToken, type: "success"};
    }
    catch (error) {
        return { type: 'error', error: error}
    }
}


async function emailExistService(data: {email:string}) {
    const { error, value } = validateEmail(data);

    if (error) {
        throw new Error(error.details[0].message);
    }

    const emailExist = await UserModel.findOne({ email: value.email });
    if (emailExist) {
        throw new Error(USER_ALREADY_EXIST);
    }
    return EMAIL_NOT_EXIST;
}

function createAccessToken(_id: string) {
    const payload = {
        sub: _id,  
        type: 'ACCESS', 
    };

    // The token will expire in 1 day (24 hours)
    if(ACCESS_SECRET) return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '1d' });
}

function createRefreshToken(_id: string) {
    const payload = {
        sub: _id,
        type: 'REFRESH',
    };

    // The token will expire in 30 days
    if(REFRESH_SECRET) return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '30d' });
}


async function phoneExistService(data: {phoneNumber:string}) {
    const { error, value } = validatePhoneNumber(data);

    if (error) {
        throw new Error(error.details[0].message);
    }

    const phoneNumberExist = await UserModel.findOne({ phoneNumber: value.phoneNumber });
    if (phoneNumberExist) {
        throw new Error(USER_ALREADY_EXIST);
    }
    return PHONE_NUMBER_NOT_EXIST;
}

async function uidExistService(data:{uid: string}) {
    const { error, value } = validateUid(data);

    if (error) {
        throw new Error(error.details[0].message);
    }

    const user = await UserModel.findOne({ _id: value._id });
    if (user) {
        throw new Error(USER_ALREADY_EXIST);
    }
    return UID_NOT_EXIST;
}

const AuthServices = {
    emailExistService,
    phoneExistService,
    uidExistService,
    createAccessToken,
    createRefreshToken,
    addUserPicturesToDB,
    addUserRefreshTokenToDB,
    addUserSettingsToDB,
    addUserToDB
};

export default AuthServices
