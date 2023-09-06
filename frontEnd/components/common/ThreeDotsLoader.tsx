import {
  StyleSheet,
  Image,
  View,
  ViewStyle,
  Modal,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React, {useRef} from 'react';
import {COMPONENT_COLORS, THEME_COLORS} from '../../constants';
import {icons} from '../../assets';

const ThreeDotsLoader = ({modalBackground}: {modalBackground?: ViewStyle}) => {
  const animation = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
    ).start();
  }, []);

  const leftPosition = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['-100%', '100%'],
  });

  return (
    <Modal transparent={true}>
      <View style={[styles.modalBackground, modalBackground]}>
        <Image source={icons.dots} style={styles.dots} resizeMode="contain" />
        <Animated.View style={[StyleSheet.absoluteFill, {left: leftPosition}]}>
          <LinearGradient
            colors={['transparent', 'rgba(255,255,255,0.5)', 'transparent']}
            start={{x: 0, y: 0.5}}
            end={{x: 1, y: 0.5}}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  dots: {
    tintColor: THEME_COLORS.dark,
    width: 100,
    height: 30,
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: COMPONENT_COLORS.modalBackground,
  },
});

export default ThreeDotsLoader;
