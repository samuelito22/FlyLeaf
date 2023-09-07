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
  imageFull: {
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


  // Instagram Card Styles
  instagramContainer: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 15,
    flexDirection: 'column',
    padding: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: PALETTE.LIGHT100,
    marginHorizontal: 10,
  },
  instagramHeader: {
    flexDirection: 'row',
    maxWidth: 350,
    width: '100%',
    alignItems: 'center',
  },
  instagramIcon: {
    height: 30,
    width: 30,
    marginRight: 10,
  },
  instagramHeaderText: {
    ...themeText.bodyMediumFive,
    color: THEME_COLORS.dark,
  },
  instagramImageScrollContainer: {
    marginVertical: 10,
  },
  instagramImageContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: 60,
    marginRight: 15,
    overflow: 'hidden',
  },
  instagramImageBackground: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(1, 1, 1, 0.05)',
    borderRadius: 10,
    overflow: 'hidden',
  },

  // Spotify Card Styles
  spotifyContainer: {
    backgroundColor: 'black',
    borderRadius: 15,
    flex: 1,
    flexDirection: 'column',
    padding: 15,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  spotifyHeader: {
    flexDirection: 'row',
    maxWidth: 250,
    width: '100%',
    alignItems: 'center',
  },
  spotifyIcon: {
    height: 30,
    width: 30,
    marginRight: 10,
  },
  spotifyHeaderText: {
    ...themeText.bodyMediumFour,
    color: 'white',
  },
  spotifyArtistScrollContainer: {
    marginVertical: 10,
  },
  spotifyArtistContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: 60,
    marginRight: 15,
    overflow: 'hidden',
  },
  spotifyArtistImageBackground: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(128, 128, 128, 0.5)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  artistName: {
    color: 'white',
    ...themeText.bodyRegularSeven,
    textAlign: 'center',
    marginTop: 5,
  },
  
  darkButton: {
    marginBottom: 10,
    marginTop: 20,
    width: '95%',
    alignSelf: 'center',
  },
  lightButton: {
    marginVertical: 10,
    width: '95%',
    alignSelf: 'center',
  },

  relationshipText: {color: 'black',
  ...themeText.bodyMediumFive,
  alignSelf: 'center',
  marginTop: 10,
},
distanceText: { color: 'white',
...themeText.bodyRegularSix,
paddingVertical: 5,},
superlikeImage: { position: 'absolute',
bottom: 10,
right: 10,
width: 50,
height: 50,
borderRadius: 100,
backgroundColor: 'rgba(0,0,0,0.5)',},
modalContainer:{flex: 1, borderWidth: 1, backgroundColor: 'rgba(0,0,0,0.9)'},
modalImage: {flex: 1, resizeMode: 'contain'},
indicatorsContainer: {flexDirection: 'row',
position: 'absolute',
top: 10,
alignSelf: 'center',},
indicator: {width: '100%',
marginHorizontal: 2,
borderRadius: 20,height:5},
scrollView: {flexGrow: 1, width: '100%'}
});
