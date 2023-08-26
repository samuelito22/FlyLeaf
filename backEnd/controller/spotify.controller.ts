import { SPOTIFY_IN_USE } from "../errors";
import SpotifyServices from "../services/spotify.services";
import UserServices from "../services/user.services";
import { validateUid } from "../validators/auth.validator";
import { validateUidAndCode } from "../validators/media.validator";
import express from 'express';

const sendError = (res:express.Response, message:string, status = 500) => {
  return res.status(status).json({ type: "error", message });
};

// Controller Functions

async function authenticateAndFetchSpotify(req:express.Request, res: express.Response) {
    try {
      const { uid } = req.params;
      const { code } = req.body;
  
      const { error } = validateUidAndCode({ uid, code });
  
      if (error) return sendError(res, error.details[0].message, 400);
  
      const { accessToken, refreshToken } = await SpotifyServices.obtainSpotifyTokens(code);
      const spotifyUserId = await SpotifyServices.getSpotifyUserProfile(accessToken);

      const userAlreadyConnectedToSpotifyId = await SpotifyServices.storeUserSpotifyData(uid, spotifyUserId, refreshToken);


      const artists = await SpotifyServices.fetchTopArtists(accessToken, spotifyUserId);
  
      // Send success status back.
      return res.status(200).json({
        type: "success",
        message: "Authentication and fetch successful",
        importantMessage: userAlreadyConnectedToSpotifyId && SPOTIFY_IN_USE,
        artists: artists
      });
    } catch (error) {
      console.error("Error authenticating with Spotify:", error);
      return sendError(res, "Internal Server Error");
    }
  }

async function refetchSpotify(req:express.Request, res: express.Response) {
    try {
        const { _id } = req.body;
        const { error } = validateUid({_id});
        if (error) return sendError(res, error.details[0].message, 400);

        const result = await SpotifyServices.refetchSpotifyData(_id);

        const artists = await SpotifyServices.fetchTopArtists(result.accessToken, result.spotify_id);

        if(artists === "access-denied"){
          const result =  await SpotifyServices.disconnectSpotifyService(_id)
          if(!result){
            return sendError(res, "Error in deleting the user's spotify", 404);
          }
        }

        return res.status(200).json({
            type: "success",
            message: "Refresh token created successfully",
        });
    } catch (error) {
        console.error("Error refreshing access token:", error);
        return sendError(res, "Internal Server Error");
    }
}

async function disconnectFromSpotify(req:express.Request, res: express.Response) {
    try {
        const { _id } = req.params;
        const { error } = validateUid({_id});
        if (error) return sendError(res, error.details[0].message, 400);

        await SpotifyServices.disconnectSpotifyService(_id);
        return res.status(200).json({
            type: "success",
            message: "Disconnected from Spotify successfully",
        });
    } catch (error) {
        console.error("Error disconnecting from Spotify:", error);
        return sendError(res, "Internal Server Error");
    }
}

const spotifyController = {
    authenticateAndFetchSpotify,
    refetchSpotify,
    disconnectFromSpotify,
  };
export default spotifyController

