import express from "express";

import spotifyController from "../controller/spotify.controller";

const router = express.Router();

router.put("/authenticateAndFetch", spotifyController.authenticateAndFetchSpotify)
router.delete('/disconnect', spotifyController.disconnectFromSpotify)
router.put('/refretch', spotifyController.refetchSpotify)

export default router;