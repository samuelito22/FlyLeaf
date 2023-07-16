import {StyleSheet} from 'react-native';
import {COLORS, FONTS} from '../../../constants';

export const styles = StyleSheet.create({
  inputBox: {
    maxHeight: 39,
    height: '100%',
    borderBottomWidth: 1,
    flex: 1,
    fontFamily: FONTS.rubikLight,
    fontSize: 20,
    color: COLORS.dark,
    paddingVertical: 6,
  },
});
