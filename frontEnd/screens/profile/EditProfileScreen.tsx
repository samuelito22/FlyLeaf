import {View, Text, Image, StyleSheet, TextInput, ViewStyle, ScrollView} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Button,
  EditProfileHeader,
  KeyboardAvoidingViewWrapper,
  OAuth2WebView,
  SafeContainer,
  UploadSelectionAlert,
} from '../../components';
import {useSelector} from 'react-redux';
import {
  BORDER_RADIUS,
  PALETTE,
  THEME_COLORS,
  TYPES,
  themeText,
} from '../../constants';
import {LongPressGestureHandler} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {icons} from '../../assets';
import {useDispatch, useImagePicker} from '../../utils/hooks';
import {TouchableRipple} from 'react-native-paper';
import { EditProfileActions } from '../../redux';
import InterestScreen from '../auth/register/InterestScreen';
import { InstagramService, SpotifyService } from '../../services';

interface CallToActionProps {
  question: string;
  answer: string | undefined;
  icon: string;
  onPress: () => void;
}


const HeightSection = React.memo(({ height, dispatch }: { height: { feets: string, inches: string } | undefined, dispatch: React.Dispatch<TYPES.AppAction> }) => {
  const initialState = {
    feets: height?.feets || '',
    inches: height?.inches || '',
    active: { feet: 0, inches: 0 },
    showFeetError: false,
    showInchesError: false,
  };

  const [heightState, setHeightState] = useState(initialState);

  const validateValue = (value: string, min: number, max: number) => {
    const intVal = parseInt(value);
    return !isNaN(intVal) && intVal >= min && intVal <= max;
  };

  const onBlurHandler = (type: 'feets' | 'inches', min: number, max: number) => {
    setHeightState(prevState => {
      // Check if the prevState[type] is empty, if so, avoid the error
      if (prevState[type] === "") {
        return {
          ...prevState,
          active: { ...prevState.active, [type]: 0 },
          [`show${type.charAt(0).toUpperCase() + type.slice(1)}Error`]: false
        };
      }

      const hasError = !validateValue(prevState[type], min, max);
      return {
        ...prevState,
        active: { ...prevState.active, [type]: 0 },
        [`show${type.charAt(0).toUpperCase() + type.slice(1)}Error`]: hasError
      };
    });
};


  useEffect(() => {
    if (validateValue(heightState.feets, 3, 7) && validateValue(heightState.inches, 0, 11)) {
      dispatch(EditProfileActions.updateUserProfile('height', heightState));
    } else {
      dispatch(EditProfileActions.updateUserProfile('height', undefined));
    }
  }, [heightState.feets, heightState.inches, dispatch]);

  return (
    <View style={styles.section}>
      <Text style={styles.section_header}>Height</Text>
      <View style={{flexDirection:'row'}}>
      {(['feets', 'inches'] as Array<'feets' | 'inches'>).map((type, index) => (
    <View key={index} style={styles.section_height}>
        <Text style={styles.section_height_header}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
        <TextInput
            onFocus={() => setHeightState(prevState => ({ ...prevState, active: { ...prevState.active, [type === 'feets' ? 'feet' : 'inches']: 1 } }))}
            onBlur={() => onBlurHandler(type, type === 'feets' ? 3 : 0, type === 'feets' ? 7 : 11)}
            style={[
                styles.section_height_boxInput,
                {
                    borderColor: heightState.active[type as 'feet' | 'inches'] ? THEME_COLORS.primary : THEME_COLORS.tertiary,
                },
            ]}
            value={heightState[type as 'feets' | 'inches']}
            onChangeText={text => setHeightState(prevState => ({ ...prevState, [type]: text }))}
            placeholder={type === 'feets' ? 'ft' : 'in'}
            placeholderTextColor={THEME_COLORS.tertiary}
            keyboardType="number-pad"
        />
        {heightState[`show${type.charAt(0).toUpperCase() + type.slice(1)}Error` as 'showFeetError' | 'showInchesError'] && (
            <Text style={styles.section_height_error}>
                {`Please enter a number between ${type === 'feets' ? 3 : 0} and ${type === 'feets' ? 7 : 11}`}
            </Text>
        )}
    </View>
))}
    </View>
  </View>
  );
});

const BiographySection = React.memo(({bio, dispatch}: { bio: string | undefined, dispatch: React.Dispatch<TYPES.AppAction> }) => {
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
        value={bio || ''}
        placeholder="About me"
        placeholderTextColor={THEME_COLORS.tertiary}
        multiline={true}
        onFocus={() => setActive(1)}
        onBlur={() => setActive(0)}
      />
    </View>
  );
});

const PicturesSection = React.memo(({ pictures, dispatch }: { pictures: TYPES.UserPicture[] | undefined; dispatch: React.Dispatch<TYPES.AppAction> }) => {
  // Your component logic here
  return (
    <View style={styles.section}>
          <Text style={styles.section_header}>My pictures</Text>
          <Text style={styles.section_subHeader}>Add clear pictures of yourself. Note they will be blurred publicly.</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, paddingTop: 10, overflow: 'hidden' }}>
    <PictureField style={{ flex: 2 }} picture={pictures ? pictures[0] : undefined} idx={0} />

    <View style={{ flexDirection: 'column', flex: 1 }}>
        <PictureField style={{ flex: 1 }} picture={pictures ? pictures[1] : undefined} idx={1} />
        <PictureField style={{ flex: 1 }} picture={pictures ? pictures[2] : undefined} idx={2} />
    </View>
</View>
<View style={{ flexDirection: 'row', flex: 1, paddingHorizontal: 20, paddingTop: 5 }}>
    {[...Array(3)].map((_, index) => (
        <PictureField key={index + 3} style={{ flex: 1 }} picture={pictures ? pictures[index + 3] : undefined} idx={index + 3} />
    ))}
</View>

    </View>
  );
});

const PictureField = React.memo(
  ({picture, idx, style}: {picture?: TYPES.UserPicture | undefined; idx: number; style: ViewStyle}) => {
    return (

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: PALETTE.LIGHT200,
            borderRadius: BORDER_RADIUS.large,
            ...style,
            aspectRatio: 1,
            marginBottom: 5,
            marginRight: idx === 3 || idx === 4 ? 5 : idx === 0 ? 10 : 0,
          }}>
          {picture ? (
            <React.Fragment>
              <Animated.Image
                source={{uri: picture.url}}
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
    );
  },
);

const CallToAction: React.FC<CallToActionProps> = React.memo(
  ({question, answer, icon, onPress}) => {
    return (
      <TouchableRipple
        style={styles.section_withBorder}
        onPress={onPress}
        rippleColor={PALETTE.GHOSTWHITE}>
        <View style={styles.callToActionContainer}>
          <View style={styles.callToActionInnerContainer}>
            <Image
              source={{uri: icon}}
              style={styles.section_withBorder_icon}
              resizeMode="contain"
            />
            <Text style={styles.section_withBorder_header}>{question}</Text>
          </View>
          <Text
            style={[styles.paragraphStyle, styles.section_withBorder_paragraph]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {answer}
          </Text>
        </View>
      </TouchableRipple>
    );
  },
);
const EditProfileScreen = () => {
  const {userProfile} = useSelector(
    (state: TYPES.AppState) => state.editUserReducer,
  );
  const { questionsList} =
    useSelector((state: TYPES.AppState) => state.usersReducer);
  const dispatch = useDispatch();

  return (
    <KeyboardAvoidingViewWrapper>
      <SafeContainer>
        <EditProfileHeader onBackPress={() => {}} leftIconText="Edit" />

        {/**Pictures */}
        <PicturesSection pictures={userProfile?.pictures} dispatch={dispatch}/>

        {/**Biography */}
        <BiographySection bio={userProfile?.bio} dispatch={dispatch}/>
        

        {/** Basic */}
        <View style={styles.section}>
          <Text style={styles.section_header}>Basic information</Text>
          {questionsList
            ?.filter(item => item.type === 'Basic')
            .map((field, index) => {
              if (field.shortForm === 'Orientation') {
                return null;
              }

              let answer: string;
              if (field.shortForm === 'Goal') {
                answer = userProfile?.relationshipGoal || 'Add';
              } else {
                answer =
                  userProfile?.additionalInformation.find(
                    item => item.questionShortForm === field.shortForm,
                  )?.answer || 'Add';
              }

              return (
                <CallToAction
                  key={index}
                  question={field.shortForm}
                  answer={answer}
                  icon={field.icon}
                  onPress={() => {}}
                />
              );
            })}
          <CallToAction
            question="Gender"
            answer={`${userProfile?.gender.primary}${userProfile?.gender.secondary && ' ('+userProfile.gender.secondary+')'}`}
            icon={'https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/gender.png'}
            onPress={() => {}}
          />
          <CallToAction
            question="Job Title"
            answer={userProfile?.profession?.jobTitle || 'Add'}
            icon={'https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/job.png'}
            onPress={() => {}}
          />
          <CallToAction
            question="Employer"
            answer={userProfile?.profession?.employer || 'Add'}
            icon={'https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/company.png'}
            onPress={() => {}}
          />
        </View>

        <HeightSection height={userProfile?.height} dispatch={dispatch}/>

        {/**Languages */}
        <View style={styles.section}>
          <Text style={styles.section_header}>Languages I know</Text>
          <View style={styles.itemListContainer}>
          {userProfile?.languages?.length != 0 ? userProfile?.languages?.map((language, index) => (
            <View key={index} style={styles.itemContainer}>
            <Image source={{uri: "https://flyleaf-icons.s3.eu-west-2.amazonaws.com/questions/language.png"}} style={styles.itemIcon}/>
              <Text style={styles.itemText}>{language.name}</Text>
            </View>
          )) : <Text style={styles.itemAlternativeText}>Press to add languages that you know.</Text>}
          <TouchableRipple rippleColor={PALETTE.GHOSTWHITE} onPress={() => {}} style={{position:'absolute', top:0,bottom:0, left:0, right:0}}><></></TouchableRipple>
          </View>
        </View>

        {/**Interests */}
        <View style={styles.section}>
          <Text style={styles.section_header}>My interests</Text>
          <View style={styles.itemListContainer} >
          {userProfile?.interests?.length != 0 ? userProfile?.interests?.map((interest, index) => (
            <View key={index} style={styles.itemContainer}>
            <Image source={{uri: interest.icon}} style={styles.itemIcon}/>
              <Text style={styles.itemText}>{interest.name}</Text>
            </View>
          ))  : <Text style={styles.itemAlternativeText}>Press to add your interests.</Text>}
          <TouchableRipple rippleColor={PALETTE.GHOSTWHITE} onPress={() => {}} style={{position:'absolute', top:0,bottom:0, left:0, right:0}}><></></TouchableRipple>
          </View>
        </View>

         {/**Seeking */}
         <View style={styles.section}>
          <Text style={styles.section_header}>My gender preferences</Text>
          <View style={styles.itemListContainer} >
          {userProfile?.seeking?.length != 0 ? userProfile?.seeking?.map((gender, index) => (
            <View key={index} style={styles.itemContainer}>
              <Text style={styles.itemText}>{gender}</Text>
            </View>
          ))  : <Text style={styles.itemAlternativeText}>Press to add your gender preferences.</Text>}
          <TouchableRipple rippleColor={PALETTE.GHOSTWHITE} onPress={() => {}} style={{position:'absolute', top:0,bottom:0, left:0, right:0}}><></></TouchableRipple>
          </View>
        </View>

        {/** Advanced */}
        <View style={styles.section}>
          <Text style={styles.section_header}>Advanced information</Text>
          {questionsList
            ?.filter(item => item.type === 'Advanced')
            .map((field, index) => {
              const answer =
                userProfile?.additionalInformation.find(
                  item => item.questionShortForm === field.shortForm,
                )?.answer || 'Add';

              return (
                <CallToAction
                  key={index}
                  question={field.shortForm}
                  answer={answer}
                  icon={field.icon}
                  onPress={() => {}}
                />
              );
            })}
        </View>
        <View style={styles.section}>
          <Text style={styles.section_header}>Connected account</Text>
          <Text style={[styles.section_subHeader, {marginBottom: 15}]}>
            Showcase your instagram pictures and artists you enjoy listening to.
          </Text>
          <SpotifySection state={{artists: userProfile?.spotify, _id: userProfile?._id}} dispatch={dispatch} />
          <InstagramSection state={{posts: userProfile?.instagram, _id: userProfile?._id}} dispatch={dispatch} />
        </View>
      </SafeContainer>
    </KeyboardAvoidingViewWrapper>
  );
};

const SpotifySection = ({state, dispatch}:{state:{artists: TYPES.SpotifyArtist[]| undefined, _id:string | undefined}, dispatch: React.Dispatch<TYPES.AppAction>}) => {
  const [artists, setArtists] = useState<any>(Array(10).fill(null))
  useEffect(() => {
    if(state.artists){
    setArtists(state.artists)
    setIsConnected(true)
    }

  }, [state.artists])

  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(
    state?.artists ? true : false,
  );

  const handleFetchArtists = async () => {
    setLoading(true);

    if(state._id){
    if (isConnected) {
      await SpotifyService().disconnectFromSpotify(state._id).then(result => {
        if(result?.type === "success"){
          setArtists(Array(10).fill(null));
          setIsConnected(false)
        }
      })
     
    } else {
      const authResult = await SpotifyService().spotifyAuth();
      if (authResult) {
        await SpotifyService().authenticateAndFetchSpotify(state._id, authResult.accessToken, authResult.refreshToken).then(result => {
          if(result.type === "success"){
            setArtists(result.artists)
            setIsConnected(true)
          }
        })
      }
    }
  }

    setLoading(false);
  };

  return(
  <View style={spotifyStyles.mainContainer}>
      <View style={spotifyStyles.spotifyContainer}>
        <View style={spotifyStyles.headerRow}>
          <Image source={icons.spotify} style={spotifyStyles.spotifyIcon} resizeMode="contain" />
          <Text style={spotifyStyles.headerText}>
            {isConnected ? 'Connected to spotify' : 'Connect to spotify'}
          </Text>
        </View>
        <Text style={spotifyStyles.descriptionText}>
          At FlyLeaf, we use your top artists to connect you with like-minded
          music enthusiasts, enhancing conversations and personalizing your
          experience.
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={spotifyStyles.artistScrollView}>
          {artists.map((artist: any, index: number) => (
            <View key={index} style={spotifyStyles.artistContainer}>
              <View style={spotifyStyles.artistImageContainer}>
                {artist && (
                  <Image
                    source={{ uri: artist.images[2].url }}
                    style={spotifyStyles.artistImage}
                    resizeMode="cover"
                  />
                )}
              </View>
              {artist && <Text style={spotifyStyles.artistName}>{artist.name}</Text>}
            </View>
          ))}
        </ScrollView>
        <Button.LightButton onPress={handleFetchArtists} style={spotifyStyles.connectButton}>
          {isConnected ? 'Disconnect' : 'Connect now'}
        </Button.LightButton>
        {loading && <View style={spotifyStyles.loadingOverlay} />}
      </View>
    </View>
  )
};

const InstagramSection = ({state, dispatch}:{state:{posts: TYPES.InstagramPost[]| undefined, _id:string | undefined}, dispatch: React.Dispatch<TYPES.AppAction>}) => {
  const [posts, setPosts] = useState<any>(Array(10).fill(null))
  const authCodeRef = useRef<string | null>(null);
  useEffect(() => {
    if(state.posts){
      setPosts(state.posts)
      setIsConnected(true)
    }
  }, [state.posts])

  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(
    state?.posts ? true : false,
  );
  const [showWebView, setShowWebView] = useState(false);


  const handleFetchImages = async () => {
    setLoading(true);

    if(state._id){
    if (isConnected) {
      await InstagramService().disconnectFromInstagram(state._id).then(result => {
        if(result?.type === "success"){
          setPosts(Array(10).fill(null));
          setIsConnected(false)
        }
      })
     
    } else {
      setShowWebView(true);
      await waitForAuthCode();
      if (authCodeRef.current) {
        await InstagramService().authenticateAndFetchInstagram(state._id, authCodeRef.current).then(result => {
          if(result.type === "success"){
            setPosts(result.images)
            setIsConnected(true)
            authCodeRef.current = null
          }
        })
      }
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
        if (authCodeRef.current || showWebView == false) {
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
    <View style={instagramStyles.container}>
       {showWebView && (
        <OAuth2WebView
          isVisible={showWebView}
          onClose={() => setShowWebView(false)}
          config={config}
          onCodeReceived={code => handleInstagramAuth(code)}
        />
      )}
      <View style={instagramStyles.innerContainer}>
        <View style={instagramStyles.row}>
          <Image
            source={icons.instagram}
            style={instagramStyles.icon}
            resizeMode="contain"
          />
          <Text style={instagramStyles.statusText}>
            {isConnected ? 'Connected to instagram' : 'Connect to instagram'}
          </Text>
        </View>
        <Text style={instagramStyles.description}>
          Your latest posts will be visible to others, but your username will
          not be visible.
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={instagramStyles.scrollContainer}>
          {posts?.map((image: any, index: number) => (
            <View key={index} style={instagramStyles.postContainer}>
              <View style={instagramStyles.imageContainer}>
                {image && (
                  <Image
                    source={{ uri: image.url }}
                    style={instagramStyles.image}
                    resizeMode="cover"
                  />
                )}
              </View>
            </View>
          ))}
        </ScrollView>
        <Button.DarkButton
          onPress={handleFetchImages}
          style={instagramStyles.buttonContainer}>
          {isConnected ? 'Disconnect' : 'Connect now'}
        </Button.DarkButton>
        {loading && <View style={instagramStyles.loadingOverlay} />}
      </View>
      
    </View>
);

};


export default EditProfileScreen;

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
  itemListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: PALETTE.GHOSTWHITE,
    margin: 10,
    borderRadius: 15,
    minHeight: 50,
    alignItems: 'center',
    padding: 15,
    overflow:'hidden'
  },
  itemContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: THEME_COLORS.tertiary,
    borderRadius: 15,
    marginRight: 15,  // Adding some right margin for space between items
    marginBottom: 10, // For vertical spacing between items
  },
  itemIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    alignSelf: 'center',
  },
  itemText: {
    ...themeText.bodyRegularFive,
    color: 'black',

  },
  itemAlternativeText:{
    ...themeText.bodyRegularSix,
    color: THEME_COLORS.tertiary,

  }
});


const spotifyStyles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  spotifyContainer: {
    backgroundColor: 'black',
    width: '100%',
    borderRadius: 15,
    flexDirection: 'column',
    padding: 15,
    overflow: 'hidden'
  },
  headerRow: {
    flexDirection: 'row',
    maxWidth: 250,
    width: '100%',
    alignItems: 'center',
  },
  spotifyIcon: {
    height: 30,
    width: 30,
    marginRight: 10,
  },
  headerText: {
    ...themeText.bodyMediumFive,
    color: 'white',
  },
  descriptionText: {
    marginTop: 10,
    color: PALETTE.GRAY300,
    ...themeText.bodyRegularSeven,
  },
  artistScrollView: {
    marginVertical: 10,
  },
  artistContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: 60,
    marginRight: 15,
  },
  artistImageContainer: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(128, 128, 128, 0.5)',
    borderRadius: 10,
  },
  artistImage: {
    width: '100%',
    height: '100%',
  },
  artistName: {
    color: 'white',
    ...themeText.bodyRegularSeven,
    textAlign: 'center',
    marginTop: 5,
  },
  connectButton: {
    marginVertical: 10,
  },
  loadingOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.3)',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

const instagramStyles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  innerContainer: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 15,
    flexDirection: 'column',
    padding: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: PALETTE.LIGHT100,
  },
  row: {
    flexDirection: 'row',
    maxWidth: 250,
    width: '100%',
    alignItems: 'center',
  },
  icon: {
    height: 30,
    width: 30,
    marginRight: 10,
  },
  statusText: {
    ...themeText.bodyMediumFive,
    color: THEME_COLORS.dark,
  },
  description: {
    marginTop: 10,
    color: THEME_COLORS.dark,
    ...themeText.bodyRegularSeven,
  },
  scrollContainer: {
    marginVertical: 10,
  },
  postContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: 60,
    marginRight: 15,
    overflow: 'hidden',
  },
  imageContainer: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(1, 1, 1, 0.05)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    marginVertical: 10,
  },
  loadingOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.1)',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
})
