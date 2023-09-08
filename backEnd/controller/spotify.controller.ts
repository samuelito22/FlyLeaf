import mongoose from "mongoose";
import { SPOTIFY_IN_USE } from "../constants/errors";
import SpotifyServices from "../services/spotify.services";
import centralizedErrorHandler from "../utils/centralizedErrorHandler.utils";
import { sendErrorResponse } from "../utils/response.utils";
import { validateId, validateIdAndTokens } from "../validators/auth.validator";
import express from 'express';

const sendError = (res:express.Response, message:string, status = 500) => {
    return res.status(status).json({ type: "error", message });
};

// Controller Functions

async function authenticateAndFetchSpotify(req:express.Request, res: express.Response) {
  const { _id } = req.params;
        const { accessToken, refreshToken } = req.body;
    try {
        
        const { error } = validateIdAndTokens({ _id, accessToken, refreshToken });
        
        if (error) return sendError(res, error.details[0].message, 400);

        const spotifyUserId = await SpotifyServices.getSpotifyUserProfile(accessToken);  // Assuming obtainSpotifyTokens is replaced by getSpotifyUserProfile
        const userAlreadyConnectedToSpotifyId = await SpotifyServices.storeUserSpotifyData(new mongoose.Types.ObjectId(_id), spotifyUserId, refreshToken, accessToken); // Modified parameters

        const artists = await SpotifyServices.fetchTopArtists(accessToken, spotifyUserId);
  
        return res.status(200).json({
            type: "success",
            message: "Authentication and fetch successful",
            importantMessage: userAlreadyConnectedToSpotifyId && SPOTIFY_IN_USE,
            artists: artists
        });
    } catch (error) {
      await SpotifyServices.disconnectSpotifyService(new mongoose.Types.ObjectId(_id))
        const errorMessage = (error as Error).message;
        const status = centralizedErrorHandler(errorMessage);
        return sendErrorResponse(res, status, errorMessage);
    }
}

async function disconnectFromSpotify(req:express.Request, res: express.Response) {
    try {
        const { _id } = req.params;
        const { error } = validateId({_id});
        
        if (error) return sendError(res, error.details[0].message, 400);

        await SpotifyServices.disconnectSpotifyService(new mongoose.Types.ObjectId(_id));

        return res.status(200).json({
            type: "success",
            message: "Disconnected from Spotify successfully",
        });
    } catch (error) {
        const errorMessage = (error as Error).message;
        const status = centralizedErrorHandler(errorMessage);
        return sendErrorResponse(res, status, errorMessage);
    }
}

const spotifyController = {
    authenticateAndFetchSpotify,
    disconnectFromSpotify,
};
export default spotifyController;
