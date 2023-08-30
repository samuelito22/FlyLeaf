import express from "express";

import userController from "../controller/user.controller";

const router = express.Router();

router.get("/me", userController.getProfile)



export default router;