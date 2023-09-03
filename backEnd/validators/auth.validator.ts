import Joi from 'joi';
import { objectIdRegex, phoneNumberRegex } from '../constants/regex';

const validateUser = (data:any) => {
  const schema = Joi.object({
      username: Joi.string().required(),
      gender: Joi.object({
          primary: Joi.string().required().pattern(objectIdRegex),
          secondary: Joi.string().optional().pattern(objectIdRegex),
      }).required(),
      phoneNumber: Joi.string().pattern(new RegExp(phoneNumberRegex)).required(),
      email: Joi.string().email().optional(),
      interests: Joi.array().items(Joi.string().pattern(objectIdRegex)).required(),
      additionalInformation: Joi.array().items(Joi.object({
          questionId: Joi.string().required().pattern(objectIdRegex),
          answerId: Joi.string().required().pattern(objectIdRegex),
      })).required(),
      relationshipGoal: Joi.string().required().pattern(objectIdRegex),
      seeking: Joi.array().items(Joi.string().pattern(objectIdRegex)).required(),
      dateOfBirth: Joi.date().required(),
      verified: Joi.boolean().default(false),
  });

  return schema.validate(data)
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

const validateId = (data: {_id:string}) => {
    const schema = Joi.object({
        _id: Joi.string().required(),
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
    validateRemoveEmail
};
