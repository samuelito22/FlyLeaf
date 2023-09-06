import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Modal,
  Pressable,
  BackHandler,
  Animated,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Button,
  EditProfileHeader,
  KeyboardAvoidingViewWrapper,
  Loading,
  OAuth2WebView,
  SafeContainer,
  UploadSelectionAlert,
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
  ScrollView,
} from 'react-native-gesture-handler';
import {TouchableRipple} from 'react-native-paper';
import {
  useNavigation,
  NavigationProp,
  useFocusEffect,
} from '@react-navigation/native';
import {useDispatch, useImagePicker} from '../../utils/hooks';
import {EditProfileActions, UserActions} from '../../redux';
import {InstagramService, SpotifyService, UserService} from '../../services';

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
    paddingVertical: 10,
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
  callToActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  callToActionInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
  },
  paragraphStyle: {
    flex: 2,
    flexShrink: 1,
    textAlign: 'right',
  },
});

interface SectionProps {
  state: TYPES.InitialStateEditUserType;
  dispatch: React.Dispatch<TYPES.AppAction>;
}

interface ModalSelectionProps extends SectionProps {
  data: any;
}

type NavigationProps = {
  navigation?: NavigationProp<TYPES.RootStackParamList>;
};

const useUserProfile = (uid: string | null) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const result = await UserService.getQuestionsAndInterests(
          controller.signal,
        );
        if (result.type) {
          dispatch(EditProfileActions.setQuestionsList(result.questions));
          dispatch(EditProfileActions.setInterestsList(result.interests));
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        // You can set some state here to show an error message to the user if needed
      }
    };
    if (uid) fetchData();

    return () => {
      controller.abort();
    };
  }, [dispatch]);

  return {loading, setLoading};
};

const EdiScreen: React.FC<NavigationProps> = ({navigation}) => {
  const state = useSelector((state: TYPES.AppState) => state.editUserReducer);
  const uid = useSelector(
    (state: TYPES.AppState) => state.usersReducer.currentUserId,
  );
  const {loading, setLoading} = useUserProfile(uid);
  const dispatch = useDispatch();

  const handleBackPress = async () => {
    try {
      if (uid) {
        setLoading(true);
        const result = await UserService.updateProfile(uid, state);
        if (result.type === 'success') {
          dispatch(UserActions.setUserProfile(uid, result.profile));
        }
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      // Handle the error appropriately
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        handleBackPress();
        return false;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => {
        backHandler.remove();
      };
    }, [handleBackPress]),
  );

  return (
    <KeyboardAvoidingViewWrapper>
      <SafeContainer>
        {loading && (
          <Loading.ActiveIndicator
            modalBackground={{backgroundColor: 'white'}}
          />
        )}
        <EditProfileHeader onBackPress={handleBackPress} leftIconText="Edit" />

        <BiographySection state={state} dispatch={dispatch} />

        <BasicInformation state={state} dispatch={dispatch} />
        <HeightSection state={state} dispatch={dispatch} />

        <AdditionalInformation state={state} dispatch={dispatch} />

        <PicturesSection state={state} dispatch={dispatch} />

        <View style={styles.section}>
          <Text style={styles.section_header}>Connected account</Text>
          <Text style={[styles.section_subHeader, {marginBottom: 15}]}>
            Showcase your instagram pictures and artists you enjoy listening to.
          </Text>
          <SpotifySection state={state} dispatch={dispatch} />
          <InstagramSection state={state} dispatch={dispatch} />
        </View>
      </SafeContainer>
    </KeyboardAvoidingViewWrapper>
  );
};

const BasicInformation = ({state, dispatch}: SectionProps) => {
  const [result, setResult] = useState<any>(null);
  const navigation = useNavigation<NavigationProp<TYPES.RootStackParamList>>();

  interface CallToActionProps {
    header: string;
    paragraph: string | null | undefined;
    icon: string;
    onPress: () => void;
  }

  const CallToAction: React.FC<CallToActionProps> = React.memo(
    ({header, paragraph, icon, onPress}) => {
      return (
        <TouchableRipple
          style={styles.section_withBorder}
          onPress={onPress}
          rippleColor={PALETTE.GHOSTWHITE}>
          <View style={styles.callToActionContainer}>
            <View style={styles.callToActionInnerContainer}>
              <Image
                source={Number(icon)}
                style={styles.section_withBorder_icon}
                resizeMode="contain"
              />
              <Text style={styles.section_withBorder_header}>{header}</Text>
            </View>
            <Text
              style={[
                styles.paragraphStyle,
                styles.section_withBorder_paragraph,
              ]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {paragraph}
            </Text>
          </View>
        </TouchableRipple>
      );
    },
  );

  return (
    <View style={styles.section}>
      <Text style={styles.section_header}>Basic information</Text>

      <CallToAction
        header="Gender"
        paragraph={
          state.gender?.specific ? state.gender.specific : state.gender?.general
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
        onPress={() => navigation.navigate(ROUTES.EDIT_JOB_TITLE_SCREEN)}
      />
      <CallToAction
        header="Company"
        paragraph={state.company ? state.company : 'Add'}
        icon={icons.company}
        onPress={() => navigation.navigate(ROUTES.EDIT_COMPANY_SCREEN)}
      />
      <CallToAction
        header="Vaccine"
        paragraph={state.covidVaccination ? state.covidVaccination : 'Add'}
        icon={icons.vaccine}
        onPress={() => navigation.navigate(ROUTES.EDIT_VACCINE_SCREEN)}
      />
      <CallToAction
        header="Ethnicity"
        paragraph={state.ethnicity ? state.ethnicity : 'Add'}
        icon={icons.ethnicity}
        onPress={() => navigation.navigate(ROUTES.EDIT_ETHNICITY_SCREEN)}
      />
    </View>
  );
};

const AdditionalInformation = React.memo(({state, dispatch}: SectionProps) => {
  const [result, setResult] = useState<any>(null);

  const onPress = useCallback(
    (text: string) => {
      let foundResult = state.questionsList?.find(item =>
        item.question.includes(text),
      );
      setResult(foundResult);
      dispatch(EditProfileActions.updateUserProfile('modalVisible', true));
    },
    [state.questionsList, dispatch],
  );

  const renderTouchableRipple = useCallback(
    (field: any, index: number) => (
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
    ),
    [onPress],
  );

  return (
    <View style={styles.section}>
      <Text style={styles.section_header}>Additional information</Text>
      <Text style={[styles.section_subHeader, {paddingBottom: 10}]}>
        Make your adjustments here, and let others know more about yourself
      </Text>
      {state.additionalInformation.map(renderTouchableRipple)}
      {result && (
        <ModalSelection state={state} dispatch={dispatch} data={result} />
      )}
    </View>
  );
});

const HeightSection = React.memo(({state, dispatch}: SectionProps) => {
  const [heightState, setHeightState] = useState({
    feets: state?.height?.feets || '',
    inches: state?.height?.inches || '',
    active: {feet: 0, inches: 0},
    showFeetError: false,
    showInchesError: false,
  });

  const onFeetBlur = useCallback(() => {
    setHeightState(prevState => {
      let error = false;
      if (prevState.feets) {
        const feetToInt = parseInt(prevState.feets);
        if (isNaN(feetToInt) || feetToInt < 3 || feetToInt > 7) {
          error = true;
        }
      }
      return {
        ...prevState,
        active: {...prevState.active, feet: 0},
        showFeetError: error,
      };
    });
  }, []);

  const onInchesBlur = useCallback(() => {
    setHeightState(prevState => {
      let error = false;
      if (prevState.inches) {
        const inchesToInt = parseInt(prevState.inches);
        if (isNaN(inchesToInt) || inchesToInt < 0 || inchesToInt > 11) {
          error = true;
        }
      }
      return {
        ...prevState,
        active: {...prevState.active, inches: 0},
        showInchesError: error,
      };
    });
  }, []);

  useEffect(() => {
    setHeightState(prevState => ({...prevState, showFeetError: false}));
  }, [heightState.feets]);

  useEffect(() => {
    setHeightState(prevState => ({...prevState, showInchesError: false}));
  }, [heightState.inches]);

  useEffect(() => {
    const isValidFeet = (value: string) => {
      const feetToInt = parseInt(value);
      return feetToInt >= 3 && feetToInt <= 7;
    };

    const isValidInches = (value: string) => {
      if (value === '') return true;
      const inchesToInt = parseInt(value);
      return inchesToInt >= 0 && inchesToInt <= 11;
    };

    if (isValidFeet(heightState.feets) && isValidInches(heightState.inches)) {
      dispatch(
        EditProfileActions.updateUserProfile('height', {
          feets: heightState.feets,
          inches: heightState.inches || '0',
        }),
      );
    } else {
      dispatch(EditProfileActions.updateUserProfile('height', undefined));
    }
  }, [heightState.feets, heightState.inches]);

  return (
    <View style={styles.section}>
      <Text style={styles.section_header}>Height</Text>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.section_height}>
          <Text style={styles.section_height_header}>Feets</Text>
          <TextInput
            onFocus={() =>
              setHeightState(prevState => ({
                ...prevState,
                active: {...prevState.active, feet: 1},
              }))
            }
            onBlur={onFeetBlur}
            style={[
              styles.section_height_boxInput,
              {
                borderColor: heightState.active.feet
                  ? THEME_COLORS.primary
                  : THEME_COLORS.tertiary,
              },
            ]}
            value={heightState.feets}
            onChangeText={text =>
              setHeightState(prevState => ({...prevState, feets: text}))
            }
            placeholder="ft"
            placeholderTextColor={THEME_COLORS.tertiary}
            keyboardType="number-pad"
          />
          {heightState.showFeetError && (
            <Text style={styles.section_height_error}>
              Please enter a number between 3 and 7
            </Text>
          )}
        </View>
        <View style={styles.section_height}>
          <Text style={styles.section_height_header}>Inches</Text>
          <TextInput
            onFocus={() =>
              setHeightState(prevState => ({
                ...prevState,
                active: {...prevState.active, inches: 1},
              }))
            }
            onBlur={onInchesBlur}
            style={[
              styles.section_height_boxInput,
              {
                borderColor: heightState.active.inches
                  ? THEME_COLORS.primary
                  : THEME_COLORS.tertiary,
              },
            ]}
            value={heightState.inches}
            onChangeText={text =>
              setHeightState(prevState => ({...prevState, inches: text}))
            }
            placeholder="in"
            placeholderTextColor={THEME_COLORS.tertiary}
            keyboardType="number-pad"
          />
          {heightState.showInchesError && (
            <Text style={styles.section_height_error}>
              Please enter a number between 0 and 11
            </Text>
          )}
        </View>
      </View>
    </View>
  );
});

const PicturesSection = React.memo(({state, dispatch}: SectionProps) => {
  const [sectionWidth, setSectionWidth] = useState(0);
  const [pictures, setPictures] = useState<(string | null | undefined)[]>(
    state.pictures ? state.pictures : [],
  );

  const [isAlertVisible, setAlertVisible] = useState(false);
  const {handleCameraButtonPress, handleGalleryButtonPress} = useImagePicker();
  const imageToBeChangedRef = useRef<number>();

  const picturesWidth = useMemo(
    () => [(sectionWidth / 3) * 2, ...Array(5).fill(sectionWidth / 3)],
    [sectionWidth],
  );

  const handleImageSelection = useCallback(
    async (getImage: () => Promise<string | undefined>) => {
      setAlertVisible(false);
      const result = await getImage();

      if (result) {
        setPictures(prevState => {
          const newState = [...prevState];
          if (imageToBeChangedRef.current != null)
            newState[imageToBeChangedRef.current] = result;
          return newState;
        });
      }
    },
    [handleGalleryButtonPress, handleCameraButtonPress],
  );

  const handleAlertClose = () => {
    setAlertVisible(false);
  };

  useEffect(() => {
    dispatch(EditProfileActions.updateUserProfile('pictures', pictures));
    // you can return a cleanup function here if needed, like:
    // return () => { /* cleanup code here */ };
  }, [pictures]);

  const PictureField = React.memo(
    ({picture, idx}: {picture?: string | null; idx: number}) => {
      return (
        <LongPressGestureHandler
          minDurationMs={100}
          onActivated={() => {
            setAlertVisible(true);
            imageToBeChangedRef.current = idx;
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: PALETTE.LIGHT200,
              borderRadius: BORDER_RADIUS.large,
              width: picturesWidth[idx],
              height: picturesWidth[idx],
              marginBottom: 5,
              marginRight: idx === 3 || idx === 4 ? 5 : idx === 0 ? 10 : 0,
            }}>
            {picture ? (
              <React.Fragment>
                <Animated.Image
                  source={{uri: picture}}
                  resizeMode="cover"
                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: BORDER_RADIUS.large,
                  }}
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
                      paddingHorizontal: idx === 0 ? 10 : 0,
                    }}>
                    {idx === 0 ? 'main' : idx + 1}
                  </Text>
                </View>
              </React.Fragment>
            ) : (
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
          </View>
        </LongPressGestureHandler>
      );
    },
  );

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
        <PictureField picture={pictures[0]} idx={0} />
        <View style={{flexDirection: 'column'}}>
          <PictureField picture={pictures[1]} idx={1} />
          <PictureField picture={pictures[2]} idx={2} />
        </View>
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {[...Array(3)].map((_, index) => (
            <React.Fragment key={index + 3}>
              <PictureField picture={pictures[index + 3]} idx={index + 3} />
            </React.Fragment>
          ))}
        </View>
      </View>
      <UploadSelectionAlert
        visible={isAlertVisible}
        onClose={handleAlertClose}
        onGalleryPress={() => handleImageSelection(handleGalleryButtonPress)}
        onTakePhotoPress={() => handleImageSelection(handleCameraButtonPress)}
      />
    </View>
  );
});

const BiographySection = React.memo(({state, dispatch}: SectionProps) => {
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
        onChangeText={text =>
          dispatch(EditProfileActions.updateUserProfile('bio', text))
        }
        value={state.bio ?? ''}
        placeholder="About me"
        placeholderTextColor={THEME_COLORS.tertiary}
        multiline={true}
        onFocus={() => setActive(1)}
        onBlur={() => setActive(0)}
      />
    </View>
  );
});

const ModalSelection = React.memo(
  ({state, dispatch, data}: ModalSelectionProps) => {
    const field = useMemo(() => {
      return state.additionalInformation?.find((field: any) =>
        field.question.includes(data.question),
      );
    }, [data.question, state.additionalInformation]);

    const [selectedAnswer, setSelectedAnswer] = useState<
      null | undefined | string
    >(null);

    const closeModal = useCallback(() => {
      dispatch(EditProfileActions.updateUserProfile('modalVisible', false));
    }, [dispatch]);

    const handleAnswerSelect = useCallback((answer: string) => {
      setSelectedAnswer(answer);
    }, []);

    const handleConfirmation = useCallback(() => {
      const question = state.additionalInformation?.find((field: any) =>
        field.question.includes(data.question),
      );

      if (question && selectedAnswer) {
        question.answer = selectedAnswer;
      }

      closeModal();
    }, [
      data.question,
      state.additionalInformation,
      selectedAnswer,
      closeModal,
    ]);

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
        onRequestClose={closeModal}>
        <Pressable style={{flex: 1}} onPress={closeModal}>
          <View style={modalSelectionStyles.flexEnd}>
            <Pressable
              style={modalSelectionStyles.container}
              onPress={e => e.stopPropagation()}>
              <View style={modalSelectionStyles.iconsContainer}>
                <View
                  onStartShouldSetResponder={() => true}
                  onResponderRelease={() =>
                    dispatch(
                      EditProfileActions.updateUserProfile(
                        'modalVisible',
                        false,
                      ),
                    )
                  }
                  style={modalSelectionStyles.iconContainer}>
                  <Image
                    source={icons.normalCross}
                    resizeMode="contain"
                    style={modalSelectionStyles.crossIcon}
                  />
                </View>
                <View
                  onStartShouldSetResponder={() => true}
                  onResponderRelease={handleConfirmation}
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
                contentContainerStyle={
                  modalSelectionStyles.ScrollViewContainer
                }>
                <View style={modalSelectionStyles.answersContainer}>
                  {data.answers.map((answer: string, index: number) => (
                    <Button.interestsButton
                      onPress={() => handleAnswerSelect(answer)}
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
  },
);

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

const SpotifySection: React.FC<SectionProps> = ({state, dispatch}) => {
  const [artists, setArtists] = useState<any>(
    state?.spotify?.artists ? state.spotify.artists : Array(10).fill(null),
  );

  const authCodeRef = useRef<string>('');
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(
    state.spotify?.isConnected ? true : false,
  );

  const [showWebView, setShowWebView] = useState(false);
  const uid = useSelector(
    (state: TYPES.AppState) => state.usersReducer.currentUserId,
  );

  const handleFetchArtists = async () => {
    setLoading(true);

    if (isConnected) {
      if (uid)
        await SpotifyService()
          .disconnectFromSpotify(uid)
          .catch(e => console.log(e))
          .then(result => {
            if (result.type === 'success') setIsConnected(false);
          });
      setArtists(Array(10).fill(null));
      authCodeRef.current = '';
    } else {
      if (uid) {
        setShowWebView(true);
        await waitForAuthCode();
        await SpotifyService()
          .authenticateAndFetchSpotify(uid, authCodeRef.current)
          .then(result => {
            if (result.type === 'success') {
              setIsConnected(true);
              setArtists(result.artists);
            }
          })
          .catch(e => console.log(e));
      }
    }

    setLoading(false);
  };

  const config = {
    clientId: '5f030af89dcf40e6a2f2cd3b5c8f09ef',
    redirectUrl: 'com.frontend:/callback',
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    scopes: ['user-top-read'],
  };

  const waitForAuthCode = (): Promise<void> => {
    return new Promise<void>(resolve => {
      const checkForCode = setInterval(() => {
        if (authCodeRef.current) {
          clearInterval(checkForCode);
          resolve();
        }
      }, 500); // Check every half second
    });
  };

  const handleSpotifyAuth = async (code: string) => {
    authCodeRef.current = code;
    setShowWebView(false);
  };

  return (
    <View style={{width: '100%', paddingHorizontal: 20, marginBottom: 20}}>
      {showWebView && (
        <OAuth2WebView
          isVisible={showWebView}
          onClose={() => setShowWebView(false)}
          config={config}
          onCodeReceived={code => handleSpotifyAuth(code)}
        />
      )}

      <View
        style={{
          backgroundColor: 'black',
          width: '100%',
          borderRadius: 15,
          flexDirection: 'column',
          padding: 15,
          overflow: 'hidden',
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
          <Text style={{...themeText.bodyMediumFive, color: 'white'}}>
            {isConnected ? 'Connected to spotify' : 'Connect to spotify'}
          </Text>
        </View>
        <Text
          style={{
            marginTop: 10,
            color: PALETTE.GRAY300,
            ...themeText.bodyRegularSeven,
          }}>
          At FlyLeaf, we use your top artists to connect you with like-minded
          music enthusiasts, enhancing conversations and personalizing your
          experience.
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{marginVertical: 10}}>
          {artists.map((artist: any, index: number) => {
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
        <Button.LightButton
          onPress={handleFetchArtists}
          style={{marginVertical: 10}}>
          {isConnected ? 'Disconnect' : 'Connect now'}
        </Button.LightButton>
        {loading && (
          <View
            style={{
              position: 'absolute',
              backgroundColor: 'rgba(0,0,0,0.3)',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        )}
      </View>
    </View>
  );
};

const InstagramSection: React.FC<SectionProps> = ({state, dispatch}) => {
  const [images, setImages] = useState<any>(
    state.instagram?.images ? state.instagram.images : Array(10).fill(null),
  );
  const authCodeRef = useRef<string>('');
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(
    state.instagram?.isConnected ? true : false,
  );
  const [showWebView, setShowWebView] = useState(false);
  const uid = useSelector(
    (state: TYPES.AppState) => state.usersReducer.currentUserId,
  );

  const handleFetchImages = async () => {
    setLoading(true);

    if (isConnected) {
      if (uid)
        await InstagramService()
          .disconnectFromInstagram(uid)
          .catch(e => console.log(e))
          .then(result => {
            if (result.type === 'success') setIsConnected(false);
          });
      setImages(Array(10).fill(null));
      authCodeRef.current = '';
    } else {
      if (uid) {
        setShowWebView(true);
        await waitForAuthCode();
        await InstagramService()
          .authenticateAndFetchInstagram(uid, authCodeRef.current)
          .then(result => {
            if (result.type === 'success') {
              setIsConnected(true);
              setImages(result.images);
            }
          })
          .catch(e => console.log(e));
      }
    }
    setLoading(false);
  };

  const config = {
    clientId: '614409710852626',
    redirectUrl: 'https://91db-90-242-236-229.ngrok-free.app/instagram/oauth/',
    authorizationEndpoint: 'https://api.instagram.com/oauth/authorize',
    scopes: ['user_profile', 'user_media'],
  };

  const waitForAuthCode = (): Promise<void> => {
    return new Promise<void>(resolve => {
      const checkForCode = setInterval(() => {
        if (authCodeRef.current) {
          clearInterval(checkForCode);
          resolve();
        }
      }, 500); // Check every half second
    });
  };

  const handleInstagramAuth = async (code: string) => {
    authCodeRef.current = code;
    setShowWebView(false);
  };

  return (
    <View style={{width: '100%', paddingHorizontal: 20, marginBottom: 20}}>
      {showWebView && (
        <OAuth2WebView
          isVisible={showWebView}
          onClose={() => setShowWebView(false)}
          config={config}
          onCodeReceived={code => handleInstagramAuth(code)}
        />
      )}
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
        }}>
        <View
          style={{
            flexDirection: 'row',
            maxWidth: 250,
            width: '100%',
            alignItems: 'center',
          }}>
          <Image
            source={icons.instagram}
            style={{height: 30, width: 30, marginRight: 10}}
            resizeMode="contain"
          />
          <Text style={{...themeText.bodyMediumFive, color: THEME_COLORS.dark}}>
            {isConnected ? 'Connected to instagram' : 'Connect to instagram'}
          </Text>
        </View>
        <Text
          style={{
            marginTop: 10,
            color: THEME_COLORS.dark,
            ...themeText.bodyRegularSeven,
          }}>
          Your latest posts will be visible to others, but your username will
          not be visible.
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{marginVertical: 10}}>
          {images.map((image: any, index: number) => {
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
                </View>
              </View>
            );
          })}
        </ScrollView>
        <Button.DarkButton
          onPress={handleFetchImages}
          style={{marginVertical: 10}}>
          {isConnected ? 'Disconnect' : 'Connect now'}
        </Button.DarkButton>
        {loading && (
          <View
            style={{
              position: 'absolute',
              backgroundColor: 'rgba(0,0,0,0.1)',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        )}
      </View>
    </View>
  );
};

export default EdiScreen;
