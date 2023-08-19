import Joi from 'joi';
import { UserDocument, GenderSchema, AdditionalInformationSchema } from '../../UserDocument'; // Adjust the import path accordingly

interface UserUpdateParams {
  uid: UserDocument['_id'];
  bio?: UserDocument['profile']['bio'];
  gender?: GenderSchema;
  languages?: UserDocument['interests']['languages'];
  sexualOrientation?: UserDocument['preferences']['sexualOrientation'];
  jobTitle?: UserDocument['profile']['jobTitle'];
  company?: UserDocument['profile']['company'];
  covidVaccination?: UserDocument['interests']['covidVaccination'];
  ethnicity?: UserDocument['interests']['ethnicity'];
  height?: UserDocument['profile']['height'];
  additionalInformation?: AdditionalInformationSchema[];
  pictures?: UserDocument['profile']['pictures'];
}

const validateUserUpdateParams = (data: UserUpdateParams) => {
  const schema = Joi.object({
    uid: Joi.string().required(),
    bio: Joi.string().optional(),
    gender: Joi.object<GenderSchema>({
      general: Joi.string().valid('Male', 'Female', 'Non-Binary').required(),
      specific: Joi.string().allow(null).optional(),
    }),
    languages: Joi.array().items(Joi.string()).optional(),
    sexualOrientation: Joi.array().items(Joi.string()).optional(),
    jobTitle: Joi.string().optional(),
    company: Joi.string().optional(),
    covidVaccination: Joi.string().valid('Fully Vaccinated', 'Partially Vaccinated', 'Not Vaccinated').optional(),
    ethnicity: Joi.string().valid('Asian', 'Black', 'Mixed', 'White', 'Other').optional(),
    height: Joi.object({
      feet: Joi.number().positive().optional(),
      inches: Joi.number().optional(),
    }).optional(),
    additionalInformation: Joi.array().items(Joi.object({
      question: Joi.string().required(),
      answer: Joi.string().required(),
      icon: Joi.number().required(),
    })).optional(),
    pictures: Joi.array().items(Joi.string()).optional(),
  });

  return schema.validate(data);
};

export { validateUserUpdateParams };
