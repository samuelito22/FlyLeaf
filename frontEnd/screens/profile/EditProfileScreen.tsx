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
  Dimensions,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Button,
  EditProfileHeader,
  KeyboardAvoidingViewWrapper,
  LoadingSpinner,
  OAuth2WebView,
  SafeContainer,
  ThreeDotsLoader,
  UploadSelectionAlert,
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
import {FlatList, LongPressGestureHandler, ScrollView} from 'react-native-gesture-handler';
import {TouchableRipple} from 'react-native-paper';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {useDispatch, useImagePicker} from '../../utils/hooks';
import {AppStatusActions, EditProfileActions, UserActions} from '../../redux';
import {isEqual} from 'lodash';
import {InstagramService, SpotifyService, UserService} from '../../services';
import auth from '@react-native-firebase/auth';

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

const EdiScreen: React.FC<NavigationProps> = ({navigation}) => {
  const state = useSelector((state: TYPES.AppState) => state.editUserReducer);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 300); // adjust the time as per your requirement
  }, []);

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
    try{
      setLoading(true)
      const result = await UserService.updateProfile(state)
      setLoading(false)
      console.log(result)
      //dispatch(UserActions.setUserProfile(state.uid, result))

    } catch(error) {
      console.log(error)
    }
  };

  return (
    <KeyboardAvoidingViewWrapper>
      <SafeContainer>
        {loading && <ThreeDotsLoader modalBackground={{backgroundColor:"white"}}/>}
        <EditProfileHeader
          onBackPress={handleBackPress}
          leftIconText="Edit"
        />

        <BiographySection state={state} dispatch={dispatch} />

        <BasicInformation state={state} dispatch={dispatch} />
        <HeightSection state={state} dispatch={dispatch} />

        <AdditionalInformation state={state} dispatch={dispatch} />

        <PicturesSection state={state} dispatch={dispatch} />

        <View style={styles.section}>
          <Text style={styles.section_header}>Connected account</Text>
          <Text style={[styles.section_subHeader, {marginBottom: 15}]}>Showcase your instagram pictures and artists you enjoy listening to.</Text>
        <SpotifySection
          state={state}
          dispatch={dispatch}
          navigation={navigation}
        />
        <InstagramSection
          state={state}
          dispatch={dispatch}
          navigation={navigation}
        />
        </View>
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
            marginVertical: 10,
          }}>
          <View
            style={{flexDirection: 'row', alignItems: 'center', flexGrow: 1}}>
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
          state.gender?.specific
            ? state.gender.specific
            : state.gender?.general
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
          state.sexualOrientation &&
          state.sexualOrientation.length !== 0
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

const AdditionalInformation = ({state, dispatch}: SectionProps) => {
  const [result, setResult] = useState<any>(null);
  const onPress = (text: string) => {
    let result = questionsList.find(item => item.question.includes(text));
    setResult(result);
    dispatch(EditProfileActions.updateUserProfile('modalVisible', true));
  };

  return (
    <View style={styles.section}>
      <Text style={styles.section_header}>Additional information</Text>
      <Text style={[styles.section_subHeader, {paddingBottom: 10}]}>
        Make your adjustments here, and let others know more about youself
      </Text>
      {state.additionalInformation.map(
        (
          field: {question: string; icon: string; answer: string},
          index: number,
        ) => (
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
      )}
      {result && (
        <ModalSelection state={state} dispatch={dispatch} data={result} />
      )}
    </View>
  );
};

const HeightSection = ({state, dispatch}: SectionProps) => {
  const [feets, setFeets] = useState(
    state?.height?.feets ? state?.height?.feets.toString : '',
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
      if (!feets) return;
      const feetToInt = parseInt(feets);
      if (feetToInt < 3 || feetToInt > 7 || !feetToInt) {
        setShowFeetError(true);
      }else{
        dispatch(
          EditProfileActions.updateUserProfile('height', {
            feets: Number(feets),
            inches: state?.height?.inches,
          }),
        );
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
      if (inchesToInt < 0 || inchesToInt > 11 || !inchesToInt) {
        setShowInchesError(true);
      }else{
        dispatch(
          EditProfileActions.updateUserProfile('height', {
            feets: state?.height?.feets,
            inches: Number(inches),
          }),
        );
      }
    } catch {
      setShowInchesError(true);
    }
  };

  useEffect(() => setShowFeetError(false), [feets]);
  useEffect(() => setShowInchesError(false), [inches]);

  const handleSave = () => {
    if (!showFeetError && !showInchesError) {
      dispatch(
        EditProfileActions.updateUserProfile('height', {
          feets: Number(feets),
          inches: Number(inches),
        }),
      );
    }
  };

  useEffect(() => {

  }, [showFeetError, ])

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
            value={feets}
            onChangeText={text => setFeets(text)}
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

  const [isAlertVisible, setAlertVisible] = useState(false);
  const {handleCameraButtonPress, handleGalleryButtonPress} = useImagePicker();
  const imageToBeChangedRef = useRef<number>()

  const picturesWidth = [
    (sectionWidth / 3) * 2,
    ...Array(5).fill(sectionWidth / 3),
  ];

  const handleImageSelection = async (getImage: () => Promise<string | undefined>) => {
    setAlertVisible(false);
    const result = await getImage();


    if (result) {
      setPictures(prevState => {
        const newState = [...prevState]
        if(imageToBeChangedRef.current != null) newState[imageToBeChangedRef.current] = result
        return newState
      })
    }
  }
  
const handleAlertClose = () => {
setAlertVisible(false);
};


  const PictureField = ({
    picture,
    idx,
  }: {
    picture?: string | null;
    idx: number;
  }) => {

    return (
      <LongPressGestureHandler
        minDurationMs={100}
        onActivated={() => {
          setAlertVisible(true)
          imageToBeChangedRef.current = idx
          }}>
        <View
          style={ {justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: PALETTE.LIGHT200,
          borderRadius: BORDER_RADIUS.large,
          width: picturesWidth[idx],
          height: picturesWidth[idx],
          marginBottom: 5,
          marginRight:
            idx === 3 || idx === 4
              ? 5
              : idx === 0
              ? 10
              : 0,}}>
              { picture ? (
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
                        paddingHorizontal:
                          idx === 0 ? 10 : 0,
                      }}>
                      {idx === 0
                        ? 'main'
                        : idx + 1}
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
  };


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
        <PictureField
          picture={pictures[0]}
          idx={0}
        />
        <View style={{flexDirection: 'column'}}>
          <PictureField
            picture={pictures[1]}
            idx={1}
          />
          <PictureField
            picture={pictures[2]}
            idx={2}
          />
        </View>
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {[...Array(3)].map((_, index) => (
            <React.Fragment key={index + 3}>
              <PictureField
                picture={pictures[index + 3]}
                idx={index + 3}
              />
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
};

const ModalSelection = ({state, dispatch, data}: ModalSelectionProps) => {
  const field = useMemo(() => {
    return state.additionalInformation?.find((field: any) =>
      field.question.includes(data.question),
    );
  }, [data.question, state.additionalInformation]);

  const [selectedAnswer, setSelectedAnswer] = useState<
    null | undefined | string
  >(null);

  const onPress = () => {
    const question = state.additionalInformation?.find((field: any) =>
      field.question.includes(data.question),
    );

    if (question && selectedAnswer) {
      question.answer = selectedAnswer;
    }

    dispatch(EditProfileActions.updateUserProfile('modalVisible', false));
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
      onRequestClose={() =>
        dispatch(EditProfileActions.updateUserProfile('modalVisible', false))
      }>
      <Pressable
        style={{flex: 1}}
        onPress={() =>
          dispatch(EditProfileActions.updateUserProfile('modalVisible', false))
        }>
        <View style={modalSelectionStyles.flexEnd}>
          <Pressable
            style={modalSelectionStyles.container}
            onPress={e => e.stopPropagation()}>
            <View style={modalSelectionStyles.iconsContainer}>
              <View
                onStartShouldSetResponder={() => true}
                onResponderRelease={() =>
                  dispatch(
                    EditProfileActions.updateUserProfile('modalVisible', false),
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

const SpotifySection: React.FC<SectionProps & NavigationProps> = ({
  state,
  dispatch,
  navigation,
}) => {
  const [artists, setArtists] = useState<any>(
    state?.spotify?.artists ? state.spotify.artists : Array(10).fill(null),
  );
  
  const authCodeRef = useRef<string>('');
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(
    state.spotify?.isConnected ? true : false,
  );

 const [showWebView, setShowWebView] = useState(false);

  const handleFetchArtists = async () => {
    setLoading(true);

    if (isConnected) {
      await SpotifyService()
        .disconnectFromSpotify(state.uid)
        .catch(e => console.log(e))
        .then(result => {
          if (result.type === 'success') setIsConnected(false);
        });
      setArtists(Array(10).fill(null));
      authCodeRef.current = '';
    } else {
      setShowWebView(true);
      await waitForAuthCode();
      await SpotifyService()
        .authenticateAndFetchSpotify(
          state.uid,
          authCodeRef.current,
        )
        .then(result => {
          if (result.type === 'success') {
            setIsConnected(true);
            setArtists(result.artists);
          }
        })
        .catch(e => console.log(e));
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

const InstagramSection: React.FC<SectionProps & NavigationProps> = ({
  state,
  dispatch,
  navigation,
}) => {
  const [images, setImages] = useState<any>(state?.instagram?.images ? state.instagram.images : Array(10).fill(null),);
  const authCodeRef = useRef<string>('');
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(
    state.instagram?.isConnected ? true : false,
  );
  const [showWebView, setShowWebView] = useState(false);

  const handleFetchImages = async () => {
    setLoading(true);

    if (isConnected) {
      await InstagramService()
        .disconnectFromInstagram(state.uid)
        .catch(e => console.log(e))
        .then(result => {
          if (result.type === 'success') setIsConnected(false);
        });
      setImages(Array(10).fill(null));
      authCodeRef.current = '';
    } else {
      setShowWebView(true);
      await waitForAuthCode();
      await InstagramService()
        .authenticateAndFetchInstagram(
          state.uid,
          authCodeRef.current,
        )
        .then(result => {
          if (result.type === 'success') {
            setIsConnected(true);
            setImages(result.images);
          }
        })
        .catch(e => console.log(e));
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
