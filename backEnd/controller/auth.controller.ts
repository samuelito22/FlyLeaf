import {
  SERVER_ERR,
} from "../errors";
import AuthServices from "../services/auth.services";
import express from "express"


// @route POST auth/users/register
// @desc Register user
// @access Public
async function registerUser(req:express.Request, res: express.Response) {
  try {
      const response = await AuthServices.registerUserService(req.body);
      res.status(200).json({
          type: "success",
          message: response,
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          type: "error",
          message: SERVER_ERR,
      });
  }
}

// @route GET auth/users/emailExist
// @desc Get if the email exists
// @access Public
async function emailExist(req:express.Request, res: express.Response) {
  try {
      const response = await AuthServices.emailExistService(req.body);
      return res
          .status(400)
          .json({ type: "error", message: response });
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          type: "error",
          message:  SERVER_ERR,
      });
  }
}

// @route GET auth/users/phoneExist
// @desc Get if the phone exists
// @access Public
async function phoneExist(req:express.Request, res: express.Response) {
  try {
      const response = await AuthServices.phoneExistService(req.body);
      return res
          .status(400)
          .json({ type: "error", message: response });
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          type: "error",
          message: SERVER_ERR,
      });
  }
}

// @route GET auth/users/uidExist
// @desc Get if the user uid exists
// @access Public
async function uidExist(req:express.Request, res: express.Response) {
  try {
      const response = await AuthServices.uidExistService(req.body);
      return res
          .status(400)
          .json({ type: "error", message: response });
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          type: "error",
          message: SERVER_ERR,
      });
  }
}

const authController = { uidExist, phoneExist, emailExist, registerUser }
export default authController