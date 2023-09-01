import Joi from 'joi';
import { objectIdRegex } from '../constants/regex';

export const userProfileValidationSchema = Joi.object({
  profession: Joi.object({
    jobTitle: Joi.string().optional(),
    employer: Joi.string().optional(),
  }).optional(),
  gender: Joi.object({
    primary: Joi.string().required(),
    secondary: Joi.string().optional(),
  }).optional(),
  location: Joi.object({
    city: Joi.string().optional(),
  }).optional(),
  interests: Joi.array().items(Joi.string().pattern(objectIdRegex)).max(5).optional(),
  languages: Joi.array().items(Joi.string().pattern(objectIdRegex)).max(5).optional(),
  bio: Joi.string().optional(),
  height: Joi.object({
    feets: Joi.string().optional(),
    inches: Joi.string().optional(),
  }).optional(),
  relationshipGoal: Joi.string().pattern(objectIdRegex).optional(),
  seeking: Joi.array().items(Joi.string().pattern(objectIdRegex)).max(3).optional(),
  
})


const validateUserUpdateParams = () => {
  

};

export { validateUserUpdateParams };


