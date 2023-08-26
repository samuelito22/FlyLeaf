import express from "express";

import authController from "../controller/auth.controller";

const router = express.Router();

router.post("/register", authController.registerUser);

router.post("/log-out", authController.logOutUser);

router.delete("/delete", authController.deleteUser);

router.post("/uidExist", authController.uidExist );

router.post("/emailExist", authController.emailExist);

router.post("/phoneNumberExist", authController.phoneExist);


export default router;