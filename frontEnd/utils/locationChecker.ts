import Geolocation from '@react-native-community/geolocation';
import { Platform, Alert } from 'react-native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { TYPES } from '../constants';

let isAlertBeingShown = false;

const requestLocationAndroid = async (): Promise<void> => {
  try {
    await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
      interval: 10000,
      fastInterval: 5000,
    });
  } catch (err) {
    // Handle the error if needed
    console.error(err);
  }
};


const informiOSUsers = () => {
  if (!isAlertBeingShown) {
    isAlertBeingShown = true;
    Alert.alert(
      "Location Permission Required",
      "Please go to Settings and enable location services for this app.",
      [
        { text: "OK", onPress: () => { isAlertBeingShown = false; } }
      ]
    );
  }
};

export const getLocationOnDemand = async (): Promise<TYPES.GeolocationPosition> => {
  while (true) {
    try {
      const position = await new Promise<TYPES.GeolocationPosition>((resolve, reject) => {
        Geolocation.getCurrentPosition(
          position => resolve(position),
          error => reject(error),
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
      });
      
      return position;  // Return the location if successfully retrieved

    } catch (error:any) {
      if (Platform.OS === 'android') {
        await requestLocationAndroid();
      } else if (Platform.OS === 'ios') {
        informiOSUsers();
      }
      
    }
  }
};
