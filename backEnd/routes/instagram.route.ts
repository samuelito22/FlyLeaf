import express from "express";
import instagramController from "../controller/instagram.controller";

const router = express.Router();

router.put("/authenticate-and-fetch", instagramController.authenticateAndFetchInstagram)
router.delete('/disconnect', instagramController.disconnectFromInstagram)
router.put('/refresh-token', instagramController.refetchInstagram)

export default router;