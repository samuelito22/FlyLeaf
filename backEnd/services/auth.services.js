import { EMAIL_NOT_EXIST, PHONE_NUMBER_NOT_EXIST, UID_NOT_EXIST, USER_ALREADY_EXIST, USER_CREATED } from "../errors.js";
import User from "../models/user.model.js";
import { 
    validateUser, 
    validateEmail, 
    validatePhoneNumber, 
    validateUid 
} from '../validators/auth.validator.js';

async function registerUserService(userData) {
    const { error, value } = validateUser(userData);

    if (error) {
        throw new Error(error.details[0].message);
    }

    const userExist = await User.findOne({ uid: value.uid });
    if (userExist) {
        throw new Error(USER_ALREADY_EXIST);
    }
    
    const newUser = new User(value);
    await newUser.save();
    return USER_CREATED;
}

async function emailExistService(data) {
    const { error, value } = validateEmail(data);

    if (error) {
        throw new Error(error.details[0].message);
    }

    const emailExist = await User.findOne({ email: value.email });
    if (emailExist) {
        throw new Error(USER_ALREADY_EXIST);
    }
    return EMAIL_NOT_EXIST;
}

async function phoneExistService(data) {
    const { error, value } = validatePhoneNumber(data);

    if (error) {
        throw new Error(error.details[0].message);
    }

    const phoneNumberExist = await User.findOne({ phoneNumber: value.phoneNumber });
    if (phoneNumberExist) {
        throw new Error(USER_ALREADY_EXIST);
    }
    return PHONE_NUMBER_NOT_EXIST;
}

async function uidExistService(data) {
    const { error, value } = validateUid(data);

    if (error) {
        throw new Error(error.details[0].message);
    }

    const user = await User.findOne({ uid: value.uid });
    if (user) {
        throw new Error(USER_ALREADY_EXIST);
    }
    return UID_NOT_EXIST;
}

const AuthServices = {
    registerUserService,
    emailExistService,
    phoneExistService,
    uidExistService
};

export default AuthServices
