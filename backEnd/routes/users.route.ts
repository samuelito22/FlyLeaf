import express from "express";

import userController from "../controller/user.controller";

const router = express.Router();

router.post("/update/location", userController.updateUserLocation);

router.put("/update/profile/:uid", userController.updateUserProfile);

router.get("/get/location/:uid", userController.getUserLocation);

router.get("/get/profile/:uid", userController.getUserProfile);

router.put("/initUserProfile/:uid", userController.initUserProfile);

router.get("/get/questionsAndInterests", userController.getQuestionsAndInterests);



export default router;