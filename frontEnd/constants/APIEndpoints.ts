import { BASE_URL } from "@env"

export const API_ENDPOINTS = {
    REGISTER: `${BASE_URL}}/user/auth/register`,
    EMAIL_EXIST: `${BASE_URL}/user/auth/emailExist`,
    PHONE_NUMBER_EXIST: `${BASE_URL}/user/auth/phoneNumberExist`,
    UID_EXIST: `${BASE_URL}/user/auth/uidExist`,
    UPDATE_LOCATION: `${BASE_URL}/user/update/location`,
    GET_LOCATION: `${BASE_URL}/user/get/location`
  };