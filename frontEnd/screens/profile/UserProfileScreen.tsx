import {View, ScrollView, Image, Text, StyleSheet} from 'react-native';
import React, {useMemo} from 'react';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {PALETTE, ROUTES, THEME_COLORS, TYPES, themeText} from '../../constants';
import {useSelector} from 'react-redux';
import {Button, ProfilePrivateHeader, SafeContainer} from '../../components';
import {icons, images} from '../../assets';
import {useDispatch} from '../../utils/hooks';
import {EditProfileActions} from '../../redux';

const UserProfileScreen = () => {
  const dispatch = useDispatch();

  const currentUserId = useSelector(
    (state: TYPES.AppState) => state.usersReducer.currentUserId,
  );
  const currentUser = useSelector((state: TYPES.AppState) => 
 state.usersReducer.byId[currentUserId as string] 
) as TYPES.currentUserProfile


  const navigation = useNavigation<NavigationProp<TYPES.RootStackParamList>>();

  const dateOfBirth = new Date(currentUser?.createdAt);

  const currentDate = new Date();

  let age = currentDate.getFullYear() - dateOfBirth.getFullYear();

  // If the user hasn't had their birthday this year, subtract 1 from the age
  if (
    currentDate.getMonth() < dateOfBirth.getMonth() ||
    (currentDate.getMonth() === dateOfBirth.getMonth() &&
      currentDate.getDate() < dateOfBirth.getDate())
  ) {
    age--;
  }
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

  const onEditPress = () => {
    if (currentUser) {
      navigation.navigate(ROUTES.EDIT_PROFILE_SCREEN);
      dispatch(EditProfileActions.initUserProfile(currentUser));
    }
  };

  const featuresList = [
    {feature: 'Profile Creation', free: true, pro: true},

    {feature: 'Blurred Image Engagement', free: true, pro: true},

    {feature: 'Engagement Insights', free: false, pro: true},
    {feature: 'Unlimited Chat', free: true, pro: true},
    {feature: 'Ad-Free Experience', free: false, pro: true},
    {feature: 'Notifications', free: true, pro: true},
    {feature: 'Unlimited Matches', free: true, pro: true},
    {feature: 'Advanced Search', free: false, pro: true},
    {feature: 'Icebreakers & Conversation Starters', free: false, pro: true},
    {feature: 'See Who Liked You', free: false, pro: true},
    {feature: 'Priority Profile', free: false, pro: true},
    {feature: 'Standard Search', free: true, pro: true},

    {feature: 'Faster Image Reveal', free: false, pro: true},

    {feature: 'Offline Events or Webinars', free: false, pro: true},
  ];

  const FieldOfTable = React.memo(
    ({feature, free, pro}: {feature: string; free: boolean; pro: boolean}) => {
      return (
        <View
          style={{flexDirection: 'row', minHeight: 60, alignItems: 'center'}}>
          <View style={styles.plansContainer_firstColumn}>
            <Text style={styles.plansContainer_feature}>{feature}</Text>
          </View>
          <View style={styles.plansContainer_restOfColumn}>
            <Image
              source={free ? images.successIllustration : icons.dash}
              resizeMode="contain"
              style={[
                !free && {tintColor: THEME_COLORS.tertiary},
                {width: 20, height: 20},
              ]}
            />
          </View>
          <View style={styles.plansContainer_restOfColumn}>
            <Image
              source={pro ? images.successIllustration : icons.dash}
              resizeMode="contain"
              style={[
                !pro && {tintColor: THEME_COLORS.tertiary},
                {width: 20, height: 20},
              ]}
            />
          </View>
        </View>
      );
    },
  );

  return (
    <SafeContainer>
      <ProfilePrivateHeader />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <Image
            source={{uri: currentUser.pictures[0].url}}
            style={styles.profilePicture}
          />
          <View style={{flex: 0.6}}>
            <Text style={[styles.header]}>
              {currentUser.username}, {age}
            </Text>
            <Text style={styles.profileJoinDate}>{joinedDate}</Text>
            <Button.DarkButton
              onPress={onEditPress}
              height={35}
              width={200}
              style={{alignSelf: 'center', borderRadius: 50}}
              textStyle={{...themeText.bodyMediumSix}}>
              Edit Profile
            </Button.DarkButton>
          </View>

          <View style={styles.plansContainer}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
              <View
                style={[
                  styles.planCard,
                  currentUser.connects > 0 && {
                    borderColor: '#fda831',
                  },
                ]}>
                <Image
                  source={icons.coinsColoured}
                  style={styles.planCard_icon}
                  resizeMode="contain"
                />
                <View style={styles.planCard_textContainer}>
                  <Text style={styles.planCard_text}>
                    <Text
                      style={{
                        ...themeText.bodyBoldThree,
                        color: THEME_COLORS.dark,
                      }}>
                      {currentUser?.connects
                        ? currentUser?.connects
                        : 0}
                    </Text>{' '}
                    Connects
                  </Text>
                </View>
                <Button.ButtonImage
                  imgUrl={icons.plus}
                  contentContainerStyle={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    borderWidth: 0.2,
                    borderRadius: 500,
                    borderColor: THEME_COLORS.tertiary,
                  }}
                  width={30}
                  height={30}
                  tintColor={THEME_COLORS.tertiary}
                />
              </View>
              <View
                style={[
                  styles.planCard,
                  currentUser?.isPremiumMember && {
                    borderColor: 'green',
                  },
                ]}>
                <Image
                  source={images.logo}
                  style={styles.planCard_icon}
                  resizeMode="contain"
                  tintColor={THEME_COLORS.primary}
                />
                <Text
                  style={
                    currentUser?.isPremiumMember
                      ? styles.activeText
                      : styles.inactiveText
                  }>
                  {currentUser?.isPremiumMember
                    ? 'Active'
                    : 'Inactive'}
                </Text>
                <View style={styles.planCard_textContainer}>
                  <Text style={styles.planCard_text}>Pro membership</Text>
                </View>
                <Button.ButtonImage
                  imgUrl={icons.plus}
                  contentContainerStyle={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    borderWidth: 0.2,
                    borderRadius: 500,
                    borderColor: THEME_COLORS.tertiary,
                  }}
                  width={30}
                  height={30}
                  tintColor={THEME_COLORS.tertiary}
                />
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
                <Text
                  style={[styles.plansContainer_title, {textAlign: 'center'}]}>
                  Free
                </Text>
              </View>
              <View style={styles.plansContainer_restOfColumn}>
                <Text
                  style={[styles.plansContainer_title, {textAlign: 'center'}]}>
                  Pro
                </Text>
              </View>
            </View>
            {featuresList.map((item, index) => (
              <FieldOfTable
                key={index}
                feature={item.feature}
                free={item.free}
                pro={item.pro}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeContainer>
  );
};

export default UserProfileScreen;

export const styles = StyleSheet.create({
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
    color: THEME_COLORS.tertiary,
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
    borderRadius: 15,
    borderWidth: 2,
    borderColor: PALETTE.GHOSTWHITE,
    paddingVertical: 25,
    paddingHorizontal: 10,
    marginVertical: 10,
    flex: 0.45,
  },
  planCard_icon: {
    width: '100%',
    height: 50,
    margin: 10,
  },
  planCard_text: {
    color: THEME_COLORS.dark,
    ...themeText.bodyMediumFive,
    textAlign: 'center',
    paddingTop: 2,
  },
  planCard_textContainer: {
    flex: 1,
  },
  planCard_paragraph: {
    color: THEME_COLORS.tertiary,
    ...themeText.bodyRegularSix,
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
  },
});
