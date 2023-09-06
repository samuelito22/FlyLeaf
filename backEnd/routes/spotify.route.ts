import express from "express";

import spotifyController from "../controller/spotify.controller";

const router = express.Router();

router.put("/authenticate-and-fetch", spotifyController.authenticateAndFetchSpotify)
router.delete('/disconnect', spotifyController.disconnectFromSpotify)
router.put('/refetch-token', spotifyController.refetchSpotify)

export default router;