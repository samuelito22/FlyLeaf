import User from "../models/user.model";
import Spotify from "../models/spotify.model";
import axios from "axios";
import { SERVER_ERR, USER_NOT_FOUND_ERR } from "../constants/errors";
import mongoose from "mongoose";

const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

async function obtainSpotifyTokens(code:string) {
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

async function getSpotifyUserProfile(accessToken:string) {
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

async function storeUserSpotifyData(_id: string, spotifyUserId: string, refreshToken: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const userAlreadyConnectedToSpotifyId = await User.findOneAndUpdate(
        { "spotify": spotifyUserId, _id: { $ne: _id } },
        {
          $unset: {
            "spotify": 0
          },
        },
        { session, new: true }
      );
  
      await User.findOneAndUpdate(
        { _id: _id },
        {
          $set: {
            "spotify": spotifyUserId
          },
        },
        { session, new: true }
      );
  
      if (userAlreadyConnectedToSpotifyId) {
        await Spotify.findOneAndUpdate(
          { _id: spotifyUserId },
          {
            $set: {
              refreshToken: refreshToken,
            },
          },
          { session, new: true }
        );
      } else {
        await new Spotify({
          refreshToken: refreshToken,
          _id: spotifyUserId,
        }).save({ session });
      }
  
      await session.commitTransaction();
      session.endSession();
      return userAlreadyConnectedToSpotifyId;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error; // or handle the error as you see fit
    }
  }
  

async function refetchSpotifyData(_id:string) {
    const user = await User.findOne({ _id });

    if (!user) throw new Error(USER_NOT_FOUND_ERR);

    const spotify_id = user?.spotify;
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


async function disconnectSpotifyService(_id:string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const user = await User.findOne({ _id }, { session });
        if (!user) throw new Error(USER_NOT_FOUND_ERR);

        const storedSpotifyId = user.spotify;

        if (!storedSpotifyId) throw new Error("User is already disconnected from spotify");
        
        await Spotify.deleteOne({ _id: storedSpotifyId }, { session });

        await User.findOneAndUpdate(
            { _id },
            { $unset: { "spotify": 0 } },
            { new: true, session }
        );

        await session.commitTransaction();
        session.endSession();
        return true;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}
  

async function fetchTopArtists(accessToken:string, spotify_id:string) {
    try {
      const response = await axios.get(
        "https://api.spotify.com/v1/me/top/artists?limit=10",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.data.error && response.data.error.message === "invalid_token") {
        return "access-denied"
      }

      // Map over the artists array to extract and format the necessary details
      const formattedArtists = response.data.items.map((artist : {id:string, name:string, type:string, images:any, genres: [string]}) => ({
        id: artist.id,
        name: artist.name,
        type: artist.type,
        images: artist.images,
        genres: artist.genres
      }));

      await Spotify.findOneAndUpdate(
        {_id: spotify_id},
        {
            $set: {
                "artists": formattedArtists
            }
        }
      )

      return response.data.items
    } catch (error) {
      console.error("Error fetching top artists:", error);
      throw error;
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