import {StyleSheet} from 'react-native';
import {
  BORDER_RADIUS,
  THEME_COLORS,
  HEIGHT,
  COMPONENT_COLORS,
  themeText,
} from '../../../constants';

export const styles = StyleSheet.create({
  container: {
    maxHeight: HEIGHT.homeHeader,
    height: "100%",
    width: '100%',
    borderBottomColor: COMPONENT_COLORS.headerBorder,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative',
    backgroundColor: 'white',
  },
  logoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 24,
    height: 24,
    tintColor: THEME_COLORS.primary,
  },
  iconContainer: {
    width:70,
    height:"100%",
    alignItems: "center",
    justifyContent:'center',
      
  },
  iconText: {
    color: THEME_COLORS.dark,
    ...themeText.bodyMediumFour,
    marginLeft:5,
    transform:[
      {translateY: 2}
    ]

  }
});
