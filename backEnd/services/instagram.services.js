import User from "../models/user.model.js";
import axios from "axios";
import instagramModel from "../models/instagram.model.js";
import qs from "qs"

const REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI;
const CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID;
const CLIENT_SECRET = process.env.INSTAGRAM_CLIENT_SECRET;

async function obtainInstagramTokens(code) {
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
    const expiryDate = new Date(
      Date.now() + tokenResponse.data.expires_in * 1000
    );

    return {
      accessToken: tokenResponse.data.access_token,
      userId: tokenResponse.data.user_id,
      expiryDate: expiryDate,
    };
  } catch (error) {
    console.log(error);
  }
}

async function fetchInstagramImages(accessToken, userId) {
  const mediaResponse = await axios.get(
    `https://graph.instagram.com/${userId}/media?fields=id,caption,media_url&access_token=${accessToken}`
  );
  // Extract and format the media data as needed
  return mediaResponse.data.data;
}

async function refreshInstagramToken(accessToken) {
  try {
    const response = await axios.get(
      "https://graph.instagram.com/refresh_access_token",
      {
        params: {
          grant_type: "ig_refresh_token",
          access_token: accessToken,
        },
      }
    );

    const expiryDate = new Date(Date.now() + response.data.expires_in * 1000);

    return { token: response.data.access_token, expiryDate: expiryDate };
  } catch (error) {
    console.error("Error refreshing Instagram token:", error);
    throw error;
  }
}

async function storeUserInstagramData(
  uid,
  instagram_id,
  accessToken,
  expiryDate
) {
  const userAlreadyConnectedToInstagramId = await User.findOneAndUpdate(
    { "profile.instagram.instagram_id": instagram_id, uid: { $ne: uid } },
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
    { uid },
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
    }).save();
  }

  return userAlreadyConnectedToInstagramId;
}

async function disconnectInstagram(uid) {
  const user = await User.findOne({ uid });
  if (!user) throw new Error("User not found.");

  const instagram_id = user.profile.instagram.instagram_id;

  if (!instagram_id)
    throw new Error("User is already disconnected from instagram");

  await instagramModel.deleteOne({ _id: instagram_id });

  const updatedUser = await User.findOneAndUpdate(
    { uid },
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
