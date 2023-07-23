import {StyleSheet} from 'react-native';
import {
  HEIGHT,
  COMPONENT_COLORS,
  BORDER_RADIUS,
} from '../../../../constants';

export const styles = StyleSheet.create({
  container: {
    maxHeight: HEIGHT.homeHeader,
    height: "100%",
    width: '100%',
    borderBottomWidth: 0.5,
    borderBottomColor: COMPONENT_COLORS.headerBorder,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative',
    backgroundColor: 'white',
  },
  iconContainer: {
    width:80,
    height:"100%",
    alignItems: "center",
    justifyContent:'center',   
  },

});
