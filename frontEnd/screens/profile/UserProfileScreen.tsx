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
  ) as TYPES.currentUserProfile;
  const {gendersList, interestsList, questionsList, languagesList} = useSelector(
    (state: TYPES.AppState) => state.usersReducer,
  );
  const isOnline = useSelector(
    (state: TYPES.AppState) => state.appStatusReducer.isOnline,
  );

  const navigation = useNavigation<NavigationProp<TYPES.RootStackParamList>>();
  const age = getAge(currentUser?.dateOfBirth);
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
    if (!questionsList && !languagesList && !interestsList && !gendersList) {
      try {
        const result = await UserService.getOverviewEn();
        
        if (result.type !== 'success') {
          setIsLoading(false);
          return;  // Exit if result type is not success
        }
  
        const { questions, interests, languages, genders } = result;
  
        dispatch(UserActions.setQuestionsList(questions));
        dispatch(UserActions.setInterestsList(interests));
        dispatch(UserActions.setLanguagesList(languages));
        dispatch(UserActions.setGendersList(genders));
  
      } catch (error) {
        console.error("Failed to get overview data:", error);
        setIsLoading(false);
        return;  // Exit on error after logging and setting loading state
      }
    }
  
    // Continue to edit profile screen
    navigation.navigate(ROUTES.EDIT_PROFILE_SCREEN);
    dispatch(EditProfileActions.initUserProfile(currentUser));
    setIsLoading(false);
    };

    
useEffect(() => {
  if (isOnline) {
      setImageKey(prevKey => prevKey + 1);
  }
}, [isOnline]);
  
  

  return (
    <SafeContainer>
      {isLoading && <Loading.ActiveIndicator/>}
      <ProfilePrivateHeader />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <Image
          key={imageKey}
            source={{uri: currentUser.pictures[0].url}}
            style={styles.profilePicture}
          />
          <View style={{flex: 0.6}}>
            <Text style={[styles.header]}>
              {currentUser.username}, {age}
            </Text>
            <Text style={styles.profileJoinDate}>{joinedDate} | {currentUser.connects} Connects</Text>
            <Button.DarkButton
              onPress={onEditPress}
              height={35}
              width={200}
              style={{alignSelf: 'center', borderRadius: 50}}
              textStyle={{...themeText.bodyMediumSix}}>
              Edit Profile
            </Button.DarkButton>
          </View>

          <View style={styles.plansContainer} >
            <View style={{borderRadius: 25, overflow: 'hidden', marginVertical: 15}}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={{flexDirection: 'row'}}>
                
              <View
                style={[
                  styles.planCard,
                  {width: cardWidth*0.95, backgroundColor: '#50B48A'},
                ]}>
                <Text
                  style={
                    currentUser?.isPremiumMember
                      ? styles.activeText
                      : styles.inactiveText
                  }>
                  {currentUser?.isPremiumMember ? 'Active' : 'Inactive'}
                </Text>
                <View style={styles.planCard_textContainer}>
                  <Text style={styles.planCard_header}>Premium</Text>
                  <Text style={styles.planCard_paragraph}>
                    Unlock exclusive features on Flyleaf to deepen connections and explore more matches without limitations.
                  </Text>
                </View>
                <Button.DarkButton
                  style={{marginVertical: 10, height: 40, width: 200}}
                  textStyle={{...themeText.bodyMediumFive}}>
                  Starting from £4.99
                </Button.DarkButton>
              </View>
              <View
                style={[
                  styles.planCard,
                  {width: cardWidth*0.95, backgroundColor: '#ffca1c'},
                ]}>
      
                <View style={styles.planCard_textContainer}>
                  <Text style={styles.planCard_header}>Connects</Text>
                  <Text style={styles.planCard_paragraph}>
                  Buy Flyleaf connects for better visibility, special messages, and premium features.
</Text>
                </View>
                <Button.DarkButton
                  style={{marginVertical: 10, height: 40, width: 200}}
                  textStyle={{...themeText.bodyMediumFive}}>
                  Starting from £0.99
                </Button.DarkButton>
              </View>
            </ScrollView>
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
                <Text
                  style={[styles.plansContainer_title, {textAlign: 'center'}]}>
                  Connects
                </Text>
              </View>
              <View style={styles.plansContainer_restOfColumn}>
                <Text
                  style={[styles.plansContainer_title, {textAlign: 'center'}]}>
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
    flex: 0.25,
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
    paddingVertical: 25,
    paddingHorizontal: 10,
  },
  planCard_icon: {
    width: '100%',
    height: 50,
    margin: 10,
  },
  planCard_header: {
    color: 'white',
    ...themeText.bodyMediumFour,
    textAlign: 'center',
    paddingTop: 2,
  },
  planCard_textContainer: {
    flex: 1,
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
