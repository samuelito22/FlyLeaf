import {StyleSheet} from 'react-native';
import {BORDER_RADIUS, COLORS, themeText} from '../../../../constants';

export const styles = StyleSheet.create({
  bottomView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent black overlay
  },
  bottomView__modalView: {
    backgroundColor: 'white',
    width: '90%',
    borderRadius: BORDER_RADIUS.medium,
    margin: 20,
  },
  bottomView__modalView__buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    borderBottomWidth: 0.2,
    borderBottomColor: COLORS.gray,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  bottomView__modalView__textStyle: {
    color: COLORS.dark,
    ...themeText.bodyRegularFive,
    marginLeft: 15,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});
