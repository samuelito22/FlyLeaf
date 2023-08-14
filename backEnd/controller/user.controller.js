
import {
  USER_NOT_FOUND_ERR,
  DATABASE_UPDATED,
  SERVER_ERR
} from "../errors.js";
import SpotifyServices from "../services/spotify.services.js";
import UserServices from "../services/user.services.js";
import { validateUid } from "../validators/auth.validator.js";
import { validateLocation } from "../validators/location.validator.js";
import Spotify from "../models/spotify.model.js";


async function updateUserLocation(req, res) {
  const { uid, locationData } = req.body;

  const { error } = validateLocation({ uid, locationData });
  
  if (error) {
    return res.status(400).json({
      type: "error",
      message: error.details[0].message,
    });
  }

  try {
    const user = await UserServices.updateUserLocation(uid, locationData);
    if (!user) {
      return res.status(400).json({ type: "error", message: USER_NOT_FOUND_ERR });
    }
    return res.status(200).json({ type: "success", message: DATABASE_UPDATED });
  } catch (error) {
    console.error('Error updating user location', error);
    return res.status(500).json({
      type: "error",
      message: 'Error updating user location'
    });
  }
}

async function getUserLocation(req, res) {
  const { uid } = req.params;
  const { error } = validateUid({uid});
  
  if (error) {
    return res.status(400).json({
      type: "error",
      message: error.details[0].message,
    });
  }

  try {
    const user = await UserServices.getUserLocation(uid);
    if (!user) {
      return res.status(404).json({ type: "error", message: USER_NOT_FOUND_ERR });
    }
    return res.status(200).json({ type: "success", location: user.location.lastLocation });
  } catch (error) {
    console.error('Error getting user location', error);
    return res.status(500).json({
      type: "error",
      message: 'Error getting user location'
    });
  }
}

async function getUserProfile(req, res) {
  const { uid } = req.params;
  const { error } = validateUid({uid});
  
  if (error) {
    return res.status(400).json({
      type: "error",
      message: error.details[0].message,
    });
  }

  try {
    let combinedProfile = {}

    const user = await UserServices.getUserProfile(uid);
    if (!user) {
      return res.status(404).json({ type: "error", message: USER_NOT_FOUND_ERR });
    }

    const spotifyData = await Spotify.findOne({_id: user.profile.spotify.spotify_id})
    delete spotifyData.refreshToken;
    
    combinedProfile = { ...combinedProfile, spotify: spotifyData }

    combinedProfile = { ...combinedProfile, ...user.toObject() }

    return res.status(200).json({ type: "success", profile: user });
  } catch (error) {
    console.error('Error getting user profile', error);
    return res.status(500).json({
      type: "error",
      message: 'Error getting user profile'
    });
  }
}

async function initUserProfile(req, res) {
  const { uid } = req.params
  const { locationData } = req.body;

  const { error } = validateLocation({ uid, locationData });

  if (error) {
    return res.status(400).json({
      type: "error",
      message: error.details[0].message,
    });
  }

  try {
  let combinedProfile = {}

  let user = await UserServices.getUserProfile(uid)

  if (!user) {
    return res.status(404).json({ type: "error", message: USER_NOT_FOUND_ERR });
  }

  // Location updated
  if(Math.abs(locationData.coordinates[0] - user.location.lastLocation.coordinates[0]) > 0.01 || Math.abs(locationData.coordinates[1] - user.location.lastLocation.coordinates[1]) > 0.01){
    user = await UserServices.updateUserLocation(uid, locationData);
  }

  // Spotify Update
  if(user.profile.spotify.isConnected){
    const result = await SpotifyServices.refetchSpotifyData(uid)
    await SpotifyServices.fetchTopArtists(result.accessToken, result.spotify_id)   

    const spotifyData = await Spotify.findOne({_id: user.profile.spotify.spotify_id})
    delete spotifyData.refreshToken;
    
    combinedProfile = { ...combinedProfile, spotify: spotifyData }
  }
  
  combinedProfile = { ...combinedProfile, ...user.toObject() }


  return res.status(200).json({ type: "success", profile: combinedProfile });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      type: "error",
      message: SERVER_ERR
    });
  }

}


const userController = {getUserProfile, getUserLocation, updateUserLocation, initUserProfile};
export default userController;
