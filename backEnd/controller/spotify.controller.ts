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
  const { id } = req.params;
        const { accessToken, refreshToken } = req.body;
    try {
        
        const { error } = validateIdAndTokens({ id, accessToken, refreshToken });
        
        if (error) return sendError(res, error.details[0].message, 400);

        const spotifyUserId = await SpotifyServices.getSpotifyUserProfile(accessToken);  // Assuming obtainSpotifyTokens is replaced by getSpotifyUserProfile
        await SpotifyServices.storeUserSpotifyData(id, refreshToken, accessToken); // Modified parameters

        const artists = await SpotifyServices.fetchTopArtists(accessToken, spotifyUserId);
  
        return res.status(200).json({
            type: "success",
            message: "Authentication and fetch successful",
            artists: artists
        });
    } catch (error) {
      await SpotifyServices.disconnectSpotifyService(id)
        const errorMessage = (error as Error).message;
        const status = centralizedErrorHandler(errorMessage);
        return sendErrorResponse(res, status, errorMessage);
    }
}

async function disconnectFromSpotify(req:express.Request, res: express.Response) {
    try {
        const { id } = req.params;
        const { error } = validateId({id});
        
        if (error) return sendError(res, error.details[0].message, 400);

        await SpotifyServices.disconnectSpotifyService(id);

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
