import Joi from "joi"

export const validateIdAndCode = (data:{id:string, code:string}) => {
    const schema = Joi.object({
        id: Joi.string().required(),
        code: Joi.string().required(),
    });
    return schema.validate(data);
};