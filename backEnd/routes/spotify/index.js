import express from "express";

import spotifyController from "../../controller/spotify.controller.js";

const router = express.Router();

router.put("/authenticateAndFetchSpotify/:uid", spotifyController.authenticateAndFetchSpotify)
router.delete('/disconnectFromSpotify/:uid', spotifyController.disconnectFromSpotify)
router.put('/refetchSpotify', spotifyController.refetchSpotify)

export default router;