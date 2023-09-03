import Joi from "joi"

export const validateIdAndCode = (data:{_id:string, code:string}) => {
    const schema = Joi.object({
        _id: Joi.string().required(),
        code: Joi.string().required(),
    });
    return schema.validate(data);
};