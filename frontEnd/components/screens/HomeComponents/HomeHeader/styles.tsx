import {StyleSheet} from 'react-native';
import {BORDER_RADIUS, COLORS, HEIGHT} from '../../../../constants';

export const styles = StyleSheet.create({
  container: {
    height: HEIGHT.homeHeader,
    width: '100%',
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.HeaderBorder,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 20,
    position: 'relative',
    backgroundColor: 'white',
  },
  category: {
    width: 24,
    height: 24,
    tintColor: COLORS.dark,
  },
  profileContainer: {
    borderRadius: BORDER_RADIUS.circle,
    overflow: 'hidden',
    borderColor: '#f3f5f7',
    borderWidth: 0.7,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  profile: {
    width: 20,
    height: 20,
    tintColor: COLORS.dark,
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
    tintColor: COLORS.primary,
  },
});
