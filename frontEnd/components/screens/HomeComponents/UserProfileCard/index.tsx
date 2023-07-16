import {View, Text, Image, Dimensions} from 'react-native';
import React from 'react';
import {styles} from './styles';
import {COLORS, HEIGHT, TYPES} from '../../../../constants';
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

const UserProfileCard = ({
  about,
  firstName,
  age,
  city,
  profileImage,
  statusText,
  statusIcon,
  interests,
}: TYPES.UserProfileCardProps) => {
  const defaultAbout =
    "This user hasn't added a bio yet, but feel free to explore their profile to get to know them better!";

  const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
  const SWIPE_DURATION = 200;
  const THRESHOLD_LEFT = -SCREEN_WIDTH * 0.2;
  const THRESHOLD_RIGHT = SCREEN_WIDTH * 0.2;

  const translateX = useSharedValue(0);
  const cardHeight = useSharedValue(
    (SCREEN_HEIGHT - HEIGHT.bottomTabBar - HEIGHT.homeHeader) / 3,
  );
  const opacity = useSharedValue(1);

  const panGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive: event => {
      translateX.value = event.translationX;
    },
    onEnd: () => {
      const shouldBeDismissed_left = translateX.value < THRESHOLD_LEFT;
      const shouldBeDismissed_right = translateX.value > THRESHOLD_RIGHT;
      if (shouldBeDismissed_left) {
        translateX.value = withTiming(-SCREEN_WIDTH);
        opacity.value = withTiming(0);
        cardHeight.value = withTiming(0);
      } else if (shouldBeDismissed_right) {
        translateX.value = withTiming(SCREEN_WIDTH);
        opacity.value = withTiming(0);
        cardHeight.value = withTiming(0);
      } else {
        translateX.value = withSpring(0);
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

  const animatedCompleteContainerStyle = useAnimatedStyle(() => ({
    height: cardHeight.value,
    opacity: opacity.value,
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

  return (
    <Animated.View style={animatedCompleteContainerStyle}>
      <PanGestureHandler onGestureEvent={panGesture}>
        <Animated.View style={[animatedContainerStyle, styles.container]}>
          {/*
        <View style={styles.profileHeaderContainer}>
        <Image source={profileImage} style={styles.profileImage} resizeMode='contain'/>
        <View style={styles.statusContainer}>
            <Text style={styles.statusContainer_text}>{statusText}</Text>
            <Image source={statusIcon} style={styles.statusContainer_icon} resizeMode='contain'/>
        </View>
        </View>
  */}
          <View style={styles.profileInfoContainer}>
            <Text style={styles.profileInfoContainer_header}>
              {firstName}, {age}, {city}
            </Text>
            <View style={styles.interestList}>
              {interests?.map((interest: string, index) => (
                <View style={styles.interestCard} key={index}>
                  <Text style={styles.interestCard_text}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.aboutContainer}>
            <Text style={styles.aboutContainer_header}>About</Text>
            <Text
              style={styles.aboutContainer_paragraph}
              numberOfLines={3}
              ellipsizeMode="tail">
              {about ? about : defaultAbout}
            </Text>
          </View>
          <View style={styles.profileHeaderContainer}>
            <View style={styles.statusContainer}>
              <Text style={styles.statusContainer_text}>{statusText}</Text>
            </View>
          </View>
        </Animated.View>
      </PanGestureHandler>
      <Animated.View style={[styles.icon, animatedRightIconStyle, {right: 0}]}>
        <Image
          source={icons.closeSquare}
          style={[styles.icon_image, {tintColor: COLORS.errorLight}]}
        />
      </Animated.View>
      <Animated.View style={[styles.icon, animatedLeftIconStyle, {left: 0}]}>
        <Image
          source={icons.tickSquare}
          style={[styles.icon_image, {tintColor: COLORS.successLight}]}
        />
      </Animated.View>
    </Animated.View>
  );
};

export default UserProfileCard;
