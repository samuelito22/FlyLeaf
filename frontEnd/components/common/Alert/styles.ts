import {StyleSheet} from 'react-native';
import {BORDER_RADIUS, COMPONENT_COLORS, THEME_COLORS, themeText} from '../../../constants';

export const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COMPONENT_COLORS.modalBackground, // semi-transparent black overlay
  },
  centeredView__modalView: {
    margin: 20,
    backgroundColor: 'white',
    padding: 25,
    width: '90%',
    maxWidth: 400,
    borderRadius: BORDER_RADIUS.small,
  },
  centeredView__modalView__button: {
    marginLeft: 20,
  },
  centeredView__modalView__buttonContainer: {
    flexDirection: 'row',
    marginTop: 35,
    justifyContent: 'flex-end',
  },
  centeredView__modalView__title: {
    marginBottom: 15,
    ...themeText.headingTwo,
    color: THEME_COLORS.dark,
  },
  centeredView__modalView__message: {
    ...themeText.bodyRegularFive,
    color: THEME_COLORS.dark,
  },
  centeredView__modalView__textStyle: {
    color: THEME_COLORS.primary,
    textAlign: 'center',
    ...themeText.bodyBoldFive,
  },
});
