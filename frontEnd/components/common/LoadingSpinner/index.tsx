import React from 'react';
import {View, ActivityIndicator, StyleSheet, Modal, Text} from 'react-native';
import {BORDER_RADIUS, COLORS, themeText} from '../../../constants';

const LoadingSpinner = () => {
  return (
    <Modal transparent={true}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator animating={true} size={15} color={'white'} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000020',
  },
  activityIndicatorWrapper: {
    height: 50,
    width: 150,
    borderRadius: BORDER_RADIUS.medium,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    backgroundColor: 'black',
  },
  loadingText: {
    ...themeText.bodyMediumSix,
    color: 'white',
  },
});

export default LoadingSpinner;
