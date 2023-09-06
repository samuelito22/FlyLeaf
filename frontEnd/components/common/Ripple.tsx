import React, {ReactNode} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {
  LongPressGestureHandler,
  LongPressGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  measure,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface RippleProps {
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  children?: ReactNode;
}

const Ripple: React.FC<RippleProps> = ({
  style,
  onPress,
  children,
  contentContainerStyle,
}) => {
  const centerX = useSharedValue(0);
  const centerY = useSharedValue(0);
  const scale = useSharedValue(0);

  const aRef = useAnimatedRef<View>();
  const width = useSharedValue(0);
  const height = useSharedValue(0);

  const rippleOpacity = useSharedValue(1);

  const isFinishedAnimation = useSharedValue(false);
  const isPressed = useSharedValue(false);

  const tapGestureEvent =
    useAnimatedGestureHandler<LongPressGestureHandlerGestureEvent>({
      onStart: tapEvent => {
        isFinishedAnimation.value = false;
        isPressed.value = true;
        const layout = measure(aRef);
        width.value = layout.width;
        height.value = layout.height;

        centerX.value = tapEvent.x;
        centerY.value = tapEvent.y;

        rippleOpacity.value = 1;
        scale.value = 0;
        scale.value = withTiming(1, {duration: 200}, completed => {
          if (completed) {
            isFinishedAnimation.value = true;
          }
        });
      },
      onEnd: event => {
        isPressed.value = false;
        if (event.duration < 500 && onPress) {
          runOnJS(onPress)();
        }
      },
      onCancel: () => {
        isPressed.value = false;
      },
    });

  const rStyle = useAnimatedStyle(() => {
    const circleRadius = Math.sqrt(width.value ** 2 + height.value ** 2);

    const translateX = centerX.value - circleRadius;
    const translateY = centerY.value - circleRadius;

    const opacity = withTiming(
      isFinishedAnimation.value && !isPressed.value ? 0 : 1,
      {duration: 200},
    );

    return {
      width: circleRadius * 2,
      height: circleRadius * 2,
      borderRadius: circleRadius,
      opacity: opacity,
      backgroundColor: 'rgba(0,0,0,0.2)',
      position: 'absolute',
      top: 0,
      left: 0,
      transform: [
        {translateX},
        {translateY},
        {
          scale: scale.value,
        },
      ],
    };
  });

  return (
    <View ref={aRef} collapsable={false}>
      <LongPressGestureHandler
        onGestureEvent={tapGestureEvent}
        minDurationMs={0}>
        <Animated.View style={[style, {overflow: 'hidden'}]}>
          {children}
          <Animated.View style={rStyle} />
        </Animated.View>
      </LongPressGestureHandler>
    </View>
  );
};

export default Ripple;
