import {StyleSheet} from 'react-native';
import {BORDER_RADIUS, COLORS, themeText} from '../../../../constants';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f7fb',
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginVertical: 8,
    borderRadius: BORDER_RADIUS.medium,
  },
  profileInfoContainer: {
    marginBottom: 13,
  },
  profileInfoContainer_header: {
    ...themeText.bodyBoldSix,
    color: COLORS.profileCardHeader,
  },
  aboutContainer: {},
  aboutContainer_header: {
    ...themeText.bodyBoldSix,
    color: COLORS.profileCardHeader,
  },
  aboutContainer_paragraph: {
    ...themeText.bodyRegularSeven,
    color: COLORS.profileCardParagraph,
  },
  profileImage: {
    width: 37,
    height: 51,
    marginBottom: 6,
  },
  /*
  profileHeaderContainer: {
    flexDirection: 'row',
    justifyContent: "space-between"
  },
  statusContainer: {
    flexDirection: "row"
  },
  */
  profileHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: 10,
    right: 20,
  },
  statusContainer: {
    flexDirection: 'row',
  },
  statusContainer_text: {
    ...themeText.bodyRegularSeven,
    color: COLORS.profileCardParagraph,
  },
  statusContainer_icon: {
    width: 24,
    height: 24,
    marginLeft: 8,
  },
  interestCard: {
    backgroundColor: COLORS.interestCard,
    borderRadius: BORDER_RADIUS.small,
    marginRight: 12,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  interestCard_text: {
    ...themeText.bodyRegularSeven,
    color: 'white',
  },
  interestList: {
    flexDirection: 'row',
    marginTop: 4,
  },
  icon: {
    position: 'absolute',
    height: '100%',
    justifyContent: 'center',
  },
  icon_image: {
    width: 50,
    height: 50,
    tintColor: COLORS.profileCardIcons,
  },
});
