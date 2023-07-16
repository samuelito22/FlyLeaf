import {StyleSheet} from 'react-native';
import {COLORS, themeText, BORDER_RADIUS} from '../../../constants';

export const styles = StyleSheet.create({
  primaryButton: {
    width: '100%',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.medium,
  },
  interestButton: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.medium,
    padding: 10,
    borderColor: COLORS.lightGray
  },
  primaryButtonTextLight: {
    color: 'white',
    ...themeText.bodyBoldFive,
  },
  interestButtonText: {
    color: COLORS.dark,
    ...themeText.bodyBoldFive,
  },
  clickableButtonContainer: {
    width: '100%',
    minHeight: 63,
    paddingVertical: 10,
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: COLORS.primaryIndicatorBorder,
  },
  clickableButtonText: {
    color: COLORS.dark,
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
    paddingLeft: 30
  },
  imageButtonContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
  },
  imageButton: {
    width: '100%',
    height: '100%',
  },
});
