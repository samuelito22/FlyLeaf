import React from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';
import {THEME_COLORS, TYPES} from '../../constants';

const SafeContainer: React.FC<TYPES.SafeContainerProps> = ({
  children,
  style,
}) => {
  return (
    <SafeAreaView style={[styles.SafeAreaView, style]}>{children}</SafeAreaView>
  );
};

const styles = StyleSheet.create({
  SafeAreaView: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
    alignItems: 'center',
  },
});

export default SafeContainer;
