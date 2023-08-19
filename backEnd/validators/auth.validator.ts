import Joi from 'joi';
import UserDocument from "../../UserDocument"

const validateUser = (data:UserDocument) => {
    const schema = Joi.object({
        uid: Joi.string().required(),
        contact: Joi.object({
          phoneNumber: Joi.string().required(),
          email: Joi.string().email().optional(),
        }),
        profile: Joi.object({
          firstName: Joi.string().required(),
          dateOfBirth: Joi.date().required(),
          gender: Joi.object({
            general: Joi.string().valid('Male', 'Female', 'Non-Binary').required(),
            specific: Joi.string().optional(),
          }).required(),
          pictures: Joi.array().items(Joi.string()),
        }).required(),
        preferences: Joi.object({
          genderPreferences: Joi.array().items(Joi.string()).required(),
          relationshipGoal: Joi.string().valid('Friendship', 'Relationship', 'Exploring').required(),
        }).required(),
        interests: Joi.object({
          interests: Joi.array().items(Joi.string()).required(),
          additionalInformation: Joi.array().items(Joi.object({
            question: Joi.string().required(),
            answer: Joi.string().required(),
            icon: Joi.number().required(),
          })).required(),
        }).required(),
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
