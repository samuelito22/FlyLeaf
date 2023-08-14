import express from "express";

import authController from "../controller/auth.controller.js";

const router = express.Router();

router.post("/register", authController.registerUser);

router.post("/uidExist", authController.uidExist );

router.post("/emailExist", authController.emailExist);

router.post("/phoneNumberExist", authController.phoneExist);


export default router;