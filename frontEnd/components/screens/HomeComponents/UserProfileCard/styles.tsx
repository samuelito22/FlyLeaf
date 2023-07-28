import {StyleSheet} from 'react-native';
import {
  BORDER_RADIUS,
  PALETTE,
  THEME_COLORS,
  themeText,
} from '../../../../constants';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',
    flexDirection: 'column',
    paddingHorizontal: 30,
    borderBottomColor: PALETTE.GHOSTWHITE,
    borderBottomWidth: 1,
    paddingVertical: 25,
  },
  profileInfoContainer: {
    marginBottom: 13,
  },
  headerText: {
    ...themeText.bodyBoldSix,
    color: THEME_COLORS.dark,
  },
  paragraphText: {
    ...themeText.bodyRegularSeven,
    color: THEME_COLORS.dark,
  },
  profileImage: {
    width: 37,
    height: 51,
    marginBottom: 6,
  },
  statusContainer: {
    flexDirection: 'row',
  },
  statusContainer_text: {
    ...themeText.bodyRegularSeven,
    color: THEME_COLORS.tertiary,
  },
  interestCard: {
    backgroundColor: PALETTE.LIGHT100,
    borderRadius: BORDER_RADIUS.small,
    marginRight: 12,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop:5
  },
  interestCard_text: {
    ...themeText.bodyRegularSeven,
    color: THEME_COLORS.dark,
  },
  interestList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  icon: {
    position: 'absolute',
    height: '100%',
    justifyContent: 'center',
  },
  icon_image: {
    width: 50,
    height: 50,
    tintColor: PALETTE.LIGHT100,
  },
  additionInfoContainer: {marginTop: 10},
});
