import { SPOTIFY_IN_USE, USER_NOT_FOUND_ERR } from "../errors.js";
import User from "../models/user.model.js";
import Spotify from "../models/spotify.model.js";
import Joi from "joi";
import axios from "axios";

// Constants
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

// Utility Functions

const validateUid = (uid) => {
  const schema = Joi.object({ uid: Joi.string().required() });
  return schema.validate({ uid });
};

async function fetchTopArtists(accessToken, spotify_id) {
  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/top/artists?limit=10",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    console.log(response.data.items);
    return null;
  } catch (error) {
    console.error("Error fetching top artists:", error);
    return error;
  }
}

const sendError = (res, message, status = 500) => {
  return res.status(status).json({ type: "error", message });
};

// Controller Functions

async function authenticateAndFetchSpotify(req, res) {
  try {
    const { uid } = req.params;
    const { code } = req.body;

    const schema = Joi.object({
      uid: Joi.string().required(),
      code: Joi.string().required(),
    });

    const { error } = schema.validate({ uid, code });

    if (error) return sendError(res, error.details[0].message, 400);

    const tokenResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      null,
      {
        params: {
          grant_type: "authorization_code",
          code: code,
          redirect_uri: REDIRECT_URI,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    const refreshToken = tokenResponse.data.refresh_token;

    const userProfileResponse = await axios.get(
      "https://api.spotify.com/v1/me",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const spotifyUserId = userProfileResponse.data.id;

    const userAlreadyConnectedToSpotifyId = await User.findOneAndUpdate(
      { "profile.spotify.spotify_id": spotifyUserId, uid: { $ne: uid } },
      {
        $set: {
          "profile.spotify": {
            isConnected: false,
            spotify_id: null,
            lastUpdated: null,
          },
        },
      },
      { new: true }
    );

    await User.findOneAndUpdate(
      { uid },
      {
        $set: {
          "profile.spotify": {
            isConnected: true,
            spotify_id: spotifyUserId,
            lastUpdated: Date.now,
          },
        },
      },
      { new: true }
    );

    if (userAlreadyConnectedToSpotifyId) {
      await Spotify.findOneAndUpdate(
        { spotify_id: spotifyUserId },
        {
          $set: {
            refreshToken: refreshToken,
          },
        },
        { new: true }
      );
    } else {
      await new Spotify({
        refreshToken: refreshToken,
        spotify_id: spotifyUserId,
      }).save();
    }

    await fetchTopArtists(accessToken, spotifyUserId);

    // Send success status back.
    return res.status(200).json({
      type: "success",
      message: "Authentication and fetch successful",
      importantMessage: userAlreadyConnectedToSpotifyId && SPOTIFY_IN_USE,
    });
  } catch (error) {
    console.error("Error authenticating with Spotify:", error);
    return sendError(res, "Internal Server Error");
  }
}

async function refetchSpotify(req, res) {
  try {
    const { uid } = req.body;
    const { error } = validateUid(uid);

    if (error) return sendError(res, error.details[0].message, 400);

    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({
        type: "error",
        message: USER_NOT_FOUND_ERR,
      });
    }
    const spotify_id = user.profile.spotify.spotify_id;

    const spotifyDoc = await Spotify.findOne({ _id: spotify_id });

    if (!spotifyDoc) {
      return res.status(404).json({
        type: "error",
        message: "Spotify field not found",
      });
    }

    let refreshToken = spotifyDoc.refreshToken;

    const tokenResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      null,
      {
        params: {
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    refreshToken = tokenResponse.data.refresh_token;

    if (refreshToken) {
      spotifyDoc.refreshToken = refreshToken;

      await spotifyDoc.save();
    }

    await fetchTopArtists(accessToken, spotify_id);

    return res.status(200).json({
      type: "success",
      message: "Refresh token created successfully",
    });
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return sendError(res, "Internal Server Error");
  }
}

async function disconnectFromSpotify(req, res) {
  try {
    const { uid } = req.params;

    // Validate UID
    const { error } = validateUid(uid);

    if (error) return sendError(res, error.details[0].message, 400);

    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({
        type: "error",
        message: "User not found.",
      });
    }

    const storedSpotifyId = user.profile.spotify.spotify_id;
    await Spotify.deleteOne({ _id: storedSpotifyId });
    console.log("Stored Spotify ID:", storedSpotifyId);

    const updatedUser = await User.findOneAndUpdate(
      { uid },
      {
        $set: {
          "profile.spotify.isConnected": false,
          "profile.spotify.spotify_id": null,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return { error: true, statusCode: 500, message: "Internal Server Error" };
    }

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
export default spotifyController;
