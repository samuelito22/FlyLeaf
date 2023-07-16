import {StyleSheet} from 'react-native';
import {BORDER_RADIUS} from '../../../../constants';

export const styles = StyleSheet.create({
  progressBar: {
    width: '100%',
  },
  progressBar__bar: {
    height: '100%',
    borderRadius: BORDER_RADIUS.large,
  },
  safeArea: {
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
