import {BASE_URL} from '@env';

export const API_ENDPOINTS = {
  REGISTER: `${BASE_URL}/api/auth/register`,
  EMAIL_EXIST: `${BASE_URL}/api/auth/emailExist`,
  PHONE_NUMBER_EXIST: `${BASE_URL}/api/auth/phoneNumberExist`,
  UID_EXIST: `${BASE_URL}/api/auth/uidExist`,
  UPDATE_LOCATION: `${BASE_URL}/api/users/update/location`,
  GET_LOCATION: `${BASE_URL}/api/users/get/location`,
  GET_PROFILE: `${BASE_URL}/api/users/get/profile`,
  AUTHENTICATE_AND_FETCH_SPOTIFY: `${BASE_URL}/api/spotify/authenticateAndFetchSpotify`,
  DISCONNECT_FROM_SPOTIFY: `${BASE_URL}/api/spotify/disconnectFromSpotify`,
  REFETCH_SPOTIFY: `${BASE_URL}/api/spotify/refetchSpotify`,
  INIT_USER_PROFILE: `${BASE_URL}/api/users/initUserProfile`,
}
