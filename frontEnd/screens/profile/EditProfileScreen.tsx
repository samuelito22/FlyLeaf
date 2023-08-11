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
  Dimensions
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Button,
  EditProfileHeader,
  KeyboardAvoidingViewWrapper,
  LoadingSpinner,
  OAuth2WebView,
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
  FlatList,
  ScrollView,
} from 'react-native-gesture-handler';
import {TouchableRipple} from 'react-native-paper';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {useDispatch} from '../../utils/hooks';
import {AppStatusActions, EditProfileActions} from '../../redux';
import {isEqual} from 'lodash';
import { SpotifyService } from '../../services';
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
  state: any;
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

        <SpotifySection state={state} dispatch={dispatch} />
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
            marginVertical: 10
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center', flexGrow: 1}}>
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
          state.profile.gender.specific
            ? state.profile.gender.specific
            : state.profile.gender.general
        }
        icon={icons.gender}
        onPress={() => navigation.navigate(ROUTES.EDIT_GENDER_SCREEN)}
      />
      <CallToAction
        header="Languages"
        paragraph={
          state.interests.languages && state.interests.languages.length !== 0
            ? state.interests.languages.join(', ')
            : 'Add'
        }
        icon={icons.languages}
        onPress={() => navigation.navigate(ROUTES.EDIT_LANGUAGE_SCREEN)}
      />
      <CallToAction
        header="Sexual Orientation"
        paragraph={
          state.preferences.sexualOrientation && state.preferences.sexualOrientation.length !== 0
            ? state.preferences.sexualOrientation.join(', ')
            : 'Add'
        }
        icon={icons.sexualOrientation}
        onPress={() =>
          navigation.navigate(ROUTES.EDIT_SEXUAL_ORIENTATION_SCREEN)
        }
      />
      <CallToAction
        header="Job Title"
        paragraph={state.profile.jobTitle ? state.profile.jobTitle : 'Add'}
        icon={icons.job}
        onPress={() => navigation.navigate(ROUTES.EDIT_LANGUAGE_SCREEN)}
      />
      <CallToAction
        header="Company"
        paragraph={state.profile.company ? state.profile.company : 'Add'}
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
    dispatch(EditProfileActions.updateUserProfile('modalVisible',true));
  };

  return (
    <View style={styles.section}>
      <Text style={styles.section_header}>Additional information</Text>
      <Text style={[styles.section_subHeader, {paddingBottom: 10}]}>
        Make your adjustments here, and let others know more about youself
      </Text>
      {state.interests.additionalInformation?.map((field:{question:string, icon: string, answer:string}, index:number) => (
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
    state?.height?.feet ? state?.profile.height?.feet.toString : '',
  );
  const [inches, setInches] = useState(
    state?.height?.inches ? state?.profile.height?.inches.toString : '',
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
      if (inchesToInt < 0 || inchesToInt > 11 || !inchesToInt) {
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
      dispatch(EditProfileActions.updateUserProfile('height', {feet: Number(feet), inches: Number(inches)}))
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
  const [pictures, setPictures] = useState<(string)[]>(
    state.profile.pictures ? state.profile.pictures : [],
  );
  const [index, setIndex] = useState(0);
  const [sectionWidth, setSectionWidth] = useState(0);
  const [viewFullPic, setViewFullPic] = useState(false)
  const flatListRef = useRef<FlatList>(null);

  const onLayout = (event: TYPES.LayoutChangeEvent) => {
    const {width} = event.nativeEvent.layout;
    setSectionWidth(width); //section width -40 padding and - 10 space per section hence 20
  };

  const scrollX = useRef(new Animated.Value(0)).current
  const handleOnScroll = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: {
            x: scrollX
          }
        }
      }
    ],
    {
      useNativeDriver: false
    }
  );

  const handleOnViewableItemsChanged = useRef(({viewableItems}: {viewableItems:any}) => {
    setIndex(viewableItems[viewableItems.length-1].index);
  }).current;

 

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 0,
  }).current;

  
  
  const SlideItem = ({ item }: { item: string | null | undefined }) => {
    if (!item) return null;
    
    return (
      <View style={{width:sectionWidth - 40, height:300 }}>
        <Image 
          source={{ uri: item }} 
          resizeMode='cover' 
          style={{ width:"100%", height:"100%"}} 
        />
      </View>
    );
  }
  
  const Pagination = ({ data, scrollX, index }: { data: (string | null | undefined)[], scrollX: Animated.Value, index:number }) => {
    return (
    <View style={{position:"absolute", bottom:10, flexDirection:'row' ,width:"100%", justifyContent:"center", alignItems:"center"}}>
      {data?.map((_,idx) => {
        const width = sectionWidth - 40
        const inputRange = [(idx-1) * width, idx * width, (idx+1)*width]
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8,16,8],
          extrapolate: 'clamp'
        })

        const backgroundColor = scrollX.interpolate({
          inputRange,
          outputRange: ['white', THEME_COLORS.dark, 'white'],
          extrapolate: 'clamp',
        });

        return (<Animated.View key={idx} style={{borderRadius: 4, width:dotWidth, height:4, marginHorizontal:3, backgroundColor:backgroundColor}}/>)
      })}
    </View>
    )

  }

  const DeleteSlide = () => {
    const ICON_WIDTH = 20

    const handleDelete = () => {
      let newIndex;

    if (index === pictures.length - 1 && index !== 0) {
        // If deleting the last item but not the only item
        newIndex = index - 1;
    } else if (index < pictures.length - 1) {
        // If deleting an item in the middle
        newIndex = index;
    } else {
        // If there's only one item or deleting the first item
        newIndex = 0;
    }

      setPictures(prevState => {
        const newState = [...prevState];
        newState.splice(index, 1);
        return newState;
      });


      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({ index: newIndex, animated: true });
      }

    };
 
    return (
      <Button.ButtonImage onPress={handleDelete} height={ICON_WIDTH} width={ICON_WIDTH} tintColor='white' imgUrl={icons.bin} contentContainerStyle={{height:ICON_WIDTH*2, width: ICON_WIDTH*2, borderRadius:BORDER_RADIUS.medium, backgroundColor:"rgba(0, 0, 0, 0.3)", position:"absolute", top: 10, left:10}}/>
    )
  }

  const AddSlide = () => {
    const ICON_WIDTH = 20

    const handleDelete = () => {
    
    }
    return (
      <Button.ButtonImage onPress={handleDelete} height={ICON_WIDTH} width={ICON_WIDTH} tintColor='white' imgUrl={icons.addImage} contentContainerStyle={{height:ICON_WIDTH*2, width: ICON_WIDTH*2, borderRadius:BORDER_RADIUS.medium, backgroundColor:"rgba(0, 0, 0, 0.3)", position:"absolute", top: 10, right:10}}/>
    )
  }

  const ViewSlide = () => {
    const ICON_WIDTH = 20

    const handleView = () => {
      setViewFullPic(true)
    }
    return (
      <Button.ButtonImage onPress={handleView} height={ICON_WIDTH * 1.3} width={ICON_WIDTH*1.3} tintColor='white' imgUrl={icons.eye} contentContainerStyle={{height:ICON_WIDTH*2, width: ICON_WIDTH*2, borderRadius:BORDER_RADIUS.medium, backgroundColor:"rgba(0, 0, 0, 0.3)", position:"absolute", bottom: 10, left:10}}/>
    )
  }

  const ViewFullSlide = () => {
    const height = Dimensions.get('window').width * 1.3
    return (
      <Modal
        transparent={true}
        visible={viewFullPic}
        onRequestClose={() => setViewFullPic(false)}>
        <Pressable
          style={{flex: 1}}
          onPress={() => setViewFullPic(false)}>
          <View style={[modalSelectionStyles.flexEnd, {justifyContent:"center", backgroundColor:"rgba(0, 0, 0, 0.9)"}]}>
            <Pressable
              style={{ width:"100%"}}
              onPress={e => e.stopPropagation()}>
                {pictures &&
                 <Image 
                  source={{ uri: pictures[index] }} 
                  resizeMode='contain' 
                  style={{ width:"100%", height:height}} 
                />}
                </Pressable>
              </View>
            </Pressable>
          </Modal>
    )
  }

  return (
    <View style={styles.section} onLayout={onLayout}>
      <Text style={styles.section_header}>Pictures</Text>
      <Text style={styles.section_subHeader}>
        Pick the best pictures of yourself
      </Text>
      <View style={{borderRadius: BORDER_RADIUS.large, overflow:"hidden", marginHorizontal:20, marginTop:10, backgroundColor:PALETTE.LIGHT200, width:sectionWidth - 40, height:300}}>
      <FlatList 
      ref={flatListRef}
      data={pictures} 
      renderItem={({item}) => <SlideItem item={item}/>}
      horizontal
      pagingEnabled
      snapToAlignment='center'
      overScrollMode='never'
      showsHorizontalScrollIndicator={false}
      onScroll={handleOnScroll}
      onViewableItemsChanged={handleOnViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
      {sectionWidth > 0 && <Pagination data={pictures} scrollX={scrollX} index={index}/>}
      {pictures.length > 0 && <DeleteSlide/>}
      {pictures.length !== 6 && <AddSlide/>}
      {pictures.length > 0 && <ViewSlide/>}
      {viewFullPic && <ViewFullSlide/>}
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
        onChangeText={text => dispatch(EditProfileActions.updateUserProfile('bio',text))}
        value={state.profile.bio ?? ''}
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
    return state.interests.additionalInformation?.find((field:any) =>
      field.question.includes(data.question),
    );
  }, [data.question, state.interests.additionalInformation]);

  const [selectedAnswer, setSelectedAnswer] = useState<
    null | undefined | string
  >(null);

  const onPress = () => {
    const question = state.interests.additionalInformation?.find((field:any) =>
      field.question.includes(data.question),
    );

    if (question && selectedAnswer) {
      question.answer = selectedAnswer;
    }

    dispatch(EditProfileActions.updateUserProfile('modalVisible',false))
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
      onRequestClose={() => dispatch(EditProfileActions.updateUserProfile('modalVisible',false))}>
      <Pressable
        style={{flex: 1}}
        onPress={() => dispatch(EditProfileActions.updateUserProfile('modalVisible',false))}>
        <View style={modalSelectionStyles.flexEnd}>
          <Pressable
            style={modalSelectionStyles.container}
            onPress={e => e.stopPropagation()}>
            <View style={modalSelectionStyles.iconsContainer}>
              <View
                onStartShouldSetResponder={() => true}
                onResponderRelease={() => dispatch(EditProfileActions.updateUserProfile('modalVisible',false))}
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

const SpotifySection =  ({state, dispatch}: SectionProps) => {
  const [artists, setArtists] = useState<any>(Array(10).fill(null));
  const authCodeRef = useRef<string>(""); 
  const [showWebView, setShowWebView] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const handleFetchArtists = async () => {
    setLoading(true)
    const controller = new AbortController()
   
   if(state.profile.spotify?.isConnected){
      SpotifyService().disconnectFromSpotify(state.uid,controller.signal).catch(e => console.log(e))
   }else{
    setShowWebView(true)
    await waitForAuthCode();
    SpotifyService().authenticateAndFetchSpotify(state.uid, authCodeRef.current, controller.signal).then((result) => {
      //SpotifyService().fetchTopArtists(result.token, state.profile.spotify.spotify_id, controller.signal)
    })
    
   }

   setLoading(false)
   return controller.abort
  };

  const config = {
    clientId: '5f030af89dcf40e6a2f2cd3b5c8f09ef',
    redirectUrl: 'com.frontend:/callback',
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  };

  const handleSpotifyAuth = async (code:string) => {
    authCodeRef.current = code;
    setShowWebView(false)
  }

  const waitForAuthCode = (): Promise<void> => {
    return new Promise<void>((resolve) => {
      const checkForCode = setInterval(() => {
        if (authCodeRef.current) {
          clearInterval(checkForCode);
          resolve();
        }
      }, 500); // Check every half second
    });
  };
  
  
  
  

  return (
    <View style={{width:"100%", paddingHorizontal:20, marginBottom:20}}>
    <View style={{backgroundColor:"black",width:"100%", borderRadius:15, flexDirection:'column', padding:15, overflow:"hidden"}}>
      <View style={{flexDirection:'row', maxWidth:250, width:"100%", alignItems:'center',}}>
        <Image source={icons.spotify} style={{height:30, width:30, marginRight:10}} resizeMode='contain'/>
        <Text style={{...themeText.bodyMediumFive, color:"white"}}>{state.profile.spotify?.isConnected ? 'Connected to spotify' : 'Connect to spotify'}</Text>
      </View>
      <Text style={{marginTop:10, color:PALETTE.GRAY300, ...themeText.bodyRegularSeven}}>At FlyLeaf, we use your top 5 artists to connect you with like-minded music enthusiasts, enhancing conversations and personalizing your experience.</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{marginVertical:10}}>
    {artists.map((artist:any, index:number) => {
      return(
        <View key={index} style={{width:60, height:60, backgroundColor:'rgba(128, 128, 128, 0.5)', borderRadius:10, marginRight:10}}>

        </View>
      )
    })}
    </ScrollView>
    <Button.LightButton onPress={handleFetchArtists} style={{marginVertical:10}}>{state.profile.spotify?.isConnected ? 'Disconnect' : 'Connect now'}</Button.LightButton>
    {loading && <View style={{position:"absolute", backgroundColor:"rgba(0,0,0,0.3)", borderWidth:1, top:0, left:0, right:0, bottom:0}}/>}
    </View>
    <OAuth2WebView isVisible={showWebView} onCodeReceived={(code) => handleSpotifyAuth(code)} config={config} onClose={() => setShowWebView(false)}/>
    </View>
  );
}

export default EditProfileScreen;
