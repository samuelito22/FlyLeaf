import express from "express";

import userController from "../controller/user.controller";

const router = express.Router();

router.get("/me", userController.getMyProfile)
router.put("/me/update-profile", userController.updateUserProfile)
router.get("/:_id", userController.getUserProfile)


export default router;