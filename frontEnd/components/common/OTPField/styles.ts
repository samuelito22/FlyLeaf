import {StyleSheet} from 'react-native';
import {BORDER_RADIUS, COLORS, themeText} from '../../../constants';

export const styles = StyleSheet.create({
  OTPField: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  OTPField__box: {
    height: 55,
    width: 44.23,
    marginHorizontal: 5,
    backgroundColor: COLORS.OTPBox,
    borderRadius: BORDER_RADIUS.medium,
  },
  OTPField__box__input: {
    ...themeText.headingOne,
    color: COLORS.dark,
    textAlign: 'center',
    marginTop: 5,
    height: '100%',
  },
  OTPField__hiddenBox: {
    width: '500%',
    height: '100%',
    position: 'absolute',
    top: 0,
    opacity: 0,
    zIndex: 1,
  },
  OTPField__container: {
    width: '100%',
    flexDirection: 'row',
  },
});
