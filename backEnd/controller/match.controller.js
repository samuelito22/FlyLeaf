/** 
export const emailExist = async (req, res) => {
    try {
      const { email } = req.body;
      const { errors, isValid } = Validation.validateEmailInput(email);
  
      if (!isValid) {
        return res.status(400).json({ type: "error", message: errors });
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
*/

import Joi from "joi";
import { SERVER_ERR, USER_NOT_FOUND_ERR } from "../errors";
import User from "../models/user.js";

export const findMatchUser = async (req, res) => {
  const { uid } = req.body;

  const schema = Joi.object({
    uid: Joi.string().required(),
  });

  // Validate the inputs
  const { error } = schema.validate({ uid });

  // If validation error, throw an error
  if (error) {
    return res.status(400).json({
      type: "error",
      message: error.details[0].message,
    });
  }
  try {
    // If validation passes, proceed with fetching user location
    const user = await User.findOne({ uid });

    // If user not found, throw an error
    if (!user) {
      return res.status(404).json({
        type: "error",
        message: USER_NOT_FOUND_ERR,
      });
    }

    let listOfUsers = null;

    if (user.relationshipGoal === "Exploring options") {
        listOfUsers = await User.find({uid: { $ne: uid }});
      } else {
        listOfUsers = await User.find({
          uid: { $ne: uid },
          relationshipGoal: user.relationshipGoal,
        });
      }

    


  } catch (error) {
    console.error(error);
    return res.status(500).json({
      type: "error",
      message: SERVER_ERR,
    });
  }
};
