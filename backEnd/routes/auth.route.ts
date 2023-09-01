import express from "express";

import authController from "../controller/auth.controller";

const router = express.Router();

router.post("/register", authController.registerUser);

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



// Generate Email Link Endpoint
router.post('/log-in/request-login-link', authController.sendLink)
router.get('/log-in/verify-login-link/:token', authController.verifyLink)
router.get('/log-in/authCode', authController.validateAuthCodeAndFetchTokens)

  


export default router;