import express from "express";

import spotifyController from "../controller/spotify.controller";

const router = express.Router();

router.put("/authenticateAndFetch/:uid", spotifyController.authenticateAndFetchSpotify)
router.delete('/disconnect/:uid', spotifyController.disconnectFromSpotify)
router.put('/refetch', spotifyController.refetchSpotify)

export default router;