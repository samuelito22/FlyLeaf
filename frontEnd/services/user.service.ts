import {API_ENDPOINTS} from '../constants';


const locationService = () => {
  const updateLocation = async (
    uid: string,
    locationData: {city: string; coordinates: [number, number]},
    signal?: AbortSignal,
  ) => {
    try {
      const response = await fetch(API_ENDPOINTS.UPDATE_LOCATION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({uid, locationData}),
        signal,
      });
      const data = await response.json();
      return data;
    } catch (error:any) {
      console.log('Error message:', error.message);
    }
  };

  const getLocation = async (uid: string, signal?: AbortSignal) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.GET_LOCATION}/${uid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
      });
      const data = await response.json();
      return data;
    } catch (error:any) {
      console.log('Error message:', error.message);
    }
  };

  return {getLocation, updateLocation};
};

const profileService = () => {
  const getProfile = async (uid: string, signal?: AbortSignal) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.GET_PROFILE}/${uid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal,     
      });
      const data = await response.json();
      return data;
    } catch (error:any) {
      console.log('Error message:', error.message);
    }
  };

  return {getProfile};
};

export const UserService = {
  ...locationService(),
  ...profileService(),
};
