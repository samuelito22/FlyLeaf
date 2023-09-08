import {View, Text, Image, Dimensions, Modal} from 'react-native';
import React, {useState} from 'react';
import {styles} from './styles';
import {
  HEIGHT,
  PALETTE,
  THEME_COLORS,
  TYPES,
  themeText,
} from '../../../constants';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  ScrollView,
  State,
  TapGestureHandler,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {icons} from '../../../assets';
import {
  calculateDistanceInKm,
  calculateDistanceInMiles,
} from '../../../utils/distanceCalculator';
import {ButtonImage, DarkButton, LightButton} from '../Button';
import {useSelector} from 'react-redux';
import { getAge } from '../../../utils/getAge';

const UserProfileCard = ({
  userData,
  moveable,
}: {
  userData: TYPES.UserProfile;
  moveable: boolean;
}) => {
  const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
  const SWIPE_DURATION = 200;
  const THRESHOLD_LEFT = -SCREEN_WIDTH * 0.2;
  const THRESHOLD_RIGHT = SCREEN_WIDTH * 0.2;
  const [currentPictureIndex, setCurrentPictureIndex] = useState<number>(0);
  const TAP_AREA_WIDTH = SCREEN_WIDTH / 3;
  const [isVisible, setIsVisible] = useState(true);
  const touchStartTime = useSharedValue(0);
  const touchEndTime = useSharedValue(0);
  const TAP_DURATION_THRESHOLD = 150; // time in milliseconds
  const [modalVisible, setModalVisible] = useState(false);
  const [pictureToBeViewed, setPictureToBeViewed] = useState(
    userData.pictures[currentPictureIndex].url,
  );
  const translateX = useSharedValue(0);
  const isSwipingOut = useSharedValue(false);
  const cardHeight =
    SCREEN_HEIGHT - HEIGHT.bottomTabBar - HEIGHT.homeHeader - 10;
  const cardWidth = SCREEN_WIDTH * 0.95;
  const currentUserId =
    useSelector((state: TYPES.AppState) => state.usersReducer.currentUserId) ||
    null;
  const currentUser = useSelector((state: TYPES.AppState) =>
    currentUserId
      ? (state.usersReducer.byId[currentUserId] as TYPES.currentUserProfile)
      : null,
  );

  const panGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive: event => {
      if (moveable) translateX.value = event.translationX;
    },
    onEnd: () => {
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

  const onImageTap = (event: any) => {
    const x = event.nativeEvent.x;

    if (event.nativeEvent.state === State.BEGAN) {
      touchStartTime.value = new Date().getTime();
    }

    if (event.nativeEvent.state === State.END) {
      touchEndTime.value = new Date().getTime();

      const touchDuration = touchEndTime.value - touchStartTime.value;

      if (touchDuration < TAP_DURATION_THRESHOLD) {
        if (x < TAP_AREA_WIDTH && currentPictureIndex > 0) {
          // Tap on the left side of the image
          setCurrentPictureIndex(currentPictureIndex - 1);
        } else if (
          x > SCREEN_WIDTH - TAP_AREA_WIDTH &&
          currentPictureIndex < userData.pictures.length - 1
        ) {
          // Tap on the right side of the image
          setCurrentPictureIndex(currentPictureIndex + 1);
        } else {
          setPictureToBeViewed(userData.pictures[currentPictureIndex].url);
          setModalVisible(true);
        }
      }
    }
  };


  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
    ],
  }));

  const animatedLeftIconStyle = useAnimatedStyle(() => {
    const opacity = withTiming(translateX.value < THRESHOLD_LEFT ? 1 : 0, {
      duration: SWIPE_DURATION,
    });

    return {opacity, left: 10, transform: [{rotateZ: '-20deg'}]};
  });

  const animatedRightIconStyle = useAnimatedStyle(() => {
    const opacity = withTiming(translateX.value > THRESHOLD_RIGHT ? 1 : 0, {
      duration: SWIPE_DURATION,
    });

    return {opacity, right: 10, transform: [{rotateZ: '-20deg'}]};
  });

  const animatedHeightToZero = useAnimatedStyle(() => {
    const opacity = isSwipingOut.value ? withTiming(0) : 1;

    return { opacity};
  });

  useAnimatedReaction(
    () => {
      return animatedHeightToZero.opacity;  // We want to react to changes in opacity
    },
    (result) => {
      if (result === 0) {
        // If opacity has reached 0, then set isVisible to false
        setIsVisible(false);
      }
    }
  );

  if (!isVisible) {
    return null;  
}

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View
          style={styles.modalContainer}>
          <Image
            style={styles.modalImage}
            source={{uri: pictureToBeViewed}}
          />
        </View>
      </Modal>
      <View
        style={{position: 'absolute', alignSelf: 'center'}}>
        <Animated.View style={animatedHeightToZero}>
          <PanGestureHandler onGestureEvent={panGesture}>
            <Animated.View
              style={[
                animatedContainerStyle,
                styles.container,
                {
                  width: cardWidth,
                  height: cardHeight,
                  borderRadius: 10,
                  overflow: 'hidden',
                },
              ]}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollView}>
                <View style={{width: cardWidth, height: cardHeight}}>
                  <TapGestureHandler onHandlerStateChange={onImageTap}>
                    <Image
                      style={styles.imageFull}
                      resizeMode="cover"
                      source={{uri: userData.pictures[currentPictureIndex].url}}
                    />
                  </TapGestureHandler>
                  <ButtonImage
                    imgUrl={icons.nature}
                    contentContainerStyle={styles.superlikeImage}
                    tintColor={THEME_COLORS.primary}
                    width={25}
                    height={25}
                  />

                  <View
                    style={styles.indicatorsContainer}>
                    {userData.pictures.map((_, index) => (
                      <View
                        key={index}
                        style={{
                          ...styles.indicator,
                          maxWidth: (cardWidth - 20) / userData.pictures.length,
                          
                          backgroundColor:
                            currentPictureIndex === index
                              ? 'white'
                              : 'rgba(0,0,0,0.5)',
                        }}></View>
                    ))}
                  </View>

                  <View style={styles.bottomContainer}>
                    {userData.username && userData.dateOfBirth && (
                      <View style={styles.usernameContainer}>
                        <Text style={styles.headerText}>
                          {userData.username}{' '}
                          <Text style={styles.headerText_age}>
                            {' '}
                            {getAge(new Date(userData.dateOfBirth))}
                          </Text>
                        </Text>
                        {userData.verified && (
                          <Image
                            source={icons.verified}
                            style={styles.verifiedIcon}
                          />
                        )}
                      </View>
                    )}
                    <View style={{width: '90%'}}>
                      {userData.interests && (
                        <View style={styles.buttonsList}>
                          {userData.interests?.map((interest, index) => (
                            <View style={styles.interestCard} key={index}>
                              <Text style={styles.interestCard_text}>
                                {interest.name}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}
                      {userData.location.coordinates && currentUser && (
                        <Text
                          style={styles.distanceText}>
                          {currentUser.settings.distanceInKm
                            ? Math.round(
                                calculateDistanceInKm(
                                  currentUser.location.coordinates,
                                  userData.location.coordinates,
                                ),
                              )
                            : Math.round(
                                calculateDistanceInMiles(
                                  currentUser.location.coordinates,
                                  userData.location.coordinates,
                                ),
                              )}{' '}
                          {currentUser.settings.distanceInKm
                            ? `kilometers`
                            : `miles`}{' '}
                          away
                          {userData.location.city &&
                            `, ${userData.location.city}`}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>

                {userData.relationshipGoal && (
                  <Text
                    style={styles.relationshipText}>
                    Looking for a {userData.relationshipGoal}
                  </Text>
                )}
                {userData.bio && (
                  <View style={[styles.informationSection, {width: cardWidth}]}>
                    <Text style={styles.informationTitle}>My story</Text>
                    <Text style={styles.bioText}>{userData?.bio}</Text>
                  </View>
                )}
                {userData.additionalInformation && (
                  <View style={[styles.informationSection, {width: cardWidth}]}>
                    <Text style={styles.informationTitle}>
                      Basic information
                    </Text>
                    <View style={[styles.buttonsList]}>
                    {userData.height &&

                      <View style={styles.additionalInformationCard}>
                        <Image
                          source={icons.measuringTape}
                          style={styles.additionalInformationCard_icon}
                        />
                        <Text style={styles.additionalInformationCard_text}>
                          {userData.height?.feets} foot
                          {userData.height?.inches != '0' &&
                            ` ${userData.height?.inches}`}
                        </Text>
                      </View>
}
                      <View style={styles.additionalInformationCard}>
                        <Image
                          source={icons.gender}
                          style={styles.additionalInformationCard_icon}
                        />
                        <Text style={styles.additionalInformationCard_text}>
                          {userData.gender.primary}
                          {userData.gender.secondary &&
                            ` (${userData.gender.secondary})`}
                        </Text>
                      </View>
                      {userData.profession?.jobTitle &&
                      <View style={styles.additionalInformationCard}>
                        <Image
                          source={{uri: 'https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/job.png'}}
                          style={styles.additionalInformationCard_icon}
                        />
                        <Text style={styles.additionalInformationCard_text}>
                          {userData.profession?.jobTitle}
                        </Text>
                      </View>
}
{userData.profession?.employer &&

                      <View style={styles.additionalInformationCard}>
                        <Image
                          source={{uri: 'https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/company.png'}}
                          style={styles.additionalInformationCard_icon}
                        />
                        <Text style={styles.additionalInformationCard_text}>
                        {userData.profession?.employer}

                        </Text>
                      </View>
}
                      {userData.additionalInformation
                        ?.filter(item => item.questionType === 'Basic')
                        .map((field, index) => (
                          <View
                            style={styles.additionalInformationCard}
                            key={index}>
                            <Image
                              source={{uri: field.questionIcon}}
                              style={styles.additionalInformationCard_icon}
                            />
                            <Text style={styles.additionalInformationCard_text}>
                              {field.answer}
                            </Text>
                          </View>
                        ))}
                    </View>
                  </View>
                )}
                {userData.languages?.length && (
                  <View style={[styles.informationSection, {width: cardWidth}]}>
                    <Text style={styles.informationTitle}>
                      Languages I know
                    </Text>
                    <View style={[styles.buttonsList]}>
                      {userData.languages.map((language, index) => (
                        <View style={styles.languagesCard} key={index}>
                          <Text style={styles.languagesCard_text}>
                            {language.name}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
                {userData.spotify && (
                  <View
                    style={styles.spotifyContainer}>
                    <View
                      style={styles.spotifyHeader}>
                      <Image
                        source={icons.spotify}
                        style={styles.spotifyIcon}
                        resizeMode="contain"
                      />
                      <Text
                        style={styles.spotifyHeaderText}>
                        Spotify - My top artists
                      </Text>
                    </View>

                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.spotifyArtistScrollContainer}>
                      {userData.spotify?.map((artist: any, index: number) => {
                        return (
                          <View
                            key={index}
                            style={styles.spotifyArtistContainer}>
                            <View
                              style={styles.spotifyArtistImageBackground}>
                              {artist && (
                                <Image
                                  source={{uri: artist.images[2].url}}
                                  style={styles.imageFull}
                                  resizeMode="cover"
                                />
                              )}
                            </View>
                            {artist && (
                              <Text
                                style={styles.artistName}>
                                {artist.name}
                              </Text>
                            )}
                          </View>
                        );
                      })}
                    </ScrollView>
                  </View>
                )}

                {userData.additionalInformation && (
                  <View style={[styles.informationSection, {width: cardWidth}]}>
                    <Text style={styles.informationTitle}>
                      Additional information
                    </Text>
                    <View style={[styles.buttonsList]}>
                      {userData.additionalInformation
                        ?.filter(item => item.questionType === 'Advanced')
                        .map((field, index) => (
                          <View
                            style={styles.additionalInformationCard}
                            key={index}>
                            <Image
                              source={{uri: field.questionIcon}}
                              style={styles.additionalInformationCard_icon}
                            />
                            <Text style={styles.additionalInformationCard_text}>
                              {field.answer}
                            </Text>
                          </View>
                        ))}
                    </View>
                  </View>
                )}
                {userData.instagram && (
                  <View
                    style={styles.instagramContainer}>
                    <View
                      style={styles.instagramHeader}>
                      <Image
                        source={icons.instagram}
                        style={styles.instagramIcon}
                        resizeMode="contain"
                      />
                      <Text
                        style={styles.instagramHeaderText}>
                        Instagram: My recent pictures
                      </Text>
                    </View>

                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.instagramImageScrollContainer}>
                      {userData.instagram.map((image: any, index: number) => {
                        return (
                          <View
                            key={index}
                            style={styles.instagramImageContainer}>
                            <TouchableWithoutFeedback
                              onPress={() => {
                                setPictureToBeViewed(image.url);
                                setModalVisible(true);
                              }}
                              style={styles.instagramImageBackground}>
                              {image && (
                                <Image
                                  source={{uri: image.url}}
                                  style={styles.imageFull}
                                  resizeMode="cover"
                                />
                              )}
                            </TouchableWithoutFeedback>
                          </View>
                        );
                      })}
                    </ScrollView>
                  </View>
                )}
                <DarkButton
                  style={styles.darkButton}>
                  Block
                </DarkButton>

                <LightButton
                  style={styles.lightButton}>
                  Report
                </LightButton>
              </ScrollView>
            </Animated.View>
          </PanGestureHandler>

          <Animated.View
            style={[
              styles.icon,
              animatedRightIconStyle,
              
            ]}>
            <Image
              source={icons.yeah}
              style={styles.icon_image}
              tintColor={PALETTE.GREEN300}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.icon,
              animatedLeftIconStyle,
              
            ]}>
            <Image
              source={icons.bye}
              style={styles.icon_image}
              tintColor={PALETTE.RED500}
            />
          </Animated.View>
        </Animated.View>
      </View>
    </>
  );
};

export default UserProfileCard;
