import Joi from "joi";

const validateLocation = (data: {uid:string, locationData:{coordinates:{longitude:string, latitude:string}, city:string}}) => {
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