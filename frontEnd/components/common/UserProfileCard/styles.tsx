import {StyleSheet} from 'react-native';
import {
  PALETTE,
  THEME_COLORS,
  themeText,
} from '../../../constants';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',
    flexDirection: 'column',
    borderBottomColor: PALETTE.GHOSTWHITE,
  },
  headerText: {
    ...themeText.bodyBoldOne,
    color: "white",
    paddingTop: 30,
  },
  headerText_age: {
    ...themeText.bodyRegularThree,
    color: "white",
  },
  buttonsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestCard: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    marginRight: 12,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  interestCard_text: {
    ...themeText.bodyRegularSeven,
    color: "white",
  },
  languagesCard: {
    borderColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginVertical: 5,
    flexDirection: 'row'
  },
  languagesCard_text: {
    ...themeText.bodyRegularSix,
    color: THEME_COLORS.dark,
    textAlignVertical:'center'
  },
  additionalInformationCard: {
    borderColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 7,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
    flexDirection: 'row'
  },
  additionalInformationCard_text: {
    ...themeText.bodyRegularSeven,
    color: THEME_COLORS.dark,
    textAlignVertical:'center'
  },
  additionalInformationCard_icon: {
    tintColor: THEME_COLORS.dark,
    resizeMode: "contain",
    width: 15,
    height: 15,
    alignSelf: "center",
    marginRight: 5
  },
  icon: {
    position: 'absolute',
    height: '100%',
    justifyContent: 'center',
  },
  icon_image: {
    width: 100,
    height: 100,
    tintColor: PALETTE.LIGHT100,
  },
  imageFullScreen: {
    width: '100%',
    height: '100%',
  },
  
  absolutePosition: {
    position: 'absolute',
  },

  bottomContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 20,
    marginHorizontal: 30,
    marginVertical: 10,
  },

  usernameContainer: {
    flexDirection: 'row',
    flex: 1,
  },

  verifiedIcon: {
    resizeMode: 'contain',
    alignSelf: 'center',
    flex: 0.3,
    aspectRatio: 1,
  },

  informationSection: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: PALETTE.LIGHT100,
    paddingVertical: 20,
    marginVertical: 20,
    paddingHorizontal: 10
  },

  informationTitle: {
    ...themeText.bodyMediumFour,
    color: THEME_COLORS.dark,
    marginBottom: 10,
  },

  bioText: {
    ...themeText.bodyRegularSix,
    color: PALETTE.GRAY500,
  },
  
});
