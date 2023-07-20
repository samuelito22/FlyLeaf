import {StyleSheet} from 'react-native';
import {
  BORDER_RADIUS,
  THEME_COLORS,
  HEIGHT,
  COMPONENT_COLORS,
} from '../../../../constants';

export const styles = StyleSheet.create({
  container: {
    height: HEIGHT.homeHeader,
    width: '100%',
    borderBottomWidth: 0.5,
    borderBottomColor: COMPONENT_COLORS.headerBorder,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 20,
    position: 'relative',
    backgroundColor: 'white',
  },
  category: {
    width: 30,
    height: 30,
    tintColor: THEME_COLORS.dark,
  },
  sidebar: {
    width: 30,
    height: 30,
    backgroundColor: 'transparent',
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
});
