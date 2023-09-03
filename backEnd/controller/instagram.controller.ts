import { INSTAGRAM_IN_USE, USER_NOT_FOUND_ERR } from "../constants/errors";
import InstagramServices from "../services/instagram.services";
import { validateId } from "../validators/auth.validator";
import { validateIdAndCode } from "../validators/media.validator";
import User from "../models/user.model";
import instagramModel from "../models/instagram.model";
import express from 'express';
import centralizedErrorHandler from "../utils/centralizedErrorHandler.utils";
import { sendErrorResponse } from "../utils/response.utils";


const sendError = (res:express.Response, message:string, status = 500) => {
  return res.status(status).json({ type: "error", message });
};

// Controller Functions

async function authenticateAndFetchInstagram(req:express.Request, res: express.Response) {
    try {
      const { _id } = req.params;
      const { code } = req.body;
  
      const { error } = validateIdAndCode({ _id, code });
  
      if (error) return sendError(res, error.details[0].message, 400);
  
      const resultToken = await InstagramServices.obtainInstagramTokens(code);
      
      if(resultToken){
      const userAlreadyConnectedToInstagramId = await InstagramServices.storeUserInstagramData(_id,resultToken.userId,resultToken.accessToken,resultToken.expiryDate)

      const images = await InstagramServices.fetchInstagramImages(resultToken.accessToken, resultToken.userId)
  
      // Send success status back.
      return res.status(200).json({
        type: "success",
        message: "Authentication and fetch successful",
        importantMessage: userAlreadyConnectedToInstagramId && INSTAGRAM_IN_USE,
        images: images
      });
    }
    else{
      return sendError(res, "Failed to get a refreshToken", 400);
    }
    } catch (error) {
        const errorMessage = (error as Error).message;
        const status = centralizedErrorHandler(errorMessage);
        return sendErrorResponse(res, status, errorMessage);
    }
  }

async function refetchInstagram(req:express.Request, res: express.Response) {
    try {
        const { _id } = req.body;
        const { error } = validateId({_id});
        if (error) return sendError(res, error.details[0].message, 400);

        const user = await User.findOne({_id})
        if(!user){
            sendError(res, USER_NOT_FOUND_ERR, 404)
        }

        const instagram_id = user?.instagram
        const InstagramData = await instagramModel.findOne({_id:instagram_id})

        if(!InstagramData){
            return sendError(res, "Instagram data was not found", 404)
        }

        const currentDate = new Date(Date.now());
        let expiryDate
        if(InstagramData.expiryDate) expiryDate = new Date(InstagramData.expiryDate)

        let accessToken = InstagramData.accessToken

        if(expiryDate && accessToken && currentDate.getTime() >= expiryDate.getTime()){
            accessToken = (await InstagramServices.refreshInstagramToken(accessToken)).token
        }

        
        const images = accessToken && instagram_id && await InstagramServices.fetchInstagramImages(accessToken,instagram_id)

        if(images === "access-denied"){
            const result = await InstagramServices.disconnectInstagram(_id)
            if(!result){
                sendError(res, "Error deleting user's instagram data", 400)
            }
        }

        return res.status(200).json({
            type: "success",
            message: "New access token created and fetched user's instagram data successfully",
        });
    } catch (error) {
        const errorMessage = (error as Error).message;
    const status = centralizedErrorHandler(errorMessage);
    return sendErrorResponse(res, status, errorMessage);
    }
}

async function disconnectFromInstagram(req:express.Request, res: express.Response) {
    try {
        const { _id } = req.body;
        const { error } = validateId({_id});
        if (error) return sendError(res, error.details[0].message, 400);

        const result = await InstagramServices.disconnectInstagram(_id)
        if(!result){
            sendError(res, "Error deleting user's instagram data", 400)
        }

        return res.status(200).json({
            type: "success",
            message: "Disconnected from Instagram successfully",
        });
    } catch (error) {
        const errorMessage = (error as Error).message;
    const status = centralizedErrorHandler(errorMessage);
    return sendErrorResponse(res, status, errorMessage);
    }
}

const instagramController = {
    authenticateAndFetchInstagram,
    refetchInstagram,
    disconnectFromInstagram,
  };
export default instagramController

