import {View, Text, Image, Dimensions} from 'react-native';
import React, { useState } from 'react';
import {styles} from './styles';
import {HEIGHT, TYPES} from '../../../../constants';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {icons} from '../../../../assets';
import Ripple from '../../../common/Ripple';

const UserProfileCard = ({
  about,
  firstName,
  age,
  statusText,
  interests,
  movementActive = true,
  dailyThoughts
}: TYPES.UserProfileCardProps) => {
  const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
  const SWIPE_DURATION = 200;
  const THRESHOLD_LEFT = -SCREEN_WIDTH * 0.2;
  const THRESHOLD_RIGHT = SCREEN_WIDTH * 0.2;
  const [isCardVisible, setIsCardVisible] = useState(true);

  const translateX = useSharedValue(0);
  const isSwipingOut = useSharedValue(false);
  const cardHeight = SCREEN_HEIGHT

  const panGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive: event => {
      if (movementActive && isCardVisible) {
        translateX.value = event.translationX;
      }
    },
    onEnd: () => {
      if (!movementActive && isCardVisible) {
        return;
      }

      const shouldBeDismissed_left = translateX.value < THRESHOLD_LEFT;
      const shouldBeDismissed_right = translateX.value > THRESHOLD_RIGHT;
      if (shouldBeDismissed_left) {
        translateX.value = withTiming(-SCREEN_WIDTH);
        isSwipingOut.value = true;
      } else if (shouldBeDismissed_right) {
        translateX.value = withTiming(SCREEN_WIDTH);
        isSwipingOut.value = true;
      } else {
        translateX.value = withSpring(0);
        isSwipingOut.value = false;
      }
    },
  });

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
    ],
  }));

  const animatedRightIconStyle = useAnimatedStyle(() => {
    const opacity = withTiming(translateX.value < THRESHOLD_LEFT ? 1 : 0, {
      duration: SWIPE_DURATION,
    });

    return {opacity};
  });

  const animatedLeftIconStyle = useAnimatedStyle(() => {
    const opacity = withTiming(translateX.value > THRESHOLD_RIGHT ? 1 : 0, {
      duration: SWIPE_DURATION,
    });

    return {opacity};
  });

  const animatedHeightToZero = useAnimatedStyle(() => {
    const maxHeight = withTiming(
      translateX.value === -SCREEN_WIDTH || translateX.value === SCREEN_WIDTH
        ? 0
        : cardHeight, {duration: 600}
    );
    const opacity = isSwipingOut.value ? withTiming(0) : 1;

    return {maxHeight, opacity};
  });

  const handleLayout = (event:any) => {
    const layout = event.nativeEvent.layout;
    const isVisible = ((layout.y + layout.height) <= (SCREEN_HEIGHT - HEIGHT.bottomTabBar));
    setIsCardVisible(isVisible);
  }
  


  return (
    <View  onLayout={handleLayout}>
    <Animated.View style={animatedHeightToZero} >
      <PanGestureHandler onGestureEvent={panGesture}>
        <Animated.View style={[animatedContainerStyle, styles.container]}>
          <View style={styles.profileInfoContainer}>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={styles.headerText}>
              {firstName}, {age}
            </Text>
            <Text style={styles.statusContainer_text}>{statusText}</Text>
            </View>
            <View style={styles.interestList}>
              {interests?.map((interest: string, index) => (
                <View style={styles.interestCard} key={index}>
                  <Text style={styles.interestCard_text}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>
            <Text style={styles.headerText}>About</Text>
            <Text
              style={styles.paragraphText}>
              {about}
            </Text>
            {dailyThoughts &&
          <View style={styles.additionInfoContainer}>
            <Text style={styles.headerText}>Thoughts of the day?</Text>
            <Text
              style={styles.paragraphText}>
             {dailyThoughts}
            </Text>
          </View>
}
        </Animated.View>
      </PanGestureHandler>
      <Animated.View style={[styles.icon, animatedRightIconStyle, {right: 0}]}>
        <Image source={icons.closeSquare} style={[styles.icon_image]} />
      </Animated.View>
      <Animated.View style={[styles.icon, animatedLeftIconStyle, {left: 0}]}>
        <Image source={icons.tickSquare} style={[styles.icon_image]} />
      </Animated.View>
    </Animated.View>
    </View>
  );
};

export default UserProfileCard;
