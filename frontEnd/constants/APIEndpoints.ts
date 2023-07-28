import {BASE_URL} from '@env';

export const getApiEndpoints = () => ({
  REGISTER: `${BASE_URL}/user/auth/register`,
  EMAIL_EXIST: `${BASE_URL}/user/auth/emailExist`,
  PHONE_NUMBER_EXIST: `${BASE_URL}/user/auth/phoneNumberExist`,
  UID_EXIST: `${BASE_URL}/user/auth/uidExist`,
  UPDATE_LOCATION: `${BASE_URL}/user/update/location`,
  GET_LOCATION: `${BASE_URL}/user/get/location`,
  GET_PROFILE: `${BASE_URL}/user/get/profile`,
  AGE_RESTRICTE_USER: `${BASE_URL}/user/ageRestrictUser`,
  IS_USER_AGE_RESTRICTED: `${BASE_URL}/user/isUserAgeRestricted`
});
