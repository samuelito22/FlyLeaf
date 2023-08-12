import User from "../models/user.model.js";
import Spotify from "../models/spotify.model.js";
import axios from "axios";

const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

async function obtainSpotifyTokens(code) {
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

    return {
        accessToken: tokenResponse.data.access_token,
        refreshToken: tokenResponse.data.refresh_token
    };
}

async function getSpotifyUserProfile(accessToken) {
    const userProfileResponse = await axios.get(
        "https://api.spotify.com/v1/me",
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );
    return userProfileResponse.data.id;
}

async function storeUserSpotifyData(uid, spotifyUserId, refreshToken) {
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
}

async function refetchSpotifyData(uid) {
    const user = await User.findOne({ uid });

    if (!user) throw new Error(USER_NOT_FOUND_ERR);

    const spotify_id = user.profile.spotify.spotify_id;
    const spotifyDoc = await Spotify.findOne({ _id: spotify_id });

    if (!spotifyDoc) throw new Error("Spotify field not found");

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

    return {accessToken, spotify_id};
}

async function disconnectSpotifyService(uid) {
    const user = await User.findOne({ uid });
    if (!user) throw new Error("User not found.");

    const storedSpotifyId = user.profile.spotify.spotify_id;
    await Spotify.deleteOne({ _id: storedSpotifyId });

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
    if (!updatedUser) throw new Error("Internal Server Error");
    return updatedUser;
}

async function fetchTopArtists(accessToken, spotify_id) {
    try {
      const response = await axios.get(
        "https://api.spotify.com/v1/me/top/artists?limit=10",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
  
      return response.data.items;
    } catch (error) {
      console.error("Error fetching top artists:", error);
      return error;
    }
  }

const SpotifyServices = {
    obtainSpotifyTokens,
    getSpotifyUserProfile,
    storeUserSpotifyData,
    disconnectSpotifyService,
    refetchSpotifyData,
    fetchTopArtists
};
export default SpotifyServices