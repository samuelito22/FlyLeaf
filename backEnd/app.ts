import morgan from "morgan";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors"
import {  NODE_ENV } from "./config/config";
import { API_ENDPOINT_NOT_FOUND_ERR } from "./constants/errors";
import mainRoutes from "./routes/index"
import { expressParams } from "./types";

const app = express();


app.use(cors());

// BodyParser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

// log in development environment
if (NODE_ENV === "dev") {
  app.use(morgan("dev"));
}

// Routes
app.use("/api", mainRoutes);

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
app.use(({ err, req, res, next }: expressParams) => {
  console.log(err);
  const status = err?.status || 500;
  const message = err?.message || 'Internal Server Error';
  const data = err?.data || null;
  res.status(status).json({
    type: 'error',
    message,
    data,
  });
});
export default app;
