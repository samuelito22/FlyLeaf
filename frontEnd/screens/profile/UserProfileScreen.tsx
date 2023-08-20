import {
  View,
  ScrollView,
  Image,
  Text,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';
import React from 'react';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {
  BORDER_RADIUS,
  PALETTE,
  ROUTES,
  THEME_COLORS,
  TYPES,
  themeText,
} from '../../constants';
import {useSelector} from 'react-redux';
import {
  Button,
  ProfilePrivateHeader,
  Ripple,
  SafeContainer,
  UserProfileCard,
} from '../../components';
import {style as GeneralStyles} from './styles';
import {icons} from '../../assets';
import {useDispatch} from '../../utils/hooks';
import {EditProfileActions} from '../../redux';
import {TouchableRipple} from 'react-native-paper';

const UserProfileScreen = () => {
  const dispatch = useDispatch();

  const currentUserId = useSelector(
    (state: TYPES.AppState) => state.usersReducer.currentUserId,
  );
  const userProfile: TYPES.userProfileDataStructure = currentUserId
    ? useSelector(
        (state: TYPES.AppState) => state.usersReducer.byId[currentUserId],
      )
    : null;

  const navigation = useNavigation<NavigationProp<TYPES.RootStackParamList>>();

  const dateObj = new Date(userProfile.user.profile.dateOfBirth);

  const daySuffix = (day: number) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
          case 1:  return 'st';
          case 2:  return 'nd';
          case 3:  return 'rd';
          default: return 'th';
      }
  };
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const formattedDate = `Born on ${dateObj.getDate()}${daySuffix(dateObj.getDate())} of ${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

  const joinedDateObj = new Date(userProfile.user.createdAt);
const joinedDate = `Joined on ${joinedDateObj.getDate()}${daySuffix(joinedDateObj.getDate())} of ${monthNames[joinedDateObj.getMonth()]} ${joinedDateObj.getFullYear()}`;

  

  const onEditPress = () => {
    if (userProfile) {
      dispatch(EditProfileActions.initUserProfile(userProfile));

      navigation.navigate(ROUTES.EDIT_PROFILE_SCREEN);
    }
  };

  type CallToActionProps = {
    icon: ImageSourcePropType;
    header: string;
    onPress?: () => void;
  };

  const CallToAction: React.FC<CallToActionProps> = ({
    icon,
    header,
    onPress,
  }) => {
    return (
      <TouchableRipple onPress={onPress} style={{width: '100%'}}>
        <View
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            height: 70,
            marginHorizontal: 20,
          }}>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={icon}
              style={{
                tintColor: THEME_COLORS.dark,
                width: 20,
                height: 20,
                alignSelf: 'center',
              }}
            />
            <Text
              style={{
                color: THEME_COLORS.dark,
                ...themeText.bodyRegularFive,
                marginLeft: 20,
              }}>
              {header}
            </Text>
          </View>
          <Image
            source={icons.arrowRight}
            style={{tintColor: THEME_COLORS.tertiary, width: 20, height: 20}}
          />
        </View>
      </TouchableRipple>
    );
  };

  return (
    <SafeContainer>
      <ProfilePrivateHeader />
      <View style={GeneralStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.profileInfoContainer}>
            <Image source={{uri: userProfile.user.profile.pictures[0]}} style={styles.profileImage}/>
            <View style={styles.profileTextContainer}>
              <Text style={styles.profileName}>{userProfile.user.profile.firstName}</Text>
              <Text style={styles.profileBirthDate}>{formattedDate}</Text>
              <Text style={styles.profileJoinDate}>{joinedDate}</Text>
            </View>
           </View>

          <CallToAction icon={icons.profile} header={'Edit Profile'} onPress={onEditPress} />
          <CallToAction icon={icons.subscription} header={'Subscription'} />
          <CallToAction icon={icons.settings} header={'Settings'} />
          <CallToAction icon={icons.support} header={'Help'} />
          <CallToAction icon={icons.information} header={'About FlyLeaf'} />
          <View style={[styles.planCard, {backgroundColor: PALETTE.GREEN300}]}>
            <Image
              source={icons.coinsColoured}
              style={styles.planCard_icon}
              resizeMode="contain"
            />
            <View style={styles.planCard_textContainer}>
              <Text style={styles.planCard_textContainer_header}>
                Recharge connects
              </Text>
              <Text style={styles.planCard_textContainer_paragraph}>
                Connects let you initiate conversations. Recharge to ensure you
                don't miss out on potential matches. Enjoy better visibility and
                better pricing with every recharge.
              </Text>
            </View>
          </View>

          <View style={[styles.planCard, {backgroundColor: PALETTE.PURPLE}]}>
            <Image
              source={icons.premium}
              style={styles.planCard_icon}
              resizeMode="contain"
            />
            <View style={styles.planCard_textContainer}>
              <Text style={styles.planCard_textContainer_header}>
                Flyleaf Premium
              </Text>
              <Text style={styles.planCard_textContainer_paragraph}>
                Experience the best of Flyleaf. Get unlimited connects, profile
                boosts, read receipts, advanced filtering, and an ad-free
                experience. Upgrade now for a superior dating journey.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeContainer>
  );
};

export default UserProfileScreen;

export const styles = StyleSheet.create({
  scrollViewContainer: {
    width: '100%',
    paddingVertical: 15
  },
  profileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  profileImage: {
    flex: 0.3,
    aspectRatio: 1,
    borderRadius: 500
  },
  profileTextContainer: {
    flex: 0.7,
    marginLeft: 20
  },
  profileName: {
    color: THEME_COLORS.dark,
    ...themeText.bodyBoldThree
  },
  profileBirthDate: {
    color: THEME_COLORS.dark,
    ...themeText.bodyRegularSix
  },
  profileJoinDate: {
    color: THEME_COLORS.tertiary,
    ...themeText.bodyRegularSeven
  },
  planCard: {
    padding: 20,
    borderRadius: 15,
    width: '95%',
    flexDirection: 'row',
    marginVertical: 10,
    alignSelf:'center',
  },
  planCard_icon: {
    height: 100,
    width: 100,
    flex: 0.2,
    maxWidth: '20%',
    marginRight: 20,
    alignSelf: 'center',
  },
  planCard_textContainer: {
    flex: 0.8,
  },
  planCard_textContainer_header: {
    color: 'white',
    ...themeText.bodyMediumFour,
  },
  planCard_textContainer_paragraph: {
    color: 'white',
    ...themeText.bodyRegularSix,
  },
});
