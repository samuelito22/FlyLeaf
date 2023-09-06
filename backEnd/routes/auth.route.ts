import express from "express";

import authController from "../controller/auth.controller";
import upload from "../config/multerConfig";

const router = express.Router();

router.post("/register", upload.array('pictures', 6) ,authController.registerUser);

router.post("/log-out", authController.logOutUser);

router.delete("/delete", authController.deleteUser);

router.post("/refresh-token", authController.refreshToken)

router.put("/change-phone-number", authController.changePhoneNumber);

router.put("/change-email", authController.changeEmail);

router.delete("/remove-email", authController.removeEmail);

router.post("/id-exist", authController.idExist );

router.post("/email-exist", authController.emailExist);

router.post("/phone-number-exist", authController.phoneNumberExist);

router.post('/log-in/send-otp', authController.sendOTP);
  
router.post('/log-in/verify-otp', authController.verifyOTP)

router.post('/log-in/request-login-link', authController.sendLink)

router.get('/log-in/verify-login-link/:token', authController.verifyLink)

router.put('/log-in/authCode', authController.validateAuthCodeAndFetchTokens)

router.post('/log-in/google', authController.googleSignIn);

router.post('/log-in/facebook', authController.facebookSignIn);


export default router;