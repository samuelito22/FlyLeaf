import {BASE_URL} from '@env';

export const API_ENDPOINTS = {
  REGISTER: `${BASE_URL}/api/auth/register`,
  EMAIL_EXIST: `${BASE_URL}/api/auth/emailExist`,
  PHONE_NUMBER_EXIST: `${BASE_URL}/api/auth/phoneNumberExist`,
  UID_EXIST: `${BASE_URL}/api/auth/uidExist`,
  UPDATE_LOCATION: `${BASE_URL}/api/users/update/location`,
  GET_LOCATION: `${BASE_URL}/api/users/get/location`,
  GET_PROFILE: `${BASE_URL}/api/users/get/profile`,
  UPDATE_PROFILE: `${BASE_URL}/api/users/update/profile`,
  AUTHENTICATE_AND_FETCH_SPOTIFY: `${BASE_URL}/api/spotify/authenticateAndFetch`,
  DISCONNECT_FROM_SPOTIFY: `${BASE_URL}/api/spotify/disconnect`,
  REFETCH_SPOTIFY: `${BASE_URL}/api/spotify/refetch`,
  INIT_USER_PROFILE: `${BASE_URL}/api/users/initUserProfile`,
  GET_QUESTIONS_AND_INTERESTS: `${BASE_URL}/api/users/get/questionsAndInterests`,
  AUTHENTICATE_AND_FETCH_INSTAGRAM: `${BASE_URL}/api/instagram/authenticateAndFetch`,
  DISCONNECT_FROM_INSTAGRAM: `${BASE_URL}/api/instagram/disconnect`,
  REFETCH_INSTAGRAM: `${BASE_URL}/api/instagram/refetch`,
}
