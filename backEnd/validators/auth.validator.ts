import Joi from 'joi';
import { User } from '../../types';

const validateUser = (data:User) => {
  const schema = Joi.object({
      _id: Joi.string().required(),
      username: Joi.string().required(),
      profession: Joi.object({
          jobTitle: Joi.string().optional(),
          employer: Joi.string().optional(),
      }),
      gender: Joi.object({
          general: Joi.string().required(),
          specific: Joi.string().optional(),
      }).required(),
      phoneNumber: Joi.string(),
      email: Joi.string().email().optional(),
      location: Joi.object({
          coordinates: Joi.object({
              longitude: Joi.number().required(),
              latitude: Joi.number().required(),
          }),
          city: Joi.string().optional(),
      }).optional(),
      interests: Joi.array().items(Joi.string()).required(),
      languages: Joi.array().items(Joi.string()).optional(),
      bio: Joi.string().optional(),
      additionalInformation: Joi.array().items(Joi.object({
          question_id: Joi.string().required(),
          answer: Joi.string().required(),
      })).required(),
      height: Joi.object({
          feets: Joi.string().optional(),
          inches: Joi.string().optional(),
      }).optional(),
      relationshipGoal: Joi.string().required(),
      sexualOrientation: Joi.array().items(Joi.string()).optional(),
      religion: Joi.array().items(Joi.string()).optional(),
      seeking: Joi.array().items(Joi.string()).required(),
      pictures: Joi.array().items(Joi.string()).required(),
      dateOfBirth: Joi.date().required(),
      instagram: Joi.string().optional(),
      spotify: Joi.string().optional(),
      covidVaccination: Joi.string().optional(),
      ethnicity: Joi.string().optional(),
      lastActive: Joi.date().optional(),
      connects: Joi.number().default(40),
      isPremiumMember: Joi.boolean().default(false),
      verified: Joi.boolean().default(false),
  });

  return schema.validate(data);
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

const validateUid = (data: {uid:string}) => {
    const schema = Joi.object({
        uid: Joi.string().required(),
    });
    return schema.validate(data);
};

export {
    validateUser,
    validateEmail,
    validatePhoneNumber,
    validateUid
};
