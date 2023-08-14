import { SPOTIFY_IN_USE } from "../errors.js";
import SpotifyServices from "../services/spotify.services.js";
import UserServices from "../services/user.services.js";
import { validateUid } from "../validators/auth.validator.js";
import { validateUidAndCode } from "../validators/media.validator.js";


const sendError = (res, message, status = 500) => {
  return res.status(status).json({ type: "error", message });
};

// Controller Functions

async function authenticateAndFetchSpotify(req, res) {
    try {
      const { uid } = req.params;
      const { code } = req.body;
  
      const { error } = validateUidAndCode({ uid, code });
  
      if (error) return sendError(res, error.details[0].message, 400);
  
      const { accessToken, refreshToken } = await SpotifyServices.obtainSpotifyTokens(code);
      const spotifyUserId = await SpotifyServices.getSpotifyUserProfile(accessToken);
      const user = await UserServices.getUserProfile(uid)

      if(user.profile.spotify.spotify_id === spotifyUserId){
        return res.status(400).json({
          type: "error",
          message: "User is already connected to spotify",
        });
      }

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

async function refetchSpotify(req, res) {
    try {
        const { uid } = req.body;
        const { error } = validateUid({uid});
        if (error) return sendError(res, error.details[0].message, 400);

        const result = await SpotifyServices.refetchSpotifyData(uid);

        const artists = await SpotifyServices.fetchTopArtists(result.accessToken, result.spotify_id);

        if(artists === "access-denied"){
          const result =  await SpotifyServices.disconnectSpotifyService(uid)
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
        return sendError(res, error.message || "Internal Server Error");
    }
}

async function disconnectFromSpotify(req, res) {
    try {
        const { uid } = req.params;
        const { error } = validateUid({uid});
        if (error) return sendError(res, error.details[0].message, 400);

        await SpotifyServices.disconnectSpotifyService(uid);
        return res.status(200).json({
            type: "success",
            message: "Disconnected from Spotify successfully",
        });
    } catch (error) {
        console.error("Error disconnecting from Spotify:", error);
        return sendError(res, error.message || "Internal Server Error");
    }
}

const spotifyController = {
    authenticateAndFetchSpotify,
    refetchSpotify,
    disconnectFromSpotify,
  };
export default spotifyController

