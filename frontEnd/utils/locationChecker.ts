import Geolocation from '@react-native-community/geolocation';
import { Platform, Alert } from 'react-native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { TYPES } from '../constants';

let isAlertBeingShown = false;  // <-- New flag to track alert status

export const checkLocationStatus = async (): Promise<{ success: boolean, position?: TYPES.GeolocationPosition, error?: string }> => {
  return new Promise((resolve) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve({ success: true, position });
      },
      (error) => {
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            resolve({ success: false, error: 'Permission Denied' });
            break;
          default:
            resolve({ success: false, error: error.message });
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  });
};

const requestLocationAndroid = async () => {
  await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
    interval: 10000,
    fastInterval: 5000,
  })
    .then(data => {})
    .catch(err => {
      // The user has not enabled the location services or doesn't want to enable them
    });
};

const informiOSUsers = () => {
  if (!isAlertBeingShown) {  // <-- Check the flag before showing alert
    isAlertBeingShown = true;
    Alert.alert(
      "Location Permission Required",
      "Please go to Settings and enable location services for this app.",
      [
        { text: "OK", onPress: () => { isAlertBeingShown = false; } } // <-- Reset the flag on "OK" press
      ]
    );
  }
};

let locationCheckInterval:any;

export const startContinuouslyCheckingLocation = (interval: number = 1800000) => {
  const checkLocation = async () => {
    try {
      const hasLocationAccess = await checkLocationStatus();
      if (!hasLocationAccess.success) {
        if (Platform.OS === "android") {
          await requestLocationAndroid();
        } else if (Platform.OS === "ios") {
          informiOSUsers();
        }
      }
    } catch (error) {
      if (Platform.OS === "android") {
        await requestLocationAndroid();
      } else if (Platform.OS === "ios") {
        informiOSUsers();
      }
    }
  }

  // Run the function immediately
  checkLocation();

  // Set up the interval
  locationCheckInterval = setInterval(checkLocation, interval);
};

export const stopContinuouslyCheckingLocation = () => {
  if (locationCheckInterval) {
    clearInterval(locationCheckInterval);
  }
};