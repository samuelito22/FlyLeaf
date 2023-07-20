import {StyleSheet} from 'react-native';
import {verticalScale} from 'react-native-size-matters';
import {PALETTE, THEME_COLORS, themeText} from '../../../constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: verticalScale(75),
    width: '100%',
  },
  maxWidth_login: {
    maxWidth: 323,
  },
  maxWidth_otp: {
    maxWidth: 354,
  },
  title: {
    ...themeText.headingOne,
    color: THEME_COLORS.dark,
    marginBottom: verticalScale(12),
  },
  paragraph: {
    ...themeText.bodyRegularFour,
    color: THEME_COLORS.dark,
  },
  paragraph_marginBottom_login: {
    marginBottom: verticalScale(17),
  },
  paragraph_marginBottom_otp: {
    marginBottom: verticalScale(52),
  },
  resendInfo: {
    marginTop: verticalScale(12),
    ...themeText.bodyRegularSix,
    color: THEME_COLORS.tertiary,
  },
  toggleContainer: {
    flexDirection: 'column',
    width: '100%',
    height: 64,
    marginBottom: verticalScale(17),
  },
  toggleContainer_swapButton: {
    width: 37.08,
    height: 37.08,
    position: 'absolute',
    top: -10,
    right: 0,
  },
  inputBox: {
    marginBottom: verticalScale(32),
    flexDirection: 'row',
  },
  signInButton: {
    marginBottom: verticalScale(88),
  },
  separator: {
    marginBottom: verticalScale(28),
  },
  socialButtonsContainer: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  socialButton: {
    width: 301.54,
    height: 51,
    marginBottom: 18,
  },
  error: {
    color: PALETTE.RED500,
    ...themeText.bodyRegularSix,
    marginTop: 12,
    marginBottom: 12,
  },
});
