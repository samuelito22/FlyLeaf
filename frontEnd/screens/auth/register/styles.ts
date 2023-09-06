import {StyleSheet, Dimensions} from 'react-native';
import {verticalScale} from 'react-native-size-matters';
import {
  BORDER_RADIUS,
  THEME_COLORS,
  COMPONENT_COLORS,
  themeText,
  PALETTE,
} from '../../../constants';

const screenWidth = Dimensions.get('window').width;
const buttonWidth = ((screenWidth - 2 * 15 - 2 * 23) / 2) * 0.9;

export const styles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: verticalScale(40),
    maxWidth: 425,
    paddingHorizontal: 20,
    width: '100%',
  },
  alignNextButtonContainer: {
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-end',
    flexGrow: 1,
  },
  extraGenderModal_flexEnd: {
    flex: 1,
    backgroundColor: COMPONENT_COLORS.modalBackground,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  extraGenderModal_container: {
    maxWidth: 500,
    width: '100%',
    backgroundColor: 'white',
    maxHeight: 600,
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    alignItems: 'center',
  },
  extraGenderModal_content: {
    flexDirection: 'row',
  },

  // Button Styles
  nextButtonContainer: {
    height: 61.46,
    width: 316,
    marginVertical: 20,
  },
  clickableIndicatorPrimaryButton: {
    marginBottom: 28,
    backgroundColor: COMPONENT_COLORS.primaryIndicatorBackground,
    borderRadius: BORDER_RADIUS.medium,
  },
  galleryButtonContainer: {
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: PALETTE.LIGHT200,
    width: '50%',
    aspectRatio: 1,
    position: 'relative',
    overflow: 'hidden',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryButtonImage: {
    height: '50%',
    width: '50%',
    tintColor: PALETTE.GRAY500,
  },
  extraGenderModal_button: {
    height: 60,
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
  },

  // Text Styles
  requirement: {
    ...themeText.bodyMediumSix,
    color: PALETTE.GRAY300,
    textAlign: 'center',
  },
  title: {
    ...themeText.headingTwo,
    color: THEME_COLORS.dark,
    marginBottom: verticalScale(12),
    textAlign: 'center',
  },
  paragraph: {
    ...themeText.bodyRegularFive,
    color: THEME_COLORS.dark,
    marginBottom: verticalScale(17),
    textAlign: 'center',
  },
  extraInformation: {
    ...themeText.bodyRegularSeven,
    color: THEME_COLORS.tertiary,
    textAlign: 'center',
    marginBottom: 15,
  },
  clickableIndicatorPrimaryButton__extraContainer_text: {
    ...themeText.bodyRegularSix,
    color: PALETTE.INDIGO300,
  },
  skipContainerText: {
    ...themeText.bodyBoldFive,
    color: THEME_COLORS.dark,
  },
  extraGenderModal_button__text: {
    ...themeText.bodyRegularFour,
    color: THEME_COLORS.dark,
  },
  extraGenderModal_header: {
    ...themeText.bodyBoldTwo,
    color: THEME_COLORS.dark,
  },
  categoryTitle: {
    ...themeText.bodyMediumFive,
    color: THEME_COLORS.dark,
  },

  // Other Styles
  clickableIndicatorPrimaryButton__extraContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
  },
  clickableIndicatorPrimaryButton__extraContainer_image: {
    width: 20,
    height: 20,
    tintColor: PALETTE.INDIGO300,
  },
  galleryButtonsContainer: {
    flexDirection: 'row',
  },
  imageInGalleryButtonContainer: {
    position: 'absolute',
    zIndex: 2,
    height: '100%',
    width: '100%',
  },
  shadowContainer: {
    marginRight: 15,
  },
  skipContainer: {
    position: 'absolute',
    top: 30,
    right: 15,
  },
  extraIcon: {
    height: 100,
    marginVertical: 20,
  },
  extraGenderModal_button__icon: {
    height: 20,
    width: 20,
    marginRight: 20,
    transform: [
      {
        translateY: 5,
      },
    ],
  },
  extraScrollViewContainer: {
    width: 500,
    alignItems: 'center',
  },
});
