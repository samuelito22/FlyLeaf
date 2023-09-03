import express from "express";

import userController from "../controller/user.controller";
import upload from "../config/multerConfig";

const router = express.Router();

router.get("/me", userController.getMyProfile)
router.put("/me/update-profile",upload.fields([
    { name: 'picture-1', maxCount: 1 }, 
    { name: 'picture-2', maxCount: 1 }, 
    { name: 'picture-3', maxCount: 1 }, 
    { name: 'picture-4', maxCount: 1 }, 
    { name: 'picture-5', maxCount: 1 }, 
    { name: 'picture-0', maxCount: 1 },  ]), userController.updateUserProfile)
router.put("/me/update-settings", userController.updateSettingsAndPremium)
router.get("/:_id", userController.getUserProfile)


export default router;