// Server and Endpoint Errors
export const API_ENDPOINT_NOT_FOUND_ERR = "Api endpoint is not found";
export const SERVER_ERR = "Something went wrong";

// Authentication Errors
export const AUTH_HEADER_MISSING_ERR = "auth header is missing";
export const AUTH_TOKEN_MISSING_ERR = "auth token is missing";
export const JWT_DECODE_ERR = "incorrect token";
export const ACCESS_DENIED_ERR = "Access denied for normal user";

// User Existence Errors
export const USER_NOT_FOUND_ERR = "User not found";
export const USER_ALREADY_EXIST = "User already exists"
export const USER_CREATED = "User created"

// Email Errors
export const EMAIL_AVAILABLE = "Email is available";
export const EMAIL_NOT_EXIST = "Email does not exist";
export const EMAIL_NOT_FOUND_ERR = "Email not found";

// Phone Number Errors
export const PHONE_NUMBER_NOT_EXIST = "Phone number does not exist";

// Uid error
export const UID_NOT_EXIST = "Uid does not exist";

// Third Party Login Errors
export const GOOGLE_ACCESS_DENIED_ERR = "Google Login Failed";
export const GOOGLE_ACCESS_NOT_AUTHORIZED_ERR = "Not authorized";

export const DATABASE_UPDATED = "Database updated successfully"

export const SPOTIFY_IN_USE = "Your Spotify account has been linked to a different profile in FlyLeaf. If this was intentional, no action is needed. If you did not request this, please contact our support team immediately."
export const INSTAGRAM_IN_USE = "Your Instagram account has been linked to a different profile in FlyLeaf. If this was intentional, no action is needed. If you did not request this, please contact our support team immediately."

export const FAILED_CREATION_ACCESS_AND_REFRESH_TOKEN = "Failed to create either the access token or the refresh token."
export const INVALID_TOKEN = "Invalid token."
export const REVOKED_TOKEN = "Revoked token."
export const TOKEN_NOT_FOUND = "Token not found."
export const EXPIRED_TOKEN = "Expired token."
export const UNAUTHORIZED_REQUEST = "Unauthorized request."
export const BAD_REQUEST = "Passed data is not correct."
export const INVALID_GRANT_TYPE = "Invalid grant type."