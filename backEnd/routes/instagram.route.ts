import express from "express";
import instagramController from "../controller/instagram.controller";

const router = express.Router();

router.put("/authenticateAndFetch/:uid", instagramController.authenticateAndFetchInstagram)
router.delete('/disconnect', instagramController.disconnectFromInstagram)
router.put('/refresh', instagramController.refetchInstagram)

export default router;