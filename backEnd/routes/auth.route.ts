import express from "express";

import authController from "../controller/auth.controller";

const router = express.Router();

router.post("/register", authController.registerUser);

router.post("/log-out", authController.logOutUser);

router.delete("/delete", authController.deleteUser);

router.post("/refresh-token", authController.refreshToken)

router.put("/change-phone-number", authController.changePhoneNumber);

//router.put("/change-recovery-email", authController.changeRecoveryEmail);

//router.delete("/remove-recovery-email", authController.removeRecoveryEmail);

router.post("/uidExist", authController.uidExist );

router.post("/emailExist", authController.emailExist);

router.post("/phoneNumberExist", authController.phoneNumberExist);


export default router;