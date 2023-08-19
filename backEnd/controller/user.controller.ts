
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
  console.log(error)

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

    console.log(pictures)

    const updatedProfile = {
      bio: bio || undefined,
      gender: gender || undefined,
      jobTitle: jobTitle || undefined,
      company: company || undefined,
      height: height
        ? {
            feet: Number(height.feet),
            inches: Number(height.inches)
          }
        : undefined,
      pictures: pictures || undefined
    };
    
    const updatedInterests = {
      languages: languages || undefined,
      covidVaccination: covidVaccination || undefined,
      ethnicity: ethnicity || undefined,
      additionalInformation: additionalInformation || undefined
    };
    
    const updatedPreferences = {
      sexualOrientation: sexualOrientation || undefined
    };
    
    // Update the user data with the new object
    const updatedUser = await User.findOneAndUpdate(
      { _id: uid },
      {
        $set: {
          "profile.bio": updatedProfile.bio,
          "profile.gender": updatedProfile.gender,
          "profile.jobTitle": updatedProfile.jobTitle,
          "profile.company": updatedProfile.company,
          "profile.height": updatedProfile.height,
          "profile.pictures": updatedProfile.pictures,
          "interests.languages": updatedInterests.languages,
          "interests.covidVaccination": updatedInterests.covidVaccination,
          "interests.ethnicity": updatedInterests.ethnicity,
          "interests.additionalInformation": updatedInterests.additionalInformation,
          "preferences.sexualOrientation": updatedPreferences.sexualOrientation
        }
      },
      { new: true }
    );
    

    if (!updatedUser) {
      return res.status(404).json({
        type: "error",
        message: USER_NOT_FOUND_ERR
      });
    }
    combinedProfile = {...combinedProfile, ...updatedUser.toObject()}

    if(user.profile.instagram?.isConnected){
      const InstagramData = await instagramModel.findOne({_id: user.profile.instagram.instagram_id})

    delete InstagramData?.accessToken;
    delete InstagramData?.expiryDate;

    combinedProfile = {...combinedProfile, instagram: InstagramData?.images}
    }

    if(user.profile.spotify?.isConnected){
      const spotifyData = await SpotifyModel.findOne({_id: user.profile.spotify.spotify_id})
      delete spotifyData?.refreshToken;
  
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
    delete spotifyData?.refreshToken;
    
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
    delete InstagramData?.accessToken;
    delete InstagramData?.expiryDate;
    
    combinedProfile = { ...combinedProfile, instagram: InstagramData?.images }
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


const userController = {getUserProfile, getUserLocation, updateUserLocation, initUserProfile, updateUserProfile};
export default userController;
