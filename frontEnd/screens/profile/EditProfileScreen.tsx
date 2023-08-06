import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Modal,
  Pressable,
  BackHandler,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Button,
  EditProfileHeader,
  KeyboardAvoidingViewWrapper,
  LoadingSpinner,
  Ripple,
  SafeContainer,
  questionsList,
} from '../../components';
import {
  BORDER_RADIUS,
  COMPONENT_COLORS,
  PALETTE,
  ROUTES,
  THEME_COLORS,
  TYPES,
  themeText,
} from '../../constants';
import {useSelector} from 'react-redux';
import {icons} from '../../assets';
import {
  LongPressGestureHandler,
  LongPressGestureHandlerGestureEvent,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  ScrollView,
  State,
} from 'react-native-gesture-handler';
import {TouchableRipple} from 'react-native-paper';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {useDispatch} from '../../utils/hooks';
import {
  editSetBio,
  editSetCompany,
  editSetHeight,
  editSetJobTitle,
  editSetModalVisible,
} from '../../redux';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {isEqual} from 'lodash';

const styles = StyleSheet.create({
  section: {
    flexDirection: 'column',
    height: 'auto',
    maxWidth: 450,
    width: '100%',
    paddingVertical: 20,
  },
  section_header: {
    ...themeText.bodyBoldThree,
    color: THEME_COLORS.dark,
    paddingHorizontal: 20,
  },
  section_textInput: {
    backgroundColor: 'white',
    color: 'black',
    borderBottomWidth: 0.5,
    marginHorizontal: 20,
    marginTop: 10,
    ...themeText.bodyRegularSix,
  },
  section_subHeader: {
    ...themeText.bodyRegularSix,
    color: THEME_COLORS.dark,
    paddingHorizontal: 20,
  },
  section_height: {
    width: '50%',
    maxWidth: 200,
    marginTop: 10,
    paddingLeft: 20,
  },
  section_height_header: {
    ...themeText.bodyRegularSix,
    color: THEME_COLORS.dark,
    marginBottom: 5,
  },
  section_height_boxInput: {
    ...themeText.bodyRegularSix,
    color: THEME_COLORS.dark,
    borderBottomWidth: 0.5,
    borderColor: PALETTE.GHOSTWHITE,
  },
  section_height_error: {
    ...themeText.bodyRegularSeven,
    color: PALETTE.RED500,
    marginTop: 5,
  },
  section_withBorder: {
    borderColor: PALETTE.GHOSTWHITE,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
  },
  section_withBorder_header: {
    ...themeText.bodyMediumSix,
    color: THEME_COLORS.dark,
  },
  section_withBorder_paragraph: {
    ...themeText.bodyRegularSix,
    color: THEME_COLORS.tertiary,
  },
  section_withBorder_icon: {
    tintColor: PALETTE.DARK,
    width: 20,
    height: 20,
    marginRight: 10,
  },
});

interface SectionProps {
  state: TYPES.InitialStateEditUserType;
  dispatch: React.Dispatch<TYPES.AppAction>;
}

interface ModalSelectionProps extends SectionProps {
  data: any;
}

const EditProfileScreen = () => {
  const state = useSelector((state: TYPES.AppState) => state.editUserReducer);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Add event listener for hardware back button
    const backAction = () => {
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => {
      // Remove event listener when the component is unmounted
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 300); // adjust the time as per your requirement
  }, []);

  const handleBackPress = async () => {
    console.log('Updating database');
  };

  return (
    <KeyboardAvoidingViewWrapper>
      <SafeContainer>
        {loading && (
          <LoadingSpinner modalBackground={{backgroundColor: 'white'}} />
        )}
        <EditProfileHeader
          onBackPress={handleBackPress}
          leftIconText="Edit Profile"
        />

        <BiographySection state={state} dispatch={dispatch} />

        <BasicInformation state={state} dispatch={dispatch} />
        <HeightSection state={state} dispatch={dispatch} />

        <AdditionalInformation state={state} dispatch={dispatch} />

        <PicturesSection state={state} dispatch={dispatch} />
      </SafeContainer>
    </KeyboardAvoidingViewWrapper>
  );
};

const BasicInformation = ({state, dispatch}: SectionProps) => {
  const [result, setResult] = useState<any>(null);
  const navigation = useNavigation<NavigationProp<TYPES.RootStackParamList>>();

  const CallToAction = ({
    header,
    paragraph,
    icon,
    onPress,
  }: {
    header: string;
    paragraph: string | null | undefined;
    icon: string;
    onPress: () => void;
  }) => {
    return (
      <TouchableRipple
        style={styles.section_withBorder}
        onPress={onPress}
        rippleColor={PALETTE.GHOSTWHITE}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
            <Image
              source={Number(icon)}
              style={styles.section_withBorder_icon}
              resizeMode="contain"
            />
            <Text style={styles.section_withBorder_header}>{header}</Text>
          </View>
          <Text
            style={[
              styles.section_withBorder_paragraph,
              {flex: 2, flexShrink: 1, textAlign: 'right'},
            ]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {paragraph}
          </Text>
        </View>
      </TouchableRipple>
    );
  };

  return (
    <View style={styles.section}>
      <Text style={styles.section_header}>Basic information</Text>

      <CallToAction
        header="Gender"
        paragraph={
          state.genderInformation?.specific
            ? state.genderInformation.specific
            : state.genderInformation?.general
        }
        icon={icons.gender}
        onPress={() => navigation.navigate(ROUTES.EDIT_GENDER_SCREEN)}
      />
      <CallToAction
        header="Languages"
        paragraph={
          state.languages && state.languages.length !== 0
            ? state.languages.join(', ')
            : 'Add'
        }
        icon={icons.languages}
        onPress={() => navigation.navigate(ROUTES.EDIT_LANGUAGE_SCREEN)}
      />
      <CallToAction
        header="Sexual Orientation"
        paragraph={
          state.sexualOrientation && state.sexualOrientation.length !== 0
            ? state.sexualOrientation.join(', ')
            : 'Add'
        }
        icon={icons.sexualOrientation}
        onPress={() =>
          navigation.navigate(ROUTES.EDIT_SEXUAL_ORIENTATION_SCREEN)
        }
      />
      <CallToAction
        header="Job Title"
        paragraph={state.jobTitle ? state.jobTitle : 'Add'}
        icon={icons.job}
        onPress={() => navigation.navigate(ROUTES.EDIT_LANGUAGE_SCREEN)}
      />
      <CallToAction
        header="Company"
        paragraph={state.company ? state.company : 'Add'}
        icon={icons.company}
        onPress={() => navigation.navigate(ROUTES.EDIT_LANGUAGE_SCREEN)}
      />
    </View>
  );
};

const AdditionalInformation = ({state, dispatch}: SectionProps) => {
  const [result, setResult] = useState<any>(null);
  const onPress = (text: string) => {
    let result = questionsList.find(item => item.question.includes(text));
    setResult(result);
    dispatch(editSetModalVisible(true));
  };

  return (
    <View style={styles.section}>
      <Text style={styles.section_header}>Additional information</Text>
      <Text style={[styles.section_subHeader, {paddingBottom: 10}]}>
        Make your adjustments here, and let others know more about youself
      </Text>
      {state.additionalInformation?.map((field, index) => (
        <TouchableRipple
          key={index}
          style={styles.section_withBorder}
          onPress={() => onPress(field.question)}
          rippleColor={PALETTE.GHOSTWHITE}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={Number(field.icon)}
              style={styles.section_withBorder_icon}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.section_withBorder_header}>
                {field.question}
              </Text>
              <Text style={styles.section_withBorder_paragraph}>
                {field.answer}
              </Text>
            </View>
          </View>
        </TouchableRipple>
      ))}
      {result && (
        <ModalSelection state={state} dispatch={dispatch} data={result} />
      )}
    </View>
  );
};

const HeightSection = ({state, dispatch}: SectionProps) => {
  const [feet, setFeet] = useState(
    state?.height?.feet ? state?.height?.feet.toString : '',
  );
  const [inches, setInches] = useState(
    state?.height?.inches ? state?.height?.inches.toString : '',
  );
  const [active, setActive] = useState({feet: 0, inches: 0});

  const [showFeetError, setShowFeetError] = useState(false);
  const [showInchesError, setShowInchesError] = useState(false);

  const onFeetBlur = () => {
    setActive(prevState => ({...prevState, feet: 0}));
    try {
      if (!feet) return;
      const feetToInt = parseInt(feet);
      if (feetToInt < 3 || feetToInt > 7 || !feetToInt) {
        setShowFeetError(true);
      }
    } catch {
      setShowFeetError(true);
    }
  };

  const onInchesBlur = () => {
    setActive(prevState => ({...prevState, inches: 0}));
    try {
      if (!inches) return;
      const inchesToInt = parseInt(inches);
      if (inchesToInt < 3 || inchesToInt > 11 || !inchesToInt) {
        setShowInchesError(true);
      }
    } catch {
      setShowInchesError(true);
    }
  };

  useEffect(() => setShowFeetError(false), [feet]);
  useEffect(() => setShowInchesError(false), [inches]);

  const handleSave = () => {
    if (!showFeetError && !showInchesError) {
      dispatch(editSetHeight({feet: Number(feet), inches: Number(inches)}));
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.section_header}>Height</Text>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.section_height}>
          <Text style={styles.section_height_header}>Feet</Text>
          <TextInput
            onFocus={() => setActive(prevState => ({...prevState, feet: 1}))}
            onBlur={onFeetBlur}
            style={[
              styles.section_height_boxInput,
              {
                borderColor: active.feet
                  ? THEME_COLORS.primary
                  : THEME_COLORS.tertiary,
              },
            ]}
            value={feet}
            onChangeText={text => setFeet(text)}
            placeholder="ft"
            placeholderTextColor={THEME_COLORS.tertiary}
            keyboardType="number-pad"
          />
          {showFeetError && (
            <Text style={styles.section_height_error}>
              Please enter a number between 3 and 7
            </Text>
          )}
        </View>
        <View style={styles.section_height}>
          <Text style={styles.section_height_header}>Inches</Text>
          <TextInput
            onFocus={() => setActive(prevState => ({...prevState, inches: 1}))}
            onBlur={onInchesBlur}
            style={[
              styles.section_height_boxInput,
              {
                borderColor: active.inches
                  ? THEME_COLORS.primary
                  : THEME_COLORS.tertiary,
              },
            ]}
            value={inches}
            onChangeText={text => setInches(text)}
            placeholder="in"
            placeholderTextColor={THEME_COLORS.tertiary}
            keyboardType="number-pad"
          />
          {showInchesError && (
            <Text style={styles.section_height_error}>
              Please enter a number between 0 and 11
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const PicturesSection = ({state, dispatch}: SectionProps) => {
  const [sectionWidth, setSectionWidth] = useState(0);
  const [pictures, setPictures] = useState<(string | null | undefined)[]>(
    state.pictures ? state.pictures : [],
  );

  const [picturesCoords, setPicturesCoords] = useState<
    | {topLeft: {x: number; y: number}; bottomRight: {x: number; y: number}}[]
    | null
  >(null);

  const pictureTranslations = pictures.map(index => ({
    translateX: useSharedValue(0),
    translateY: useSharedValue(0),
    landingIndex: useSharedValue(index),
  }));

  const picturesWidth = [
    (sectionWidth / 3) * 2,
    ...Array(5).fill(sectionWidth / 3),
  ];

  const [moveablePicture, setMoveablePicture] = useState<null | string>(null)

  const PictureField = ({
    picture,
    idx,
    translations,
  }: {
    picture?: string | null;
    idx: number;
    translations: any;
  }) => {
    const pictureContainer = useRef<Animated.View>(null);
    const indexContainer = useRef(idx);
    

    const getPosition = () => {
      pictureContainer.current?.measureInWindow(
        (x: number, y: number) => {
          const topLeft = {x, y};
          const bottomRight = {x: x + picturesWidth[idx], y: y + picturesWidth[idx]};
          if (x && y) {
            setPicturesCoords(prevState => {
              let newCoords = prevState ? [...prevState] : [];

              if (newCoords.length == indexContainer.current) {
                newCoords[indexContainer.current] = {topLeft, bottomRight};
                return newCoords;
              } else {
                return prevState;
              }
            });
          }
        },
      );
    };

    useEffect(() => {
      getPosition();
    }, []);

    const animatedImageStyle = useAnimatedStyle(() => {
      const transform = [
        {translateX: picture ? translations.translateX.value : 0},
        {translateY: picture ? translations.translateY.value : 0},
      ]

      const side = picturesWidth[indexContainer.current]
      
      const height = withTiming(side)
      const width = withTiming(side)

      return {transform, width, height}
  });

    const animatedImageContainerStyle = useAnimatedStyle(() => ({
      width: picturesWidth[indexContainer.current],
      height: picturesWidth[indexContainer.current],
      marginBottom: 5,
      marginRight:
        indexContainer.current === 3 || indexContainer.current === 4
          ? 5
          : indexContainer.current === 0
          ? 10
          : 0,
      zIndex: 1,
      
    }));

    return (
      <LongPressGestureHandler
        minDurationMs={100}
        onActivated={() => {
          if(picture){ 
            setMoveablePicture(picture)
            setPictures(prevState => {
              const newState = [...prevState]
              newState[idx] = null
              return newState
            })
          }
          }}>
        <Animated.View
          style={[animatedImageContainerStyle, {justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: PALETTE.LIGHT200,
          borderRadius: BORDER_RADIUS.large,}]}
          ref={pictureContainer}>
              { picture ? (
                <React.Fragment>
                  <Animated.Image
                    source={{uri: picture}}
                    resizeMode="cover"
                    style={[animatedImageStyle,{
                      height: '100%',
                      width: '100%',
                      borderRadius: BORDER_RADIUS.large,
                    }]}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      borderRadius: BORDER_RADIUS.circle,
                      top: 5,
                      left: 5,
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      height: 20,
                      minWidth: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        ...themeText.bodyRegularSeven,
                        flex: 1,
                        paddingHorizontal:
                          indexContainer.current === 0 ? 10 : 0,
                      }}>
                      {indexContainer.current === 0
                        ? 'main'
                        : indexContainer.current + 1}
                    </Text>
                  </View>
                </React.Fragment>
              ) : picture === undefined && (
                <Image
                  source={icons.plus}
                  style={{
                    tintColor: PALETTE.GRAY500,
                    height: '50%',
                    width: '50%',
                  }}
                  resizeMode="cover"
                />
              )}
        </Animated.View>
      </LongPressGestureHandler>
    );
  };

  const MoveablePicture = () => {
    const index = pictures.findIndex(picture => picture === null);
    const [movPicCoord, setMovPicCoord] = useState<null | {topLeft:{x: number, y: number}, bottomRight:{x:Number, y:number}}>(null)
    const MovPicRef = useRef<Animated.View>(null)

    useEffect(() => {
      MovPicRef.current?.measureInWindow((x: number, y: number) => {
        const topLeft = {x, y};
          const bottomRight = {x: x + picturesWidth[index], y: y + picturesWidth[index]};
          setMovPicCoord({topLeft, bottomRight})
      })
    }, [])

    const translateX = useSharedValue(0)
    const translateY = useSharedValue(0)
    useEffect(() => console.log(picturesCoords ? picturesCoords[index].topLeft.x : 0), [movPicCoord])

    const animatedImageContainerStyle = useAnimatedStyle(() => ({
      width: picturesWidth[index],
      height: picturesWidth[index],
      zIndex: 5,
      position:'absolute',
      transform: [{translateX: 0}, {translateY: 0}],
    }));

    
    const panGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>(
      {
        onStart: () => {
          if(picturesCoords){
            //translateX.value = picturesCoords[index].topLeft.x - movPicCoord.topLeft.x
            //translateY.value = picturesCoords[index].topLeft.y - movPicCoord.topLeft.y
          }
        },

      },
    )
    
    return (
      <PanGestureHandler onGestureEvent={panGesture}>
        <Animated.View style={animatedImageContainerStyle} ref={MovPicRef}>
          {moveablePicture &&
        <Image
                    source={{uri: moveablePicture}}
                    resizeMode="cover"
                    style={[{
                      height: '100%',
                      width: '100%',
                      borderRadius: BORDER_RADIUS.large,
                    }]}
                  />
          }
        </Animated.View>
      </PanGestureHandler>
    )
  }

  const onLayout = (event: TYPES.LayoutChangeEvent) => {
    const {width} = event.nativeEvent.layout;
    setSectionWidth(width - 40 - 20); //section width -40 padding and - 10 space per section hence 20
  };

  return (
    <View style={styles.section} onLayout={onLayout}>
      <Text style={styles.section_header}>Pictures</Text>
      <Text style={styles.section_subHeader}>
        Pick the best pictures of yourself
      </Text>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          paddingHorizontal: 20,
          paddingTop: 10,
          overflow: 'hidden',
        }}>
        {moveablePicture && <MoveablePicture/>}
        <PictureField
          picture={pictures[0]}
          idx={0}
          translations={pictureTranslations[0]}
        />
        <View style={{flexDirection: 'column'}}>
          <PictureField
            picture={pictures[1]}
            idx={1}
            translations={pictureTranslations[1]}
          />
          <PictureField
            picture={pictures[2]}
            idx={2}
            translations={pictureTranslations[2]}
          />
        </View>
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {[...Array(3)].map((_, index) => (
            <React.Fragment key={index + 3}>
              <PictureField
                picture={pictures[index + 3]}
                idx={index + 3}
                translations={pictureTranslations[index + 3]}
              />
            </React.Fragment>
          ))}
        </View>
      </View>
    </View>
  );
};

const BiographySection = ({state, dispatch}: SectionProps) => {
  const [active, setActive] = useState(0);

  return (
    <View style={styles.section}>
      <Text style={styles.section_header}>About</Text>
      <Text style={styles.section_subHeader}>
        Write a coincised and interesting biography to impress your viewers
      </Text>
      <TextInput
        style={[
          styles.section_textInput,
          {borderColor: active ? THEME_COLORS.primary : THEME_COLORS.tertiary},
        ]}
        onChangeText={text => dispatch(editSetBio(text))}
        value={state.bio ?? ''}
        placeholder="About me"
        placeholderTextColor={THEME_COLORS.tertiary}
        multiline={true}
        onFocus={() => setActive(1)}
        onBlur={() => setActive(0)}
      />
    </View>
  );
};

const ModalSelection = ({state, dispatch, data}: ModalSelectionProps) => {
  const field = useMemo(() => {
    return state.additionalInformation?.find(field =>
      field.question.includes(data.question),
    );
  }, [data.question, state.additionalInformation]);

  const [selectedAnswer, setSelectedAnswer] = useState<
    null | undefined | string
  >(null);

  const onPress = () => {
    const question = state.additionalInformation?.find(field =>
      field.question.includes(data.question),
    );

    if (question && selectedAnswer) {
      question.answer = selectedAnswer;
    }

    dispatch(editSetModalVisible(false));
  };

  useEffect(() => {
    if (state.modalVisible) {
      setSelectedAnswer(field?.answer);
    } else {
      setSelectedAnswer(null);
    }
  }, [field, state.modalVisible]);

  return (
    <Modal
      transparent={true}
      visible={state.modalVisible}
      onRequestClose={() => dispatch(editSetModalVisible(false))}>
      <Pressable
        style={{flex: 1}}
        onPress={() => dispatch(editSetModalVisible(false))}>
        <View style={modalSelectionStyles.flexEnd}>
          <Pressable
            style={modalSelectionStyles.container}
            onPress={e => e.stopPropagation()}>
            <View style={modalSelectionStyles.iconsContainer}>
              <View
                onStartShouldSetResponder={() => true}
                onResponderRelease={() => dispatch(editSetModalVisible(false))}
                style={modalSelectionStyles.iconContainer}>
                <Image
                  source={icons.normalCross}
                  resizeMode="contain"
                  style={modalSelectionStyles.crossIcon}
                />
              </View>
              <View
                onStartShouldSetResponder={() => true}
                onResponderRelease={() => onPress()}
                style={modalSelectionStyles.iconContainer}>
                <Image
                  source={icons.normalTick}
                  resizeMode="contain"
                  style={modalSelectionStyles.tickIcon}
                />
              </View>
            </View>
            <Text style={modalSelectionStyles.header}>{data.question}</Text>
            <ScrollView
              contentContainerStyle={modalSelectionStyles.ScrollViewContainer}>
              <View style={modalSelectionStyles.answersContainer}>
                {data.answers.map((answer: string, index: number) => (
                  <Button.interestsButton
                    onPress={() => setSelectedAnswer(answer)}
                    active={selectedAnswer === answer}
                    key={index}
                    style={modalSelectionStyles.interestButtons}>
                    {answer}
                  </Button.interestsButton>
                ))}
              </View>
            </ScrollView>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

const modalSelectionStyles = StyleSheet.create({
  container: {
    maxWidth: 500,
    width: '100%',
    backgroundColor: 'white',
    maxHeight: 600,
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    paddingVertical: 20,
  },
  header: {
    ...themeText.bodyBoldTwo,
    color: THEME_COLORS.dark,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  flexEnd: {
    flex: 1,
    backgroundColor: COMPONENT_COLORS.modalBackground,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  ScrollViewContainer: {
    width: '100%',
    alignItems: 'center',
  },
  answersContainer: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center',
  },
  interestButtons: {
    margin: 5,
  },
  done: {
    ...themeText.bodyBoldFive,
    color: THEME_COLORS.dark,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  iconContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossIcon: {
    width: '40%',
    height: '40%',
    tintColor: PALETTE.DARK,
  },
  tickIcon: {
    width: '100%',
    height: '100%',
    tintColor: THEME_COLORS.primary,
  },
});

export default EditProfileScreen;
