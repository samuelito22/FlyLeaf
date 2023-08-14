import Joi from "joi"

export const validateUidAndCode = (data) => {
    const schema = Joi.object({
        uid: Joi.string().required(),
        code: Joi.string().required(),
    });
    return schema.validate(data);
};