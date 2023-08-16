import {API_ENDPOINTS} from '../constants';
import Geolocation from '@react-native-community/geolocation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { TYPES } from '../constants';
import { AppStatusActions } from '../redux';
import { useDispatch } from '../utils/hooks';

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

  const getGeoLocation = (onLocationFetched?: (position: TYPES.PositionType) => void) => {
    const dispatch = useDispatch();
  
    const { currentUserId } = useSelector(
      (state: TYPES.AppState) => state.usersReducer,
    );
  
    const { locationFetchComplete } = useSelector(
      (state: TYPES.AppState) => state.appStatusReducer,
    );
  
    const checkLocationEnabled = () => {
      Geolocation.getCurrentPosition(
        position => {
          if (onLocationFetched) {
            onLocationFetched(position.coords);
          }
          dispatch(AppStatusActions.setIsLocationFetchComplete(true));
        },
        error => {
          console.log(error.code, error.message);
          dispatch(AppStatusActions.setShowLocationScreen(true));
        },
        { enableHighAccuracy: true },
      );
    };
  
    useEffect(() => {
      if (currentUserId && !locationFetchComplete)
        checkLocationEnabled();
    }, [currentUserId, locationFetchComplete]);
  };

  return {getLocation, updateLocation, getGeoLocation};
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

  

  const initUserProfile = async (uid: string, locationData:TYPES.PositionType, signal?: AbortSignal) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.INIT_USER_PROFILE}/${uid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        signal,    
        body: JSON.stringify({locationData: {coordinates:locationData}}) 
      });
      const data = await response.json();
      return data;
    } catch (error:any) {
      console.log('Error message:', error.message);
    }
  };

  return {getProfile, initUserProfile};
};

export const UserService = {
  ...locationService(),
  ...profileService(),
};

