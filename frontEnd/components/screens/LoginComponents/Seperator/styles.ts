import {StyleSheet} from 'react-native';
import {COLORS, themeText} from '../../../../constants';

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
    backgroundColor: COLORS.gray,
    position: 'absolute',
  },
  separator__text: {
    paddingHorizontal: 10,
    color: COLORS.gray,
    backgroundColor: 'white',
    ...themeText.bodyRegularFive,
  },
});
