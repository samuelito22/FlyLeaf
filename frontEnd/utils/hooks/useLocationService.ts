import Geolocation from '@react-native-community/geolocation';
import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {TYPES} from '../../constants';
import useDispatch from './useDispatch';
import {API_KEY_GEO} from '@env';
import {UserService} from '../../services';
import { AppStatusActions } from '../../redux';

type LocationData = {
  city: string;
  coordinates: [number, number];
  country: string;
};

const useLocationService = () => {
  const dispatch = useDispatch();

  const {currentUserId} = useSelector(
    (state: TYPES.AppState) => state.usersReducer,
  );

  const {locationFetchComplete} = useSelector(
    (state: TYPES.AppState) => state.appStatusReducer,
  );

  const getPosition = async (
    position: any,
    newLocationData: LocationData | null,
  ) => {
    function getCityName(result: any) {
      for (let component of result.address_components) {
        if (component.types.includes('postal_town')) {
          return component.long_name;
        }
      }

      // City name was not found in the response
      return null;
    }

    function getCountryName(result: any) {
      for (let component of result.address_components) {
        if (component.types.includes('country')) {
          return component.long_name;
        }
      }

      // City name was not found in the response
      return null;
    }

    if (
      !newLocationData ||
      !position ||
      !position.coords ||
      Math.abs(newLocationData.coordinates[0] - position.coords.latitude) >
        0.01 ||
      Math.abs(newLocationData.coordinates[1] - position.coords.longitude) >
        0.01
    ) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${API_KEY_GEO}`,
      );

      const data = await response.json();
      if (data.status === 'OK') {
        const result = data.results[0];
        const cityName = getCityName(result);
        const countryName = getCountryName(result);
        const newLocationData: LocationData = {
          coordinates: [position.coords.latitude, position.coords.longitude],
          city: cityName,
          country: countryName,
        };
        console.log(
          'Geographical position found. Proceeding to update database...',
        );

        updateUserLocation(newLocationData);
      } else {
        // Log the error message
        console.error(
          `Geocoding API request failed with status: ${data.status}`,
        );

        // TODO: Inform the user that location information couldn't be retrieved
        // You might use a state variable or some UI element to do this
      }
    } else {
      console.log(
        'The difference between the last position and the current position is not great, hence there has been no update in the database',
      );
      dispatch(AppStatusActions.setIsLocationFetchComplete(true));
    }
  };

  const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

const checkLocationEnabled = (retryCount = 0) => {
  const controller = new AbortController(); 
  Geolocation.getCurrentPosition(
    async position => {
      dispatch(AppStatusActions.setShowLocationScreen(false));
        UserService.getLocation(currentUserId, controller.signal)
          .then(result => {
            let newLocationData = null;
            if (result?.location) {
              newLocationData = {
                coordinates: result.location.coordinates,
                city: result.location.city,
                country: result.location.country,
              };
            }

            getPosition(position, newLocationData);
          })
          .catch(e => {
            console.log(e);
            if (retryCount < MAX_RETRIES) {
              setTimeout(() => checkLocationEnabled(retryCount + 1), RETRY_DELAY);
            }
          });
    },
    error => {
      console.log(error.code, error.message);
      dispatch(AppStatusActions.setShowLocationScreen(true));
    },
    {enableHighAccuracy: true},
  );

  controller.abort
};

const updateUserLocation = async (locationData: LocationData | null, retryCount = 0) => {
  const controller = new AbortController(); 
  if (locationData) {
    await UserService.updateLocation(currentUserId, locationData, controller.signal)
      .then(result => {
        if (result.type === 'success') {
          console.log('Database successfully updated');
          dispatch(AppStatusActions.setIsLocationFetchComplete(true));
        } else {
          console.log(result.message);
          if (retryCount < MAX_RETRIES) {
            setTimeout(() => updateUserLocation(locationData, retryCount + 1), RETRY_DELAY);
          }
        }
      })
      .catch(e => {
        console.error(e);
        if (retryCount < MAX_RETRIES) {
          setTimeout(() => updateUserLocation(locationData, retryCount + 1), RETRY_DELAY);
        }
      });
  } else {
    // Handle the scenario where uid is not defined.
    console.error('User is not authenticated.');
  }

  return () => controller.abort
};


  useEffect(() => {
    if (currentUserId && !locationFetchComplete)
      checkLocationEnabled();
  }, [currentUserId, locationFetchComplete]);
};

export default useLocationService;
