import User from "../models/user.model";
import axios from "axios";
import instagramModel from "../models/instagram.model";
import qs from "qs"

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

async function fetchInstagramImages(accessToken:string, userId:string) {
  const mediaResponse = await axios.get(
    `https://graph.instagram.com/${userId}/media?fields=id,caption,media_url&access_token=${accessToken}`
  );

  const formattedImages = mediaResponse.data.data.map((images: {id:string, media_url:string}) => ({
    id: images.id,
    url: images.media_url
  }));

  await instagramModel.findOneAndUpdate(
    {_id: userId},
    {
        $set: {
            "images": formattedImages
        }
    }
  )
  
  return formattedImages;
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

async function storeUserInstagramData(
  uid:string,
  instagram_id:string,
  accessToken:string,
  expiryDate:Date
) {
  const userAlreadyConnectedToInstagramId = await User.findOneAndUpdate(
    { "profile.instagram.instagram_id": instagram_id, _id: { $ne: uid } },
    {
      $set: {
        "profile.instagram": {
          isConnected: false,
          instagram_id: null,
        },
      },
    },
    { new: true }
  );

  await User.findOneAndUpdate(
    { _id: uid },
    {
      $set: {
        "profile.instagram": {
          isConnected: true,
          instagram_id: instagram_id,
        },
      },
    },
    { new: true }
  );

  if (userAlreadyConnectedToInstagramId) {
    await instagramModel.findOneAndUpdate(
      { _id: instagram_id },
      {
        $set: {
          accessToken: accessToken,
          expiryDate: expiryDate,
        },
      },
      { new: true }
    );
  } else {
    await new instagramModel({
      accessToken: accessToken,
      expiryDate: expiryDate,
      _id: instagram_id
    }).save();
  }

  return userAlreadyConnectedToInstagramId;
}

async function disconnectInstagram(uid:string) {
  const user = await User.findOne({ _id: uid });
  if (!user) throw new Error("User not found.");

  const instagram_id = user.instagram;

  if (!instagram_id)
    throw new Error("User is already disconnected from instagram");

  await instagramModel.deleteOne({ _id: instagram_id });

  const updatedUser = await User.findOneAndUpdate(
    { _id: uid },
    {
      $set: {
        "profile.instagram.isConnected": false,
        "profile.instagram.instagram_id": null,
      },
    },
    { new: true }
  );
  if (!updatedUser) throw new Error("Internal Server Error");
  return updatedUser;
}


const InstagramServices = {
  obtainInstagramTokens,
  fetchInstagramImages,
  refreshInstagramToken,
  storeUserInstagramData,
  disconnectInstagram,
};
export default InstagramServices;
