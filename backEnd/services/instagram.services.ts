import Model from "../models";
import axios from "axios";
import qs from "qs"
import { USER_NOT_FOUND_ERR } from "../constants/errors";
import { sequelize } from "../config/sequelizeConfig";

const REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI;
const CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID;
const CLIENT_SECRET = process.env.INSTAGRAM_CLIENT_SECRET;

interface InstagramTokens {
  accessToken: string;
  userId: string;
  expiryDate: Date;
}

async function obtainInstagramTokens(code: string): Promise<InstagramTokens | null> {
  const data = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "authorization_code",
    redirect_uri: REDIRECT_URI,
    code: code,
  };

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  try {
    const tokenResponse = await axios.post(
      "https://api.instagram.com/oauth/access_token",
      qs.stringify(data),
      config
    );

    const exchangeTokenResponse = await axios.get<{ access_token: string; expires_in: number }>(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${data.client_secret}&access_token=${tokenResponse.data.access_token}`
    );

    const expiryDate = new Date(Date.now() + (exchangeTokenResponse.data.expires_in * 1000 * 0.95));

    return {
      accessToken: exchangeTokenResponse.data.access_token,
      userId: tokenResponse.data.user_id,
      expiryDate: expiryDate,
    };
  } catch (error) {
    console.error("Error obtaining Instagram tokens:", error);
    return null;
  }
}

async function fetchInstagramImages(accessToken: string, userId: string) {
  const transaction = await sequelize.transaction(); // Initialize a Sequelize transaction
  
  try {
    // Fetch the Instagram data from the database
    const instagramData = await Model.InstagramTokens.findOne({ where: { userId } });
    if (!instagramData) throw new Error(USER_NOT_FOUND_ERR);

    // Check if token expiry is within the next 24 hours
    if (!instagramData.tokenExpiration) throw new Error('Missing expiry date.');

    if (instagramData.tokenExpiration.getTime() - Date.now() <= 24 * 60 * 60 * 1000) {
      const newTokenData = await refreshInstagramToken(accessToken);
      accessToken = newTokenData.token;

      // Update the database
      await instagramData.update({
        accessToken: newTokenData.token,
        tokenExpiration:newTokenData.expiryDate
      }, { transaction });
    }

    // Fetch media from Instagram
    const mediaResponse = await axios.get(
      `https://graph.instagram.com/${userId}/media?fields=id,caption,media_url&access_token=${accessToken}`
    );

    const formattedImages = mediaResponse.data.data.map((image: { id: string, media_url: string }) => ({
      userId,
      imageUrl: image.media_url
    }));

    // Store images in the database
    await Model.InstagramImages.bulkCreate(formattedImages, { transaction });

    // Commit the transaction
    await transaction.commit();

    return formattedImages;

  } catch (error) {
    // If an error occurs, rollback the transaction
    await transaction.rollback();

    // Log the error and re-throw
    console.error("Error in fetchInstagramImages:", error);
    throw error;
  }
}

async function refreshInstagramToken(accessToken:string) {
  try {
    const response:{data:{access_token: string, expires_in: number}} = await axios.get(
      "https://graph.instagram.com/refresh_access_token",
      {
        params: {
          grant_type: "ig_refresh_token",
          access_token: accessToken,
        },
      }
    );

    const expiryDate = new Date(Date.now() + (response.data.expires_in * 1000 * 0.95));

    return { token: response.data.access_token, expiryDate: expiryDate };
  } catch (error) {
    console.error("Error refreshing Instagram token:", error);
    throw error;
  }
}

async function storeUserInstagramData(userId:string, accessToken:string, expiryDate:Date) {
  const transaction = await sequelize.transaction()

  try {
      await Model.InstagramTokens.destroy({where:{userId}, transaction})
      await Model.InstagramTokens.create({
        accessToken,
        tokenExpiration: expiryDate,
        userId,
      } as any, {transaction});
      
      transaction.commit()
      return "Successfully stored user's instagram tokens"
      
  } catch (error) {
      await transaction.rollback()
      console.error("Error storing user's data:", error)
      throw error;
  }
}

async function disconnectInstagram(id: string) {
  if (!id) {
    throw new Error("User ID must not be null or undefined.");
  }

  const transaction = await sequelize.transaction();

  try {
    const instagramDoc = await Model.InstagramTokens.findByPk(id, { transaction });

    if (!instagramDoc) {
      throw new Error(USER_NOT_FOUND_ERR);
    }

    await Model.InstagramImages.destroy({ where: { userId: id }, transaction });
    await Model.InstagramTokens.destroy({ where: { userId: id }, transaction });

    await transaction.commit();

    return "Successfully disconnected user from Instagram.";
  } catch (error) {
    await transaction.rollback();
    console.error("Error disconnecting user from Instagram:", error);
    throw error;
  }
}



const InstagramServices = {
  obtainInstagramTokens,
  fetchInstagramImages,
  refreshInstagramToken,
  storeUserInstagramData,
  disconnectInstagram,
};
export default InstagramServices;



