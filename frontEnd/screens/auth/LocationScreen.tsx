import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {Button, SafeContainer} from '../../components';
import {THEME_COLORS, themeText} from '../../constants';
import {icons} from '../../assets';
import LocationEnabler from 'react-native-android-location-enabler';
import {setShowLocationScreen} from '../../redux';
import {useDispatch} from '../../utils/hooks';

const LocationScreen = () => {
  const dispatch = useDispatch();

  const getLocation = () => {

    LocationEnabler.promptForEnableLocationIfNeeded({
      interval: 10000,
      fastInterval: 5000,
    })
      .then(data => {
        dispatch(setShowLocationScreen(false));
      })
      .catch(err => {
        // The user has not enabled the location services or doesn't want to enable them
      });

  }

  return (
    <SafeContainer>
      <View style={styles.container}>
        <Image source={icons.gpsBold} style={styles.gpsImage} />
        <View style={styles.textContainer}>
          <Text style={styles.header}>Switch it on</Text>
          <Text style={styles.paragraph}>
            Your location needs to be switched on in order to find people near
            by
          </Text>
        </View>
        <Button.PrimaryButton style={styles.button} onPress={getLocation}>
          Enable location
        </Button.PrimaryButton>
      </View>
    </SafeContainer>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 40,
  },
  header: {
    ...themeText.headingOne,
    color: THEME_COLORS.dark,
    textAlign: 'center',
  },
  paragraph: {
    ...themeText.bodyRegularFour,
    color: THEME_COLORS.tertiary,
    textAlign: 'center',
  },
  paragraph__span: {
    ...themeText.bodyBoldFour,
    color: THEME_COLORS.tertiary,
    textAlign: 'center',
  },
  textContainer: {
    maxWidth: 396,
    paddingHorizontal: 10,
  },
  button: {
    maxWidth: '100%',
    position: 'absolute',
    bottom: 0,
  },
  gpsImage: {
    height: 100,
    width: 100,
    marginBottom: 40,
    tintColor: THEME_COLORS.primary,
  },
});
