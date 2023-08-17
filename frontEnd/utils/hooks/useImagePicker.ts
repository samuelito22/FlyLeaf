import {Platform, Alert} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {useFocusEffect} from '@react-navigation/native';
import React from 'react';

const useImagePicker = () => {
  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        if (Platform.OS !== 'web') {
          const cameraPermission =
            Platform.OS === 'ios'
              ? PERMISSIONS.IOS.CAMERA
              : PERMISSIONS.ANDROID.CAMERA;
          const galleryPermission =
            Platform.OS === 'ios'
              ? PERMISSIONS.IOS.PHOTO_LIBRARY
              : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

          const cameraStatus = await check(cameraPermission);
          const galleryStatus = await check(galleryPermission);

          if (
            cameraStatus !== RESULTS.GRANTED ||
            galleryStatus !== RESULTS.GRANTED
          ) {
          }
        }
      })();
    }, []),
  );

  const handleCameraButtonPress = () => {
    return new Promise<string | undefined>((resolve, reject) => {
      launchCamera({mediaType: 'photo', quality: 1}, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
          resolve(undefined);
        } else if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
          reject(response.errorMessage);
        } else {
          if (response.assets) resolve(response.assets[0].uri);
          else resolve(undefined);
        }
      });
    });
  };

  const handleGalleryButtonPress = () => {
    return new Promise<string | undefined>((resolve, reject) => {
      launchImageLibrary({mediaType: 'photo', quality: 1}, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
          resolve(undefined);
        } else if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
          reject(response.errorMessage);
        } else {
          if (response.assets) resolve(response.assets[0].uri);
          else resolve(undefined);
        }
      });
    });
  };

  return {
    handleCameraButtonPress,
    handleGalleryButtonPress,
  };
};

export default useImagePicker;