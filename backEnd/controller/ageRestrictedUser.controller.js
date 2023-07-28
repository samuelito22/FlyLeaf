import Joi from "joi";
import AgeRestrictedUser from "../models/ageRestrictedUser.js";
import { SERVER_ERR, USER_ALREADY_EXIST, USER_CREATED, USER_NOT_FOUND_ERR } from "../errors.js";

export async function ageRestrictUser(req,res) {
    try {
      // Define the schema
      const schema = Joi.object({
        uid: Joi.string().required(),
        dateOfBirth: Joi.date().required(),
      });
      
  
      // Validate the inputs
      const { error, value } = schema.validate(req.body);
  
      // If validation error, throw an error
      if (error) {
        return res.status(400).json({
          type: "error",
          message: error.details[0].message,
        });
      }
      
      const newUser = new AgeRestrictedUser(value);
  
      await newUser.save();
  
      res.status(200).json({
        type: "success",
        message: USER_CREATED,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        type: "error",
        message: SERVER_ERR,
      });
    }
  }
  
  export async function isUserAgeRestricted(req,res) {
    try {
      const { uid } = req.params;
      // Define the schema
      const schema = Joi.object({ uid: Joi.string().required() });
      
  
      // Validate the inputs
      const { error, value } = schema.validate({uid: uid});
  
      // If validation error, throw an error
      if (error) {
        return res.status(400).json({
          type: "error",
          message: error.details[0].message,
        });
      }
      
      const userExist = await AgeRestrictedUser.findOne({ uid: value.uid });

      if (userExist) {
        return res.status(200).json({ 
          type: "success", 
          message: USER_ALREADY_EXIST
        });
      }else{
        return res.status(400).json({ 
          type: "error", 
          message: USER_NOT_FOUND_ERR
        });
      }

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        type: "error",
        message: SERVER_ERR,
      });
    }
  }