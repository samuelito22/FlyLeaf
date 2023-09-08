import express from "express";

import spotifyController from "../controller/spotify.controller";

const router = express.Router();

router.put("/authenticate-and-fetch/:_id", spotifyController.authenticateAndFetchSpotify)
router.delete('/disconnect/:_id', spotifyController.disconnectFromSpotify)

export default router;