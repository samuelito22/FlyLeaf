import {BASE_URL} from '@env';

export const API_ENDPOINTS = {
  REGISTER: `${BASE_URL}/api/auth/register`,
  LOG_OUT: `${BASE_URL}/api/auth/log-out`,
  DELETE_USER: `${BASE_URL}/api/auth/delete`,
  REFRESH_TOKEN: `${BASE_URL}/api/auth/refresh-token`,
  CHANGE_PHONE_NUMBER: `${BASE_URL}/api/auth/change-phone-number`,
  CHANGE_EMAIL: `${BASE_URL}/api/auth/change-email`,
  REMOVE_EMAIL: `${BASE_URL}/api/auth/remove-email`,
  ID_EXIST: `${BASE_URL}/api/auth/id-exist`,
  EMAIL_EXIST: `${BASE_URL}/api/auth/email-exist`,
  PHONE_NUMBER_EXIST: `${BASE_URL}/api/auth/phone-number-exist`,
  SEND_OTP: `${BASE_URL}/api/auth/log-in/send-otp`,
  VERIFY_OTP: `${BASE_URL}/api/auth/log-in/verify-otp`,
  REQUEST_LOGIN_LINK: `${BASE_URL}/api/auth/log-in/request-login-link`,
  VERIFY_LOGIN_LINK: `${BASE_URL}/api/auth/log-in/verify-login-link`, //:token
  VALIDATE_AUTH_CODE: `${BASE_URL}/api/auth/log-in/authCode`,
  GOOGLE_SIGN_IN: `${BASE_URL}/api/auth/log-in/google`,
  FACEBOOK_SIGN_IN: `${BASE_URL}/api/auth/log-in/facebook`,
  AUTHENTICATE_AND_FETCH_INSTAGRAM: `${BASE_URL}/api/instagram/authenticate-and-fetch`,
  DISCONNECT_FROM_INSTAGRAM: `${BASE_URL}/api/instagram/disconnect`,
  REFETCH_INSTAGRAM: `${BASE_URL}/api/instagram/refresh-token`,
  AUTHENTICATE_AND_FETCH_SPOTIFY: `${BASE_URL}/api/spotify/authenticate-and-fetch`,
  DISCONNECT_FROM_SPOTIFY: `${BASE_URL}/api/spotify/disconnect`,
  REFETCH_SPOTIFY: `${BASE_URL}/api/spotify/refetch-token`,
  GET_MY_PROFILE: `${BASE_URL}/api/users/me`,
  UPDATE_MY_PROFILE: `${BASE_URL}/api/users/me/update-profile`,
  UPDATE_SETTINGS_AND_PREMIUM: `${BASE_URL}/api/users/me/update-settings`,
  GET_USER_PROFILE_BY_ID: `${BASE_URL}/api/users`, //:_id
  GET_OVERVIEW_EN: `${BASE_URL}/api/overview/en`,
};
