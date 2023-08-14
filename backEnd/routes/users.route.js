import express from "express";

import userController from "../controller/user.controller.js";

const router = express.Router();

router.post("/update/location", userController.updateUserLocation);

router.get("/get/location/:uid", userController.getUserLocation);

router.get("/get/profile/:uid", userController.getUserProfile);

router.put("/initUserProfile/:uid", userController.initUserProfile);

export default router;