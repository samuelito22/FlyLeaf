import morgan from "morgan";
import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import userRoutes from "./routes/api/user.route.js";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import passportConfig from "./config/passport.js";
import cors from "cors"
import { COOKIE_KEY, DB_URI, NODE_ENV, PORT } from "./config/config.js";
import { API_ENDPOINT_NOT_FOUND_ERR } from "./errors.js";

const app = express();


// BodyParser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

// cookie middleware
app.use(
  cookieSession({
    name: "cookie session",
    maxAge: 24 * 60 * 60 * 1000,
    keys: [COOKIE_KEY],
  })
);

app.use(
  cookieSession({
    name: "session",
    secret: "your-secret-key",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

// log in development environment
if (NODE_ENV === "dev") {
  app.use(morgan("dev"));
}

app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

// Routes
app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    type: "success",
    message: "server is up and running",
    data: null,
  });
});

// page not found error handling  middleware
app.use("*", (req, res) => {
  const error = {
    type: "error",
    message: API_ENDPOINT_NOT_FOUND_ERR,
  };
  return res.status(404).json(error);
});

// global error handling middleware
app.use((err, req, res, next) => {
  console.log(err);
  const status = err.status || 500;
  const message = err.message || SERVER_ERR;
  const data = err.data || null;
  res.status(status).json({
    type: "error",
    message,
    data,
  });
});

export default app;
