
import {
  USER_NOT_FOUND_ERR,
  DATABASE_UPDATED,
  SERVER_ERR
} from "../errors";
import SpotifyServices from "../services/spotify.services";
import UserServices from "../services/user.services";
import { validateUid } from "../validators/auth.validator";
import { validateLocation } from "../validators/location.validator";
import Spotify from "../models/spotify.model";
import instagramModel from "../models/instagram.model";
import InstagramServices from "../services/instagram.services";
import { validateUserUpdateParams } from "../validators/user.validator";
import User from "../models/user.model";
import SpotifyModel from "../models/spotify.model";
import express from "express"

type expressParams = {
  req: express.Request;
  res: express.Response;
}

async function updateUserLocation(req:express.Request, res: express.Response) {
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

async function getUserLocation(req:express.Request, res: express.Response) {
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

async function getUserProfile(req:express.Request, res: express.Response) {
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
    delete spotifyData?.refreshToken;
    
    
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

async function updateUserProfile(req: express.Request, res: express.Response) {
  const { uid } = req.params;
  const {
    bio,
    gender,
    languages,
    sexualOrientation,
    jobTitle,
    company,
    covidVaccination,
    ethnicity,
    height,
    additionalInformation,
    pictures
  } = req.body;


  const { error } = validateUserUpdateParams({
    uid,
    bio,
    gender,
    languages,
    sexualOrientation,
    jobTitle,
    company,
    covidVaccination,
    ethnicity,
    height,
    additionalInformation,
    pictures
  });

  if (error) {
    return res.status(400).json({
      type: "error",
      message: error.details[0].message
    });
  }

  try {
    let combinedProfile = {}
    // Fetch the existing user data from the database
    const user = await User.findOne({ _id: uid });

    if (!user) {
      return res.status(404).json({
        type: "error",
        message: USER_NOT_FOUND_ERR
      });
    }


    let updateFields: { [key: string]: any } = {};
    let unsetFields: { [key: string]: any } = {};

    if (bio !== undefined) updateFields["profile.bio"] = bio; else unsetFields["profile.bio"] = 1;
if (gender !== undefined) updateFields["profile.gender"] = gender; else unsetFields["profile.gender"] = 1;
if (jobTitle !== undefined) updateFields["profile.jobTitle"] = jobTitle; else unsetFields["profile.jobTitle"] = 1;
if (company !== undefined) updateFields["profile.company"] = company; else unsetFields["profile.company"] = 1;
if (height !== undefined) updateFields["profile.height"] = height; else unsetFields["profile.height"] = 1;
if (pictures !== undefined) updateFields["profile.pictures"] = pictures; else unsetFields["profile.pictures"] = 1;

if (languages !== undefined) updateFields["interests.languages"] = languages; else unsetFields["interests.languages"] = 1;
if (covidVaccination !== undefined) updateFields["interests.covidVaccination"] = covidVaccination; else unsetFields["interests.covidVaccination"] = 1;
if (ethnicity !== undefined) updateFields["interests.ethnicity"] = ethnicity; else unsetFields["interests.ethnicity"] = 1;
if (additionalInformation !== undefined) updateFields["interests.additionalInformation"] = additionalInformation; else unsetFields["interests.additionalInformation"] = 1;

if (sexualOrientation !== undefined) updateFields["preferences.sexualOrientation"] = sexualOrientation; else unsetFields["preferences.sexualOrientation"] = 1;

    let updateQuery: any = {};
    if (Object.keys(updateFields).length) updateQuery["$set"] = updateFields;
    if (Object.keys(unsetFields).length) updateQuery["$unset"] = unsetFields;


    // Update the user data with the new object
    const updatedUser = await User.findOneAndUpdate(
      { _id: uid },
      updateQuery,
      { new: true }
    );

    

    if (!updatedUser) {
      return res.status(404).json({
        type: "error",
        message: USER_NOT_FOUND_ERR
      });
    }
    combinedProfile = {...combinedProfile, user: updatedUser}

    if(user.profile.instagram?.isConnected){
      const InstagramData = await instagramModel.findOne({_id: user.profile.instagram.instagram_id})

    combinedProfile = {...combinedProfile, instagram: InstagramData?.images}
    }

    if(user.profile.spotify?.isConnected){
      const spotifyData = await SpotifyModel.findOne({_id: user.profile.spotify.spotify_id})
  
      combinedProfile = {...combinedProfile, spotify: spotifyData?.artists}
    }

    return res.status(200).json({
      type: "success",
      profile: combinedProfile
    });
  } catch (error) {
    console.error("Error updating user profile", error);
    return res.status(500).json({
      type: "error",
      message: "Error updating user profile"
    });
  }
}


async function initUserProfile(req:express.Request, res: express.Response) {
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
  if (
    !user.location?.lastLocation?.coordinates ||
    Math.abs(locationData.coordinates.longitude - user.location.lastLocation.coordinates.latitude) > 0.01 ||
    Math.abs(locationData.coordinates.longitude - user.location.lastLocation.coordinates.latitude) > 0.01
  ) {
    user = await UserServices.updateUserLocation(uid, locationData);
  }


  // Spotify Update
  if(user.profile.spotify?.isConnected){
    const result = await SpotifyServices.refetchSpotifyData(uid)
    await SpotifyServices.fetchTopArtists(result.accessToken, result.spotify_id)   

    const spotifyData = await Spotify.findOne({_id: user.profile.spotify.spotify_id})
    
    combinedProfile = { ...combinedProfile, spotify: spotifyData?.artists }
  }

  if(user.profile.instagram?.isConnected){
    const instagram_id = user.profile.instagram.instagram_id
    let InstagramData = await instagramModel.findOne({_id: instagram_id})
    if (!InstagramData) return res.status(404).json({ type: "error", message: "Instagram data not found" });
    let accessToken = InstagramData.accessToken
    let expiryDate = InstagramData?.expiryDate

    const currentDate = new Date();
    if(expiryDate && accessToken && currentDate > expiryDate){
      const result = await InstagramServices.refreshInstagramToken(accessToken)
      accessToken = result.token
      expiryDate = result.expiryDate
    }

    await instagramModel.findOneAndUpdate(
      { _id: instagram_id },
      {
        $set: {
          accessToken: accessToken,
          expiryDate: expiryDate,
        },
      },
      { new: true }
    ).catch(e => console.log(e))

    if(accessToken)  await InstagramServices.fetchInstagramImages(accessToken, instagram_id).catch(e => 
      console.log(e)
      )
    
    InstagramData = await instagramModel.findOne({_id: instagram_id})
    
    combinedProfile = { ...combinedProfile, instagram: InstagramData?.images }
  }
  
  
  combinedProfile = { ...combinedProfile, user }

  return res.status(200).json({ type: "success", profile: combinedProfile });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      type: "error",
      message: SERVER_ERR
    });
  }

}


const userController = {getUserProfile, getUserLocation, updateUserLocation, initUserProfile, updateUserProfile};
export default userController;
