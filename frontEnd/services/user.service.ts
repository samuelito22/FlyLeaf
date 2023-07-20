import {API_ENDPOINTS} from '../constants';

const locationService = () => {
  const updateLocation = async (
    uid: string,
    locationData: {city: string; coordinates: [number, number]},
  ) => {
    try {
      const response = await fetch(API_ENDPOINTS.UPDATE_LOCATION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({uid, locationData}),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const getLocation = async (uid: string) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.GET_LOCATION}/${uid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  return {getLocation, updateLocation};
};

const profileService = () => {
  const getProfile = async (uid: string) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.GET_PROFILE}/${uid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  return {getProfile};
};

export const UserService = {
  ...locationService(),
  ...profileService(),
};
