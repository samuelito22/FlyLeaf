import {StyleSheet} from 'react-native';
import {THEME_COLORS, themeText} from '../../../../constants';

export const styles = StyleSheet.create({
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'center',
  },
  separator__line: {
    width: '100%',
    height: 1,
    backgroundColor: THEME_COLORS.tertiary,
    position: 'absolute',
  },
  separator__text: {
    paddingHorizontal: 10,
    color: THEME_COLORS.tertiary,
    backgroundColor: 'white',
    ...themeText.bodyRegularFive,
  },
});
