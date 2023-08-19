import Joi from "joi"

export const validateUidAndCode = (data:{uid:string, code:string}) => {
    const schema = Joi.object({
        uid: Joi.string().required(),
        code: Joi.string().required(),
    });
    return schema.validate(data);
};