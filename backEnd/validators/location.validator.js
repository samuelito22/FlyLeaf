import Joi from "joi";

const validateLocation = (data) => {
    const schema = Joi.object({
        uid: Joi.string().required(),
        locationData: Joi.object({
          coordinates: Joi.object({longitude: Joi.number().required(), latitude: Joi.number().required()}),
          city: Joi.string(),
        }).required()
      });

    return schema.validate(data);
};

export  {validateLocation}