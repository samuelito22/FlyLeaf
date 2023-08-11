import {
    USER_ALREADY_EXIST,
    EMAIL_NOT_EXIST,
    PHONE_NUMBER_NOT_EXIST,
    SERVER_ERR,
    USER_CREATED,
    UID_NOT_EXIST,
  } from "../errors.js";
  import User  from "../models/user.model.js";
  import Joi from 'joi';

  const validateUid = (uid) => {
    const schema = Joi.object({ uid: Joi.string().required() });
    return schema.validate({ uid });
  };
  
  // @route POST auth/users/register
  // @desc Register user
  // @access Public
   async function registerUser(req, res) {
    try {
      // Define the schema
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
      
  
      // Validate the inputs
      const { error, value } = schema.validate(req.body);
  
      // If validation error, throw an error
      if (error) {
        return res.status(400).json({
          type: "error",
          message: error.details[0].message,
        });
      }
  
      // Check if user with this UID already exists
      const userExist = await User.findOne({ uid: value.uid });
  
      if (userExist) {
        return res.status(400).json({ 
          type: "error", 
          message: USER_ALREADY_EXIST 
        });
      }
      
      const newUser = new User(value);
  
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
  
  
  
  // @route GET auth/users/emailExist
  // @desc Get if the email exists
  // @access Public
   const emailExist = async (req, res) => {
    try {
      const { email } = req.body;
      const schema = Joi.object({
        email: Joi.string().required(),
      });
    
      // Validate the inputs
      const { error } = schema.validate({ email });
  
      if (error) {
        return res.status(400).json({ type: "error", message: error.details[0].message});
      }
      const emailExist = await User.findOne({ email });
      if (emailExist) {
        return res
          .status(200)
          .json({ type: "success", message: USER_ALREADY_EXIST });
      } else {
        return res
          .status(400)
          .json({ type: "error", message: EMAIL_NOT_EXIST });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        type: "error",
        message: SERVER_ERR,
      });
    }
  };
  
  // @route GET auth/users/phoneExist
  // @desc Get if the phone exists
  // @access Public
  
async function phoneExist(req, res) {
    try {
      const { phoneNumber } = req.body;
      const schema = Joi.object({
        phoneNumber: Joi.string().required(),
      });
    
      // Validate the inputs
      const { error } = schema.validate({ phoneNumber });
  
      if (error) {
        return res.status(400).json({
          type: "error",
          message: error.details[0].message,
        });
      }
      const phoneNumberExist = await User.findOne({ phoneNumber });
      if (phoneNumberExist) {
        return res
          .status(200)
          .json({ type: "success", message: USER_ALREADY_EXIST });
      } else {
        return res
          .status(400)
          .json({ type: "error", message: PHONE_NUMBER_NOT_EXIST });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        type: "error",
        message: SERVER_ERR,
      });
    }
  }
  
  // @route GET auth/users/uidExist
  // @desc Get if the user uid exists
  // @access Public
async function uidExist(req, res) {
    try {
      // Retrieve uid from request body
      const { uid } = req.body;
  
      const { error } = validateUid(uid);
  
      if (error) {
        return res.status(400).json({
          type: "error",
          message: error.details[0].message,
        });
      }
  
      // Find user with this uid
      const user = await User.findOne({ uid });
  
      // If user is found
      if (user) {
        return res.status(200).json({ 
          type: "success", 
          message: USER_ALREADY_EXIST
        });
      } else {
        return res.status(400).json({ 
          type: "error", 
          message: UID_NOT_EXIST
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


const authController = {uidExist, phoneExist, emailExist, registerUser}
export default authController