import Joi from 'joi';
import { objectIdRegex, phoneNumberRegex } from '../constants/regex';

interface ValidateUserInterface {
    firstName: string,
    dateOfBirth: Date,
    primaryGenderId: number,
    secondaryGenderId?: number,
    email?: string,
    phoneNumber?: string,
    longitude: number,
    latitude: number,
    interestsIds: number[],
    answers: {questionId: number, answerId: number}[],
    relationshipGoalId: number,
    seekingIds: number[]

}

const validateUser = (data:any) => {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        dateOfBirth: Joi.date().required(),
        primaryGenderId: Joi.number().required(),
        secondaryGenderId: Joi.number().optional(),
        email: Joi.string().email().optional(),
        phoneNumber: Joi.string().pattern(phoneNumberRegex).required(),
        longitude: Joi.number().required(),
        latitude: Joi.number().required(),
        interestsIds: Joi.array().items(Joi.number()).length(5).required(),
        answers: Joi.array().items(Joi.object({
            questionId: Joi.number().required(),
            answerId: Joi.number().required(),
        })).required(),
        relationshipGoalId: Joi.number().required(),
        seekingIds: Joi.array().items(Joi.number()).required(),
    });
    
    if(schema.validate(data).error){
        throw new Error(schema.validate(data).error?.message)
    }

  return schema.validate(data).value as ValidateUserInterface
};

const validateToken = (data:{token:string}) => {
  const schema = Joi.object({
      token: Joi.string().required(),
  });
  return schema.validate(data)
};

const validateEmail = (data:{email:string}) => {
    const schema = Joi.object({
        email: Joi.string().required(),
    });
    return schema.validate(data);
};

const validatePhoneNumber = (data:{phoneNumber:string}) => {
    const schema = Joi.object({
        phoneNumber: Joi.string().required(),
    });
    return schema.validate(data);
};

const validateId = (data: {id:string}) => {
    const schema = Joi.object({
        id: Joi.string().required(),
    });
    return schema.validate(data);
};

const validateIdAndTokens = (data: {id:string, accessToken: string, refreshToken:string}) => {
    const schema = Joi.object({
        id: Joi.string().required(),
        accessToken: Joi.string().required(),
        refreshToken: Joi.string().required()

    });
    return schema.validate(data);
};

const validateChangePhoneNumber = (data: { accessToken: string, oldPhoneNumber: string, newPhoneNumber: string }) => {
    const schema = Joi.object({
        accessToken: Joi.string().required(),
        oldPhoneNumber: Joi.string().required(),
        newPhoneNumber: Joi.string().required(),
    });
    return schema.validate(data);
};


const validateChangeEmail = (data: { accessToken: string, newEmail: string, oldEmail: string }) => {
    const schema = Joi.object({
        accessToken: Joi.string().required(),
        newEmail: Joi.string().required(),
        oldEmail: Joi.string().required(),
    });
    return schema.validate(data);
};

const validateRemoveEmail = (data: { accessToken: string, email: string}) => {
    const schema = Joi.object({
        accessToken: Joi.string().required(),
        email: Joi.string().required(),
    });
    return schema.validate(data);
};



export {
    validateUser,
    validateEmail,
    validatePhoneNumber,
    validateId,
    validateToken,
    validateChangePhoneNumber,
    validateChangeEmail,
    validateRemoveEmail,
    validateIdAndTokens
};
