import {
  USER_NOT_FOUND_ERR,
  DATABASE_UPDATED
} from "../errors.js";
import User  from "../models/user.model.js";
import Joi from 'joi';

const validateUid = (uid) => {
  const schema = Joi.object({ uid: Joi.string().required() });
  return schema.validate({ uid });
};

async function updateUserLocation(req, res) {
  const { uid, locationData } = req.body
  
  // Define the schema
  const schema = Joi.object({
    uid: Joi.string().required(),
    locationData: Joi.object({
      coordinates: Joi.array().items(Joi.number()).length(2).required(),
      city: Joi.string().required(),
      country: Joi.string().required()
    }).required()
  });

  // Validate the inputs
  const { error } = schema.validate({ uid, locationData });
  
  // If validation error, throw an error
  if (error) {
    return res.status(400).json({
      type: "error",
      message: error.details[0].message,
    });
  }

  try {
    // If validation passes, proceed with updating user location
    const user = await User.findOneAndUpdate(
      { uid },
      {
        $set: {
          'location.lastLocation': {
            type: 'Point',
            coordinates: locationData.coordinates,
            city: locationData.city,
            country: locationData.country
          }
        }
      },
      { new: true } 
    );

    // If user not found, throw an error
    if (!user) {
      return res.status(400).json({ 
        type: "error", 
        message: USER_NOT_FOUND_ERR
      });
    }

    return res.status(200).json({ 
      type: "success", 
      message: DATABASE_UPDATED
    });
  } catch (error) {
    console.error('Error updating user location', error);
    throw error;
  }
}

async function getUserLocation(req, res) {
  const { uid } = req.params; // Assuming uid is passed as a URL parameter
  // Define the schema
  const { error } = validateUid(uid);
  
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
        message: USER_NOT_FOUND_ERR
      });
    }

    // Return the user's last location
    return res.status(200).json({
      type: "success",
      location: user.location.lastLocation
    });

  } catch (error) {
    console.error('Error getting user location', error);
    return res.status(500).json({
      type: "error",
      message: 'Error getting user location'
    });
  }
}


async function getUserProfile(req, res) {
  const { uid } = req.params; // Assuming uid is passed as a URL parameter
  // Define the schema
  const { error } = validateUid(uid);
  
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
        message: USER_NOT_FOUND_ERR
      });
    }

    // Return the user's last location
    return res.status(200).json({
      type: "success",
      profile: user
    });

  } catch (error) {
    console.error('Error getting user profile', error);
    return res.status(500).json({
      type: "error",
      message: 'Error getting user profile'
    });
  }
}

const userController = {getUserProfile, getUserLocation, updateUserLocation}
export default userController
