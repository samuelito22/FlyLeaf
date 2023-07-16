import passport from "passport";
import { Router } from "express";
import { CLIENT_PRIVATE_URL } from "../config/config.js";
import {
  GOOGLE_ACCESS_DENIED_ERR,
  GOOGLE_ACCESS_NOT_AUTHORIZED_ERR,
} from "../errors.js";

const router = Router();

router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/callback",
  passport.authenticate("google", {
    successRedirect: "login/success",
    failureRedirect: "login/failed",
  })
);

router.get("/login/failed", (req, res) => {
  res.status(401).json({ error: true, message: GOOGLE_ACCESS_DENIED_ERR });
});

router.get("/login/success", (req, res) => {
  if (req.user) {
    res
      .status(200)
      .json({ error: true, message: "Successfully logged in", user: req.user });
  } else {
    res
      .status(403)
      .json({ error: true, message: GOOGLE_ACCESS_NOT_AUTHORIZED_ERR });
  }
});

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect(CLIENT_PRIVATE_URL);
});

export default router;
