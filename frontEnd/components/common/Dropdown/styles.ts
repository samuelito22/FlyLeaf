import {StyleSheet} from 'react-native';
import {BORDER_RADIUS, COLORS, FONTS, themeText} from '../../../constants';

export const styles = StyleSheet.create({
  dropdown: {
    height: '100%',
    marginRight: 15,
  },
  dropdown__toggle: {
    borderBottomWidth: 1,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdown__toggle__value: {
    fontFamily: FONTS.rubikLight,
    fontSize: 20,
    color: COLORS.dark,
  },
  dropdown__item: {
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 0.2,
    borderColor: COLORS.gray,
    flexDirection: 'row',
  },
  dropdown__item__name: {
    fontFamily: FONTS.rubikLight,
    fontSize: 20,
    color: COLORS.dark,
    maxWidth: 300,
  },
  dropdown__item__code: {
    fontFamily: FONTS.rubikLight,
    fontSize: 20,
    color: COLORS.dark,
    minWidth: 50,
    marginLeft: 10,
  },
  dropdown__modal: {
    backgroundColor: '#fff',
    borderRadius: BORDER_RADIUS.medium,
    paddingHorizontal: 20,
    flex: 1,
  },
  dropdown__search: {
    borderBottomWidth: 1,
    borderColor: COLORS.dark,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dropdown__arrowDown: {
    width: 18,
    height: 18,
    marginLeft: 10,
  },
  dropdown__arrowLeft: {
    width: 20,
    height: 20,
    marginLeft: 20,
  },
  dropdown__textField: {
    marginLeft: 20,
    borderColor: 'transparent',
    color: COLORS.dark,
    flex: 1,
    height: 40,
    ...themeText.bodyRegularFour,
  },
});
