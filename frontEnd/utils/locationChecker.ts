import Geolocation from '@react-native-community/geolocation';
import { Platform, Alert } from 'react-native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { storeData } from './storage';

let isAlertBeingShown = false;  // <-- New flag to track alert status

const checkLocationStatus = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        storeData("coordinates", JSON.stringify({longitude: position.coords.longitude, latitude: position.coords.latitude}))
      },
      (error) => {
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            resolve(false);
            break;
          default:
            reject(error.message);
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

export const startContinuouslyCheckingLocation = (interval: number = 5000) => {
  locationCheckInterval = setInterval(async () => {
    try {
      const hasLocationAccess = await checkLocationStatus();
      if (!hasLocationAccess) {
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
  }, interval);
};

export const stopContinuouslyCheckingLocation = () => {
  if (locationCheckInterval) {
    clearInterval(locationCheckInterval);
  }
};