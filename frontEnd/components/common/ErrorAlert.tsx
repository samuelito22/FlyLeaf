import React from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';
import { THEME_COLORS, themeText } from '../../constants';

const ErrorAlert = ({ message, opacityValue }: {message:string, opacityValue:Animated.Value;}) => (
  <Animated.View style={[styles.errorContainer,{ opacity: opacityValue }]}>
    <Text style={styles.errorMessage}>{message}</Text>
  </Animated.View>
);

const styles = StyleSheet.create({
  errorContainer: {
    position: 'absolute',
    bottom: 80,
    alignSelf:'center',
    padding: 16,
    backgroundColor: THEME_COLORS.dark,
    borderRadius: 80,
    alignItems: 'center',
    zIndex: 99999
  },
  errorMessage: {
    color: 'white',
    ...themeText.bodyRegularSeven
  },
});

export default ErrorAlert;
