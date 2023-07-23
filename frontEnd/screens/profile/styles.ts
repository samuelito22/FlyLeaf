import {StyleSheet} from 'react-native';
import {BORDER_RADIUS, PALETTE, THEME_COLORS, themeText} from '../../constants';

export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems:'center',
    maxWidth: 400,
    width: '100%',
    paddingHorizontal: 10,
  },
  profileCard:{
    position: 'relative',
    overflow:'visible',
    paddingBottom: 10
  },
  editIcon:{
    width:30,
    height: 30,
    position: 'absolute',
    right: 10,
    bottom: 0,
    backgroundColor:'transparent'
  },
  button:{
    marginHorizontal: 10,
    borderRadius: BORDER_RADIUS.extraLarge
  },
  text: {
    ...themeText.bodyBoldSix,
    paddingHorizontal: 8
  },
  icon: {
    width: 30,
    height: 30
  }
});
