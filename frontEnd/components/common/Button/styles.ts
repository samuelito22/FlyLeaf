import {StyleSheet} from 'react-native';
import {
  THEME_COLORS,
  themeText,
  BORDER_RADIUS,
  PALETTE,
  COMPONENT_COLORS,
} from '../../../constants';

export const styles = StyleSheet.create({
  primaryButton: {
    width: '100%',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME_COLORS.primary,
    borderRadius: BORDER_RADIUS.medium,
    overflow: 'hidden',
  },
  interestButton: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.medium,
    overflow: 'hidden',
  },
  primaryButtonTextLight: {
    color: 'white',
    ...themeText.bodyBoldFive,
  },
  interestButtonText: {
    ...themeText.bodyRegularSix,
    paddingHorizontal: 10,
  },
  clickableButtonContainer: {
    width: '100%',
    minHeight: 63,
    paddingVertical: 10,
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: COMPONENT_COLORS.primaryIndicatorBorder,
    overflow: 'hidden',
  },
  clickableButtonText: {
    color: THEME_COLORS.dark,
    ...themeText.bodyRegularFour,
  },
  clickableButtonIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
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
    paddingRight: 30,
    paddingLeft: 30,
  },
  imageButtonContainer: {
    alignItems: 'center',
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
});
