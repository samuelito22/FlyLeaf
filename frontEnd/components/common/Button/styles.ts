import {StyleSheet} from 'react-native';
import {
  THEME_COLORS,
  themeText,
  BORDER_RADIUS,
  PALETTE,
  COMPONENT_COLORS,
} from '../../../constants';

export const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.medium,
    overflow: 'hidden',
  },
  customizableButton: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.medium,
    overflow: 'hidden',
  },
  interestButton: {
    minHeight: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.medium,
    overflow: 'hidden',
  },
  buttonTextLight: {
    color: PALETTE.WHITE,
    ...themeText.bodyBoldFive,
  },
  buttonTextDark: {
    color: THEME_COLORS.dark,
    ...themeText.bodyBoldFive,
  },
  interestButtonText: {
    ...themeText.bodyRegularSix,
    alignSelf: 'center',
  },
  clickableButtonContainer: {
    width: '100%',
    minHeight: 63,
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: COMPONENT_COLORS.primaryIndicatorBorder,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
  },

  clickableButtonText: {
    color: THEME_COLORS.dark,
    ...themeText.bodyRegularFour,
  },
  clickableButtonIndicator: {
    width: 25,
    height: 25,
    borderRadius: BORDER_RADIUS.circle,
    backgroundColor: 'white',
  },
  clickableButtonIndicatorImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flex: 1,
    paddingLeft: 30,
    justifyContent: 'center',
  },
  imageButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  imageButton: {
    width: '100%',
    height: '100%',
  },
  fullCenterContainer: {
    position: 'absolute',
    zIndex: 99,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeInterestButton: {borderColor: THEME_COLORS.primary},
  inactiveInterestButton: {borderColor: PALETTE.GRAY300},
  activeInterestButtonText: {color: THEME_COLORS.dark},
  inactiveInterestButtonText: {color: THEME_COLORS.tertiary},
  indicatorActive: {borderColor: 'none', borderWidth: 0},
  indicatorInactive: {
    borderColor: COMPONENT_COLORS.primaryIndicatorBorder,
    borderWidth: 1,
  },
  absoluteFill: {flex: 1},
  iconStyle: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginLeft: 6,
  },
});
