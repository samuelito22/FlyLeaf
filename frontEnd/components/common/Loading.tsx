import React, { useRef } from 'react';
import {View, ActivityIndicator, StyleSheet, Modal, Text, ViewStyle, Animated, Image} from 'react-native';
import {BORDER_RADIUS, COMPONENT_COLORS, THEME_COLORS, themeText} from '../../constants';
import { icons } from '../../assets';
import LinearGradient from 'react-native-linear-gradient';

export const LoadingSpinner = ({modalBackground}:{modalBackground?: ViewStyle}) => {
  return (
    <Modal transparent={true}>
      <View style={[styles.modalBackground, modalBackground]}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator animating={true} size={15} color={'white'} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    </Modal>
  );
};

export const ActiveIndicator = ({modalBackground}:{modalBackground?: ViewStyle}) => {
    return (
      <Modal transparent={true}>
        <View style={[styles.modalBackground, modalBackground]}>
            <ActivityIndicator animating={true} size={50} color={THEME_COLORS.dark} />
        </View>
      </Modal>
    );
  };

export const ThreeDotsLoader = ({ modalBackground }: { modalBackground?: ViewStyle }) => {
    const animation = useRef(new Animated.Value(0)).current;
  
    React.useEffect(() => {
      Animated.loop(
        Animated.timing(animation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        })
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
          <Animated.View style={[StyleSheet.absoluteFill, { left: leftPosition }]}>
            <LinearGradient
              colors={['transparent', 'rgba(255,255,255,0.5)', 'transparent']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>
      </Modal>
    );
  };

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: COMPONENT_COLORS.modalBackground,
  },
  activityIndicatorWrapper: {
    height: 50,
    width: 150,
    borderRadius: BORDER_RADIUS.medium,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    backgroundColor: 'black',
  },
  loadingText: {
    ...themeText.bodyMediumSix,
    color: 'white',
  },
  dots: {
      tintColor: THEME_COLORS.dark,
      width: 100,
      height: 30,
    },
});
