import Model from "../models";
import axios from "axios";
import { INVALID_TOKEN, USER_NOT_FOUND_ERR } from "../constants/errors";
import mongoose from "mongoose";
import { sequelize } from "../config/sequelizeConfig";

const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

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


async function storeUserSpotifyData(userId: string, refreshToken: string, accessToken: string) {
    const transaction = await sequelize.transaction()
    try {
      await Model.SpotifyTokens.destroy({where:{id: userId}, transaction})
      await Model.SpotifyTokens.create({
        userId,
        refreshToken,
        accessToken

      } as any, {transaction})

      await transaction.commit()
    } catch (error) {
      await transaction.rollback();
      console.error("Error storing user's spotify tokens:", error)
      throw error; // or handle the error as you see fit
    }
  }
  

async function refetchSpotifyData(userId: string) {
    const spotifyDoc = await Model.SpotifyTokens.findByPk(userId)

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

    if (refreshToken && accessToken) {
        spotifyDoc.refreshToken = refreshToken;
        spotifyDoc.accessToken = accessToken
        await spotifyDoc.update({
          accessToken,
          refreshToken
        })
        return {accessToken, refreshToken};

    }

    return null

}


async function disconnectSpotifyService(userId: string) {
    const transaction = await sequelize.transaction()
    try {

        await Model.SpotifyTokens.destroy({where: {userId}, transaction})
        await Model.UserTopArtists.destroy({where: {userId}, transaction})

        await transaction.commit()
        return true;
    } catch (error) {
        await transaction.rollback()
        console.error("Error disconnecting user from spotify:", error)
        throw error;
    }
}
  
async function isAccessTokenValid(accessToken: string): Promise<boolean> {
  try {
      const response = await axios.get("https://api.spotify.com/v1/me", {
          headers: {
              Authorization: `Bearer ${accessToken}`,
          },
      });
      return response.status === 200;
  } catch (error) {
      return false;
  }
}


async function fetchTopArtists(userId: string, accessToken: string) {
  const transaction = await sequelize.transaction();
  try {
    // Check token validity
    const isValid = await isAccessTokenValid(accessToken);
    
    if (!isValid) {
      // Try to get a new token using the refreshToken
      const newTokens = await refetchSpotifyData(userId);
      if (!newTokens || !newTokens.accessToken) {
        throw new Error("Refresh token is also expired.");
      }
      accessToken = newTokens.accessToken;
    }

    // Fetch top artists
    const response = await axios.get(
      "https://api.spotify.com/v1/me/top/artists?limit=10",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (response.data.error && response.data.error.message === "invalid_token") {
      throw new Error("Invalid Token");
    }

    // Process and store artists
    const formattedArtists = response.data.items.map((artist: any, index: number) => {
      const artistData = {
        artistName: artist.name,
        artistSpotifyId: artist.id,
        imageUrl: artist.images[0]?.url || null,
      };

      return Model.TopArtists.create(artistData as any, { transaction })
        .then((newArtist) => {
          return Model.UserTopArtists.create({
            userId,
            artistId: newArtist.id,
            rank: index + 1
          } as any, { transaction });
        });
    });

    await Promise.all(formattedArtists);

    await transaction.commit();
    return response.data.items;

  } catch (error) {
    await transaction.rollback();
    console.error("Error fetching top artists:", error);
    throw error;
  }
}


const SpotifyServices = {
    getSpotifyUserProfile,
    storeUserSpotifyData,
    disconnectSpotifyService,
    refetchSpotifyData,
    fetchTopArtists
};
export default SpotifyServices