import {StyleSheet} from 'react-native';
import {BORDER_RADIUS, THEME_COLORS, themeText} from '../../constants';

export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    maxWidth: 400,
    width: '100%',
    paddingTop: 90,
    paddingHorizontal: 10,
  },
  profileContainer: {
    borderRadius: BORDER_RADIUS.circle,
    overflow: 'hidden',
    borderColor: '#f3f5f7',
    borderWidth: 0.7,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME_COLORS.primary,
  },
  profileContainer_image: {
    width: 53,
    height: 53,
    tintColor: THEME_COLORS.secondary,
    backgroundColor: 'transparent',
  },
  header: {
    ...themeText.headingTwo,
    color: THEME_COLORS.dark,
  },
  basicInformation: {
    flexDirection: 'column',
  },
  basicInformationSection_text: {
    color: THEME_COLORS.tertiary,
    ...themeText.bodyRegularSeven,
  },
  basicInformationSection_icon: {
    tintColor: THEME_COLORS.tertiary,
    height: 15,
    width: 15,
    marginRight: 10,
  },
  basicInformationSection: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
  },
  informationSection: {
    marginVertical: 20,
    flexDirection: 'column',
  },
  informationSection_header: {
    ...themeText.headingThree,
    color: THEME_COLORS.dark,
  },
  informationSection_paragraph: {
    ...themeText.bodyRegularFive,
    color: THEME_COLORS.tertiary,
    marginVertical: 5,
  },
});
