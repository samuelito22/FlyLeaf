import express from "express";
import instagramController from "../controller/instagram.controller";

const router = express.Router();

router.put("/authenticate-and-fetch/:_id", instagramController.authenticateAndFetchInstagram)
router.delete('/disconnect/:_id', instagramController.disconnectFromInstagram)

export default router;