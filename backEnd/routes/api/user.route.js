import express from "express";

import {
  emailExist,
  getUserLocation,
  phoneExist,
  registerUser,
  uidExist,
  updateUserLocation,
  getUserProfile
} from "../../controller/user.controller.js";

const router = express.Router();

router.post("/auth/register", registerUser);

router.post("/auth/uidExist", uidExist );

router.post("/auth/emailExist", emailExist);

router.post("/auth/phoneNumberExist", phoneExist);

router.post("/update/location", updateUserLocation);

router.get("/get/location/:uid", getUserLocation);

router.get("/get/profile/:uid", getUserProfile);

export default router;
