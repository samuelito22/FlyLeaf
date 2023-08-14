import { INSTAGRAM_IN_USE, USER_NOT_FOUND_ERR } from "../errors.js";
import InstagramServices from "../services/instagram.services.js";
import UserServices from "../services/user.services.js";
import { validateUid } from "../validators/auth.validator.js";
import { validateUidAndCode } from "../validators/media.validator.js";
import User from "../models/user.model.js";
import instagramModel from "../models/instagram.model.js";


const sendError = (res, message, status = 500) => {
  return res.status(status).json({ type: "error", message });
};

// Controller Functions

async function authenticateAndFetchInstagram(req, res) {
    try {
      const { uid } = req.params;
      const { code } = req.body;
  
      const { error } = validateUidAndCode({ uid, code });
  
      if (error) return sendError(res, error.details[0].message, 400);
  
      const resultToken = await InstagramServices.obtainInstagramTokens(code);
   
      const user = await UserServices.getUserProfile(uid)

      if(user.profile.instagram?.instagram_id === resultToken.userId){
        return res.status(304).json({
          type: "error",
          message: "User is already connected to Instagram",
        });
      }

      const userAlreadyConnectedToInstagramId = await InstagramServices.storeUserInstagramData(uid,resultToken.userId,resultToken.accessToken,resultToken.expiryDate)

      const images = await InstagramServices.fetchInstagramImages(resultToken.accessToken, resultToken.userId)
  
      // Send success status back.
      return res.status(200).json({
        type: "success",
        message: "Authentication and fetch successful",
        importantMessage: userAlreadyConnectedToInstagramId && INSTAGRAM_IN_USE,
        images: images
      });
    } catch (error) {
      console.error("Error authenticating with Instagram:", error);
      return sendError(res, "Internal Server Error");
    }
  }

async function refetchInstagram(req, res) {
    try {
        const { uid } = req.body;
        const { error } = validateUid({uid});
        if (error) return sendError(res, error.details[0].message, 400);

        const user = await User.findOne({uid})
        if(!user){
            sendError(res, USER_NOT_FOUND_ERR, 404)
        }

        const instagram_id = user.profile.instagram.instagram_id
        const InstagramData = await instagramModel.findOne({_id:instagram_id})

        if(!InstagramData){
            sendError(res, "Instagram data was not found", 404)
        }

        const currentDate = new Date(Date.now());
        const expiryDate = new Date(InstagramData.expiryDate)

        let accessToken = InstagramData.accessToken

        if(currentDate.getTime() >= expiryDate.getTime()){
            accessToken = await InstagramServices.refreshInstagramToken(accessToken)
        }

        const images = await InstagramServices.fetchInstagramImages(accessToken,instagram_id)

        if(images === "access-denied"){
            const result = await InstagramServices.disconnectInstagram(uid)
            if(!result){
                sendError(res, "Error deleting user's instagram data", 400)
            }
        }

        return res.status(200).json({
            type: "success",
            message: "New access token created and fetched user's instagram data successfully",
        });
    } catch (error) {
        console.error("Error refreshing access token:", error);
        return sendError(res, error.message || "Internal Server Error");
    }
}

async function disconnectFromInstagram(req, res) {
    try {
        const { uid } = req.body;
        const { error } = validateUid({uid});
        if (error) return sendError(res, error.details[0].message, 400);

        const result = await InstagramServices.disconnectInstagram(uid)
        if(!result){
            sendError(res, "Error deleting user's instagram data", 400)
        }

        return res.status(200).json({
            type: "success",
            message: "Disconnected from Instagram successfully",
        });
    } catch (error) {
        console.error("Error disconnecting from Instagram:", error);
        return sendError(res, error.message || "Internal Server Error");
    }
}

const instagramController = {
    authenticateAndFetchInstagram,
    refetchInstagram,
    disconnectFromInstagram,
  };
export default instagramController

