import {View, ScrollView, Image, Text, StyleSheet, Dimensions} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {PALETTE, ROUTES, THEME_COLORS, TYPES, themeText} from '../../constants';
import {useSelector} from 'react-redux';
import {Button, Loading, ProfilePrivateHeader, SafeContainer} from '../../components';
import {icons, images} from '../../assets';
import {useDispatch} from '../../utils/hooks';
import {EditProfileActions, UserActions} from '../../redux';
import {getAge} from '../../utils/getAge';
import { UserService } from '../../services';
import { TouchableOpacity } from 'react-native-gesture-handler';

const featuresList = [
  {feature: 'Profile Creation', connects: true, premium: true},

  {feature: 'Blurred Image Engagement', connects: true, premium: true},

  {feature: 'Engagement Insights', connects: false, premium: true},
  {feature: 'Unlimited Chat', connects: true, premium: true},
  {feature: 'Ad-free Experience', connects: false, premium: true},
  {feature: 'Notifications', connects: true, premium: true},
  {feature: 'Unlimited Matches', connects: true, premium: true},
  {feature: 'Advanced Search', connects: false, premium: true},
  {
    feature: 'Icebreakers & Conversation Starters',
    connects: false,
    premium: true,
  },
  {feature: 'See Who Liked You', connects: false, premium: true},
  {feature: 'Priority Profile', connects: false, premium: true},
  {feature: 'Standard Search', connects: true, premium: true},

  {feature: 'Faster Image Reveal', connects: false, premium: true},

  {feature: 'Offline Events or Webinars', connects: false, premium: true},
];

const FieldOfTable = React.memo(
  ({
    feature,
    connects,
    premium,
  }: {
    feature: string;
    connects: boolean;
    premium: boolean;
  }) => {
    return (
      <View style={{flexDirection: 'row', minHeight: 60, alignItems: 'center'}}>
        <View style={styles.plansContainer_firstColumn}>
          <Text style={styles.plansContainer_feature}>{feature}</Text>
        </View>
        <View style={styles.plansContainer_restOfColumn}>
          <Image
            source={connects ? images.successIllustration : icons.dash}
            resizeMode="contain"
            style={[
              !connects && {tintColor: THEME_COLORS.tertiary},
              {width: 20, height: 20},
            ]}            
          />
        </View>
        <View style={styles.plansContainer_restOfColumn}>
          <Image
            source={premium ? images.successIllustration : icons.dash}
            resizeMode="contain"
            style={[
              !premium && {tintColor: THEME_COLORS.tertiary},
              {width: 20, height: 20},
            ]}
          />
        </View>
        <View style={styles.plansContainer_restOfColumn}>
          <Image
            source={premium ? images.successIllustration : icons.dash}
            resizeMode="contain"
            style={[
              !premium && {tintColor: THEME_COLORS.tertiary},
              {width: 20, height: 20},
            ]}
          />
        </View>
      </View>
    );
  },
);
const UserProfileScreen = () => {
  const dispatch = useDispatch();
  const currentUserId = useSelector(
    (state: TYPES.AppState) => state.usersReducer.currentUserId,
  );
  const [imageKey, setImageKey] = useState(0);
  const currentUser = useSelector(
    (state: TYPES.AppState) => state.usersReducer.byId[currentUserId as string],
  ) as TYPES.CurrentUser;
  const {genders, interests, questions, languages, relationshipGoals, answers} = useSelector(
    (state: TYPES.AppState) => state.usersReducer,
  );
  const isOnline = useSelector(
    (state: TYPES.AppState) => state.appStatusReducer.isOnline,
  );

  const navigation = useNavigation<NavigationProp<TYPES.RootStackParamList>>();
  const age = getAge(new Date(currentUser?.dateOfBirth));
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = (screenWidth-10) * 0.95;
  const [isLoading, setIsLoading] = useState(false)

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const daySuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };
  const joinedDateObj = new Date(currentUser.createdAt);
  const joinedDate = useMemo(() => {
    return `Joined on ${joinedDateObj.getDate()}${daySuffix(
      joinedDateObj.getDate(),
    )} of ${
      monthNames[joinedDateObj.getMonth()]
    } ${joinedDateObj.getFullYear()}`;
  }, [currentUser.createdAt]);

  const onEditPress = async () => {
    setIsLoading(true);
    
    if (!currentUser) {
      setIsLoading(false);
      return;
    }
  
    // If the required data isn't loaded, attempt to load it
    if (!questions && !languages && !interests && !genders && !answers && !relationshipGoals) {
      try {
        const result = await UserService.getOverviewEn();
        
        if (result.type !== 'success') {
          setIsLoading(false);
          return;  // Exit if result type is not success
        }
    
        dispatch(UserActions.setQuestions(result.questions));
        dispatch(UserActions.setInterests(result.interests));
        dispatch(UserActions.setLanguages(result.languages));
        dispatch(UserActions.setGenders(result.genders));
        dispatch(UserActions.setRelationshipGoals(result.relationshipGoals));
        dispatch(UserActions.setAnswers(result.answers));
  
      } catch (error) {
        console.error("Failed to get overview data:", error);
        setIsLoading(false);
        return;  // Exit on error after logging and setting loading state
      }
    }
    setIsLoading(false);

    // Continue to edit profile screen
    navigation.navigate(ROUTES.EDIT_PROFILE_SCREEN);
    dispatch(EditProfileActions.initUserProfile(currentUser));
    };

    
useEffect(() => {
  if (isOnline) {
      setImageKey(prevKey => prevKey + 1);
  }
}, [isOnline]);
  
  

return (
  <SafeContainer>
    {isLoading && <Loading.ThreeDotsLoader modalBackground={{backgroundColor:'white'}} />}
    <ProfilePrivateHeader />
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Image
          key={imageKey}
          source={{ uri: currentUser.pictures[0].url }}
          style={styles.profilePicture}
        />
        <View style={{ flex: 0.6 }}>
          <Text style={[styles.header]}>
            {currentUser.firstName}, {age}
          </Text>
          <Text style={styles.profileJoinDate}>{joinedDate}</Text>
          <Button.DarkButton
            onPress={onEditPress}
            height={35}
            width={200}
            style={{ alignSelf: 'center', borderRadius: 50 }}
            textStyle={{ ...themeText.bodyMediumSix }}>
            Edit Profile
          </Button.DarkButton>
        </View>

        <View style={styles.plansContainer}>
          <View style={{  marginVertical: 25,paddingVertical: 15, flexDirection: 'row', alignSelf:'center', borderTopWidth: 1, borderBottomWidth: 1, borderColor: PALETTE.GHOSTWHITE }}>
         
              <View style={[styles.planCard, {borderColor:'#ffca1c'}]}>
                <Image source={icons.coins} style={styles.planCard_icon}/>
                <View style={styles.planCard_textContainer}>
                  <Text style={styles.planCard_header}>{currentUser.connects.find(item => item.connectType === 'Connect Token')?.remainingCount} Connect Tokens</Text>
<View style={{flex: 1, justifyContent: 'flex-end'}}>
          <TouchableOpacity><Text style={styles.planCard_link}>GET MORE</Text></TouchableOpacity>
        </View>
                </View>
              </View>
              <View style={[styles.planCard,{borderColor:'#50B48A'}]}>
              <Image source={icons.nature} style={[styles.planCard_icon, {tintColor:THEME_COLORS.primary}]}/>
                <View style={styles.planCard_textContainer}>
                  <Text style={styles.planCard_header}>{currentUser.connects.find(item => item.connectType === 'Super Connect')?.remainingCount || 0} Super Connects</Text>
                  <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <TouchableOpacity><Text style={styles.planCard_link}>GET MORE</Text></TouchableOpacity>
        </View>
                </View>
              </View>
              <View
                style={
                 [ styles.planCard, {borderColor:THEME_COLORS.primary}]
                }>
                    <Image source={images.logo} style={[styles.planCard_icon, {tintColor:THEME_COLORS.primary}]}/>

                <View style={styles.planCard_textContainer}>
                  <Text style={styles.planCard_header}>Premium</Text>
                  <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <TouchableOpacity><Text style={styles.planCard_link}>READ MORE</Text></TouchableOpacity>
        </View>

                </View>
              
              </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              minHeight: 50,
              alignItems: 'center',
            }}>
            <View style={styles.plansContainer_firstColumn}>
              <Text style={styles.plansContainer_title}>Features</Text>
            </View>
            <View style={styles.plansContainer_restOfColumn}>
              <Text style={[styles.plansContainer_title, { textAlign: 'center' }]}>
                Connect Tokens
              </Text>
            </View>
            <View style={styles.plansContainer_restOfColumn}>
              <Text style={[styles.plansContainer_title, { textAlign: 'center' }]}>
                Super Connects
              </Text>
            </View>
            <View style={styles.plansContainer_restOfColumn}>
              <Text style={[styles.plansContainer_title, { textAlign: 'center' }]}>
                Premium
              </Text>
            </View>
          </View>

          {featuresList.map((item, index) => (
            <FieldOfTable
              key={index}
              feature={item.feature}
              connects={item.connects}
              premium={item.premium}
            />
          ))}

        </View>
      </ScrollView>
    </View>
  </SafeContainer>
);

};

export default UserProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    width: '100%',
    maxWidth: 420,
  },
  scrollViewContainer: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  activeText: {
    position: 'absolute',
    bottom: 5,
    right: 10,
    color: 'green',
    ...themeText.bodyBoldSeven,
  },
  inactiveText: {
    position: 'absolute',
    bottom: 5,
    right: 10,
    color: 'white',
    ...themeText.bodyBoldSeven,
  },

  plansContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    ...themeText.bodyMediumThree,
    color: THEME_COLORS.dark,
    textAlign: 'center',
  },
  plansContainer_firstColumn: {
    flex: 0.5,
  },
  plansContainer_title: {
    ...themeText.bodyMediumSix,
    color: THEME_COLORS.dark,
  },
  plansContainer_restOfColumn: {
    flex: 0.3,
    alignItems: 'center',
  },
  plansContainer_feature: {
    ...themeText.bodyRegularSix,
    color: THEME_COLORS.dark,
  },
  planCard: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    flex: 0.4,
    borderWidth: 0,
    borderRadius: 15,
    borderColor: 'transparent'
  },
  planCard_icon: {
    width: '100%',
    height: 30,
    margin: 10,
    resizeMode:'contain'
  },
  planCard_link: {...themeText.bodyBoldSix, color: 'black', textAlign: 'center'},
  planCard_header: {
    color: 'black',
    ...themeText.bodyMediumSeven,
    textAlign: 'center',
    paddingTop: 2,
  },
  planCard_textContainer: {
    flex: 1
  },
  planCard_paragraph: {
    color: 'white',
    ...themeText.bodyRegularFive,
    textAlign: 'center',
  },
  profileJoinDate: {
    color: THEME_COLORS.tertiary,
    ...themeText.bodyRegularSeven,
    paddingBottom: 10,
    textAlign: 'center',
  },
  profilePicture: {
    resizeMode: 'cover',
    width: 150,
    aspectRatio: 1,
    borderRadius: 500,
    marginBottom: 5,
    alignSelf: 'center',
    backgroundColor:PALETTE.GHOSTWHITE
  },
});
