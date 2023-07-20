import {View, Animated, SafeAreaView} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {THEME_COLORS, TYPES} from '../../../../constants';
import {styles} from './styles';

const ProgressBar: React.FC<TYPES.ProgressBarProps> = ({
  height,
  color,
  transparency,
  progress,
  ...props
}) => {
  const overlappingColour = color;
  let newColor = THEME_COLORS.tertiary;

  const hexToRGBA = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    if (alpha < 0 || alpha > 1) {
      console.log(
        'Transparency must be in a range of (0,1); Transparency set to its default: 0.5',
      );
      return `rgba(${r}, ${g}, ${b}, 0.5)`;
    } else {
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
  };

  const hexRegex = /^#?([0-9A-Fa-f]{6})$/;
  if (hexRegex.test('#FF0000')) {
    if (!transparency) {
      newColor = hexToRGBA(newColor, 0.5);
    } else {
      newColor = hexToRGBA(newColor, transparency);
    }
  }

  const progressAnim = useRef(
    new Animated.Value(progress !== undefined ? progress : 0),
  ).current;

  useEffect(() => {
    if (progress !== undefined) {
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [progress]);

  const width = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={{...styles.safeArea}}>
      <View
        style={[
          styles.progressBar,
          {height: height, backgroundColor: newColor, ...props},
        ]}>
        <Animated.View
          style={[
            styles.progressBar__bar,
            {
              transform: [{scaleX: width}],
              backgroundColor: overlappingColour,
            },
          ]}></Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default ProgressBar;
