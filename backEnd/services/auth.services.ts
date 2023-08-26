import * as TYPES from "../../types";
import { EMAIL_NOT_EXIST,  PHONE_NUMBER_NOT_EXIST, REVOKED_TOKEN, TOKEN_NOT_FOUND, UID_NOT_EXIST, USER_ALREADY_EXIST, USER_CREATED } from "../errors";
import PicturesModel from "../models/pictures.model";
import RefreshTokenModel from "../models/refreshToken.model";
import SettingsModel from "../models/settings.model";
import UserModel from "../models/user.model";




async function addUserToDB(userData:TYPES.User,  session?: any) {
    try{
        const newUser = new UserModel(userData);
        await newUser.save({ session });
    
        return newUser
    } catch (error:any) {
        throw new Error(error.message)
    }
    
}

async function addUserSettingsToDB(settingsData: TYPES.Settings, session?: any) {
    try {
        const connectedSettings = new SettingsModel(settingsData);
        await connectedSettings.save({ session }); 

        return connectedSettings
    } catch (error:any) {
        throw new Error(error.message)
    }
}


async function addUserPicturesToDB(picturesData:TYPES.Pictures, session?: any) {
    try {
    const connectedPhotos = new PicturesModel(picturesData);
    await connectedPhotos.save({ session })

    return connectedPhotos
    }
    catch (error:any) {
        throw new Error(error.message)
    }
}

async function addUserRefreshTokenToDB(refreshTokenData: TYPES.RefreshToken, session?: any) {
    try {
    const connectedRefreshToken = new RefreshTokenModel(refreshTokenData);
    await connectedRefreshToken.save({ session })

    return connectedRefreshToken
    }
    catch (error:any) {
        throw new Error(error.message)
    }
}

async function deactivateRefreshToken(refreshToken: string){
    try{
        const tokenDoc = await RefreshTokenModel.findOne({token: refreshToken})
        if(!tokenDoc){
            throw new Error(TOKEN_NOT_FOUND)
        }

        if(tokenDoc.revoked){
            throw new Error(REVOKED_TOKEN)
        }

        tokenDoc.revoked = new Date();
        await tokenDoc.save();
        
        return { status: "success", message: "Token has been revoked." };

    }  catch (error:any) {
        throw new Error(error.message)
    }
}


async function emailExistService(data: {email:string}) {
    const emailExist = await UserModel.findOne({ email: data.email });
    return emailExist
}


async function phoneNumberExistService(data: {phoneNumber:string}) {
    const phoneNumberExist = await UserModel.findOne({ phoneNumber: data.phoneNumber });
    return phoneNumberExist
}

async function uidExistService(data:{_id: string}) {
    const user = await UserModel.findOne({ _id: data._id });
    return user
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
};

export default AuthServices
