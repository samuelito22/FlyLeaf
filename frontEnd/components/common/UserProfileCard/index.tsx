import {View, Text, Image, Dimensions, Modal} from 'react-native';
import React, {useState} from 'react';
import {styles} from './styles';
import {HEIGHT, PALETTE, THEME_COLORS, TYPES, themeText} from '../../../constants';
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
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {icons} from '../../../assets';
import { calculateDistanceInMiles } from '../../../utils/distanceCalculator';
import { ButtonImage, DarkButton, LightButton } from '../Button';
import { useSelector } from 'react-redux';

const UserProfileCard = ({userData, moveable}: {userData: TYPES.UserProfile , moveable:boolean}) => {
  function getAge(dateOfBirth: Date) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // If birth month hasn't occurred this year yet, or if it's the birth month but the day hasn't come yet
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
  const SWIPE_DURATION = 200;
  const THRESHOLD_LEFT = -SCREEN_WIDTH * 0.2;
  const THRESHOLD_RIGHT = SCREEN_WIDTH * 0.2;
  const [isCardVisible, setIsCardVisible] = useState(true);
  const [currentPictureIndex, setCurrentPictureIndex] = useState<number>(0);

  const translateX = useSharedValue(0);
  const isSwipingOut = useSharedValue(false);
  const cardHeight = SCREEN_HEIGHT - HEIGHT.bottomTabBar - HEIGHT.homeHeader - 10;
  const cardWidth = SCREEN_WIDTH * 0.95;

  const currentUserId = useSelector(
    (state: TYPES.AppState) => state.usersReducer.currentUserId,
  ) || null
  
  const currentUser = useSelector((state: TYPES.AppState) => 
    currentUserId ? state.usersReducer.byId[currentUserId] : null
);


  const panGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive: event => {
      if(moveable)
      translateX.value = event.translationX;
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
        : cardHeight,
      {duration: 600},
    );
    const opacity = isSwipingOut.value ? withTiming(0) : 1;

    return {maxHeight, opacity};
  });

  const handleLayout = (event: any) => {
    const layout = event.nativeEvent.layout;
    const isVisible =
      layout.y + layout.height <= SCREEN_HEIGHT - HEIGHT.bottomTabBar;
    setIsCardVisible(isVisible);
  };

  const userLocation = {longitude: 7, latitude: 6}

  const TAP_AREA_WIDTH = SCREEN_WIDTH / 3;

  const touchStartTime = useSharedValue(0);
const touchEndTime = useSharedValue(0);
const TAP_DURATION_THRESHOLD = 150;  // time in milliseconds
const [modalVisible, setModalVisible] = useState(false);
const [pictureToBeViewed, setPictureToBeViewed] = useState(userData.pictures[currentPictureIndex].url)

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
      } else if (x > SCREEN_WIDTH - TAP_AREA_WIDTH && currentPictureIndex < userData.pictures.length - 1) {
        // Tap on the right side of the image
        setCurrentPictureIndex(currentPictureIndex + 1);
      } else {
        setPictureToBeViewed(userData.pictures[currentPictureIndex].url)
        setModalVisible(true);
      }
    }
  }
};
  

  return (
    <>
      <Modal
    animationType="fade"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => {
      setModalVisible(!modalVisible);
    }}
  >
    <View style={{ flex: 1, borderWidth: 1 , backgroundColor: "rgba(0,0,0,0.9)",}}>
      <Image style={{ flex:1, resizeMode: 'contain' }} source={{ uri: pictureToBeViewed}} />
    </View>
  </Modal>
    <View onLayout={handleLayout} style={{position:'absolute', alignSelf:'center'}}>
      <Animated.View style={animatedHeightToZero}>
        <PanGestureHandler onGestureEvent={panGesture}>
          <Animated.View style={[animatedContainerStyle, styles.container, {
                width: cardWidth, height: cardHeight,
                borderRadius: 10, overflow: "hidden"}]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow: 1, width:"100%"}}>
              <View style={{width: cardWidth, height: cardHeight,}}>
              <TapGestureHandler onHandlerStateChange={onImageTap}>
  <Image style={styles.imageFullScreen} resizeMode="cover" source={{uri: userData.pictures[currentPictureIndex].url}} />
</TapGestureHandler>
<ButtonImage imgUrl={icons.nature} contentContainerStyle={{position:'absolute', bottom: 10, right: 10, width: 50, height: 50, borderRadius: 100, backgroundColor:"rgba(0,0,0,0.5)"}} tintColor={THEME_COLORS.primary} width={25} height={25}/>

                <View style={{flexDirection:'row', position:'absolute', top: 10, alignSelf:'center'}}>
                  {userData.pictures.map((_, index) => (
                    <View key={index} style={{maxWidth: (cardWidth - 20)  / userData.pictures.length,width:"100%", marginHorizontal:2, borderRadius:20, backgroundColor:currentPictureIndex === index ? "white" : 'rgba(0,0,0,0.5)' , height: 5}}></View>
                  )) }
                </View>
             
                <View style={styles.bottomContainer}>
                  {userData.username && userData.dateOfBirth &&
                    <View style={styles.usernameContainer}>
                      <Text style={styles.headerText}>
                        {userData.username}{' '}
                        <Text style={styles.headerText_age}>
                          {' '}{getAge(new Date(userData.dateOfBirth))}
                        </Text>
                      </Text>
                      {userData.verified && <Image source={icons.verified} style={styles.verifiedIcon}/>}
                    </View>
}
<View style={{width: "90%"}}>
                    {userData.interests &&
                    <View style={styles.buttonsList}>
                      {userData.interests?.map((interest, index) => (
                        <View style={styles.interestCard} key={index}>
                          <Text style={styles.interestCard_text}>{interest.name}</Text>
                        </View>
                      ))}
                    </View>
}
                    {userData.location.coordinates && currentUser &&   <Text style={{color: "white", ...themeText.bodyRegularSix, paddingVertical: 5}}>{Math.round(calculateDistanceInMiles(currentUser.location.coordinates, userData.location.coordinates))} miles away{userData.location.city && `, ${userData.location.city}`}</Text>}
                    </View>

                </View>

                
                
              </View>


         {userData.relationshipGoal &&     <Text style={{color: "black",...themeText.bodyMediumFive, alignSelf:'center', marginTop: 10}}>Looking for a {userData.relationshipGoal}</Text>}
{userData.bio &&
              <View style={[styles.informationSection, {    width: cardWidth,
}]}>
                <Text style={styles.informationTitle}>About me</Text>
                <Text style={styles.bioText}>{userData?.bio}</Text>
              </View>}
              {userData.additionalInformation &&

              <View style={[styles.informationSection, {    width: cardWidth,
}]}>
                <Text style={styles.informationTitle}>Basic information</Text>
                <View style={[styles.buttonsList]}>
                <View style={styles.additionalInformationCard}>
                      <Image source={icons.measuringTape} style={styles.additionalInformationCard_icon}/>
                      <Text style={styles.additionalInformationCard_text}>
                        {userData.height?.feets} foot{userData.height?.inches != "0" && ` ${userData.height?.inches}`}
                      </Text>
                    </View>
                    <View style={styles.additionalInformationCard}>
                      <Image source={icons.gender} style={styles.additionalInformationCard_icon}/>
                      <Text style={styles.additionalInformationCard_text}>
                        {userData.gender.primary}{userData.gender.secondary && ` (${userData.gender.secondary})`}
                      </Text>
                    </View>
                  {userData.additionalInformation?.filter(item => item.questionType === "Basic").map((field, index) => (
                    <View style={styles.additionalInformationCard} key={index} >
                      <Image source={{uri:field.questionIcon}} style={styles.additionalInformationCard_icon}/>
                      <Text style={styles.additionalInformationCard_text}>
                        {field.answer}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
}
{userData.languages &&
              <View style={[styles.informationSection, {    width: cardWidth,
}]}>
                <Text style={styles.informationTitle}>Languages I know</Text>
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
}
{userData.spotify &&
              <View
        style={{
          backgroundColor: 'black',
          borderRadius: 15,
          flex:1,
          flexDirection: 'column',
          padding: 15,
          overflow: 'hidden',
          marginHorizontal: 10

        }}>
        <View
          style={{
            flexDirection: 'row',
            maxWidth: 250,
            width: '100%',
            alignItems: 'center',
          }}>
          <Image
            source={icons.spotify}
            style={{height: 30, width: 30, marginRight: 10}}
            resizeMode="contain"
          />
          <Text style={{...themeText.bodyMediumFour, color: 'white'}}>
          Spotify - My top artists
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{marginVertical: 10}}>
          {userData.spotify?.map((artist: any, index: number) => {
            return (
              <View
                key={index}
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: 60,
                  marginRight: 15,
                  overflow: 'hidden',
                }}>
                <View
                  style={{
                    width: 60,
                    height: 60,
                    backgroundColor: 'rgba(128, 128, 128, 0.5)',
                    borderRadius: 10,
                    overflow: 'hidden',
                  }}>
                  {artist && (
                    <Image
                      source={{uri: artist.images[2].url}}
                      style={{width: '100%', height: '100%'}}
                      resizeMode="cover"
                    />
                  )}
                </View>
                {artist && (
                  <Text
                    style={{
                      color: 'white',
                      ...themeText.bodyRegularSeven,
                      textAlign: 'center',
                      marginTop: 5,
                    }}>
                    {artist.name}
                  </Text>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
}
              
{userData.additionalInformation &&
              <View style={[styles.informationSection, {    width: cardWidth,
}]}>
                <Text style={styles.informationTitle}>Additional information</Text>
                <View style={[styles.buttonsList]}>
                  {userData.additionalInformation?.filter(item => item.questionType === "Advanced").map((field, index) => (
                    <View style={styles.additionalInformationCard} key={index}>
                      <Image source={{uri:field.questionIcon}} style={styles.additionalInformationCard_icon}/>
                      <Text style={styles.additionalInformationCard_text}>
                        {field.answer}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
}
{userData.instagram &&
              <View
              style={{
                backgroundColor: 'white',
                width: '100%',
                borderRadius: 15,
                flexDirection: 'column',
                padding: 15,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: PALETTE.LIGHT100,
                marginHorizontal: 10
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  maxWidth: 350,
                  width: '100%',
                  alignItems: 'center',
                }}>
                <Image
                  source={icons.instagram}
                  style={{height: 30, width: 30, marginRight: 10}}
                  resizeMode="contain"
                />
                <Text style={{...themeText.bodyMediumFive, color: THEME_COLORS.dark}}>
                  Instagram: My recent pictures
                </Text>
              </View>
         
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{marginVertical: 10}}>
                {userData.instagram.map((image: any, index: number) => {
                  return (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: 60,
                        marginRight: 15,
                        overflow: 'hidden',
                      }}>
                      <TouchableWithoutFeedback onPress={() => { setPictureToBeViewed(image.url)
        setModalVisible(true);}}
                        style={{
                          width: 60,
                          height: 60,
                          backgroundColor: 'rgba(1, 1, 1, 0.05)',
                          borderRadius: 10,
                          overflow: 'hidden',
                        }}>
                        {image && (
                          <Image
                            source={{uri: image.url}}
                            style={{width: '100%', height: '100%'}}
                            resizeMode="cover"
                          />
                        )}
                      </TouchableWithoutFeedback>
                    </View>
                  );
                })}
              </ScrollView>
       
            </View>
}
              <DarkButton style={{marginBottom:10, marginTop: 20, width: "95%", alignSelf:'center'}}>Block</DarkButton>

              <LightButton style={{marginVertical:10, width: "95%", alignSelf:'center'}}>Report</LightButton>
            </ScrollView>
          </Animated.View>
        </PanGestureHandler>

        <Animated.View style={[styles.icon, animatedLeftIconStyle, {right: 10, transform: [{rotateZ: '-20deg'}]}]}>
          <Image source={icons.bye} style={styles.icon_image} tintColor={PALETTE.RED500} />
        </Animated.View>
        
        <Animated.View style={[styles.icon, animatedRightIconStyle, {left: 10, transform: [{rotateZ: '-20deg'}]}]}>
          <Image source={icons.yeah} style={styles.icon_image} tintColor={PALETTE.GREEN300} />
        </Animated.View>
      </Animated.View>
  
    </View>
    </>
  );
};

export default UserProfileCard;
