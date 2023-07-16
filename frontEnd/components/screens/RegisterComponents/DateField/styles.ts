import {StyleSheet} from 'react-native';
import {COLORS, FONTS} from '../../../../constants';

export const styles = StyleSheet.create({
  dateField: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  dateField__input: {
    fontFamily: FONTS.rubikLight,
    fontSize: 20,
    lineHeight: 30,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 5,
    height: '100%',
  },
  dateField__hiddenInput: {
    width: '800%',
    height: '100%',
    position: 'absolute',
    top: 0,
    opacity: 0,
    zIndex: 1,
  },
  dateField__inputContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
