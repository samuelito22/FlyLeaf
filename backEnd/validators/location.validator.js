const validateLocation = (data) => {
    const schema = Joi.object({
        uid: Joi.string().required(),
        locationData: Joi.object({
          coordinates: Joi.array().items(Joi.number()).length(2).required(),
          city: Joi.string(),
        }).required()
      });

    return schema.validate(data);
};

export  {validateLocation}