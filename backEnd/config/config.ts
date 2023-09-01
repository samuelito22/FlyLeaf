import * as dotenv from "dotenv";
dotenv.config();

export const DB_URI = process.env.MONGODB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const FAST2SMS = process.env.FAST2SMS;
export const PORT = process.env.PORT || 5000;
export const NODE_ENV = process.env.NODE_ENV;
export const ORIGIN = process.env.ORIGIN;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const COOKIE_KEY = process.env.COOKIE_KEY;
export const CLIENT_PRIVATE_URL = process.env.CLIENT_PRIVATE_URL;


export const REFRESH_SECRET = process.env.REFRESH_JWT_SECRET;
export const ACCESS_SECRET = process.env.ACCESS_JWT_SECRET;
export const NODEMAILER_SECRET = process.env.NODEMAILER_JWT_SECRET;

export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
