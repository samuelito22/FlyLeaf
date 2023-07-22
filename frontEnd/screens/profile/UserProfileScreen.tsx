import {View, ScrollView, Image, Text, StyleSheet} from 'react-native';
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

const UserProfileScreen = () => {
  const {userProfile} = useSelector(
    (state: TYPES.AppState) => state.userReducer,
  );

  const navigation = useNavigation<NavigationProp<TYPES.RootStackParamList>>();

  const dateOfBirth = new Date(userProfile.profile.dateOfBirth);

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

  return (
    <SafeContainer>
      <ProfilePrivateHeader />
      <View style={GeneralStyles.container}>
        <ScrollView contentContainerStyle={{alignItems: 'center'}}>
          <UserProfileCard
            about={userProfile.profile.bio}
            firstName={userProfile.profile.firstName}
            age={age.toString()}
            city={userProfile.location.lastLocation.city}
            statusText={userProfile.preferences.relationshipGoal}
            interests={userProfile.interests.interests}
            movementActive={false}
          />
          <View style={{flexDirection: 'row', marginTop: 15}}>
            <Ripple
              onPress={() => navigation.navigate(ROUTES.EDIT_PROFILE_SCREEN)}
              style={[
                GeneralStyles.button,
                {backgroundColor: THEME_COLORS.dark},
              ]}>
              <Text style={[GeneralStyles.text, {color: 'white'}]}>Edit</Text>
            </Ripple>
            <Ripple style={[GeneralStyles.button, {backgroundColor: 'white'}]}>
              <Text style={[GeneralStyles.text, {color: THEME_COLORS.dark}]}>
                Your thoughts
              </Text>
            </Ripple>
          </View>
          <View style={styles.planContainer}>
            <View style={styles.creditAndPlainInformation}>
              <Text style={styles.creditAndPlainInformation_text}>
                Current connects: {userProfile.appActivity.connects}
              </Text>
              <Text style={styles.creditAndPlainInformation_text}>
                Active plan: {userProfile.isPremiumUser ? 'On' : 'Off'}
              </Text>
            </View>

            <View style={[styles.planCard, {backgroundColor: PALETTE.PURPLE}]}>
              <View style={styles.planCard_textContainer}>
                <Text style={styles.planCard_header}>Premium</Text>
                <Text style={styles.planCard_paragraph}>
                  Upgrade to Flyleaf Premium for a superior dating experience
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 15,
                  }}>
                  <Ripple
                    style={[
                      GeneralStyles.button,
                      {backgroundColor: THEME_COLORS.dark, marginHorizontal: 0},
                    ]}>
                    <Text style={[GeneralStyles.text, {color: 'white'}]}>
                      From £4.99
                    </Text>
                  </Ripple>
                  <Ripple
                    style={[GeneralStyles.button, {backgroundColor: 'white'}]}>
                    <Text
                      style={[GeneralStyles.text, {color: THEME_COLORS.dark}]}>
                      Read more
                    </Text>
                  </Ripple>
                </View>
              </View>
              <Image
                source={icons.premium}
                style={styles.planCard_icon}
                resizeMode="cover"
              />
            </View>
            <View
              style={[
                styles.planCard,
                {backgroundColor: PALETTE.GREEN300},
              ]}>
                <View style={styles.planCard_textContainer}>
                <Text style={styles.planCard_header}>Recharge connects</Text>
                <Text style={styles.planCard_paragraph}>
                Running out of connects? Recharge now and keep the conversation going
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 15,
                  }}>
                  <Ripple
                    style={[
                      GeneralStyles.button,
                      {backgroundColor: THEME_COLORS.dark, marginHorizontal: 0},
                    ]}>
                    <Text style={[GeneralStyles.text, {color: 'white'}]}>
                      From £0.79
                    </Text>
                  </Ripple>
                  <Ripple
                    style={[GeneralStyles.button, {backgroundColor: 'white'}]}>
                    <Text
                      style={[GeneralStyles.text, {color: THEME_COLORS.dark}]}>
                      Read more
                    </Text>
                  </Ripple>
                </View>
              </View>
              <Image
                source={icons.coinsColoured}
                style={styles.planCard_icon}
                resizeMode="cover"
              />
              </View>
          </View>
        </ScrollView>
      </View>
    </SafeContainer>
  );
};

export default UserProfileScreen;

export const styles = StyleSheet.create({
  planContainer: {
    marginTop: 40,
    paddingHorizontal: 10,
    flexDirection: 'column',
    width: '100%',
  },
  creditAndPlainInformation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  creditAndPlainInformation_text: {
    ...themeText.bodyRegularSix,
    color: THEME_COLORS.tertiary
  },
  planCard: {
    width: '100%',
    borderRadius: BORDER_RADIUS.extraLarge,
    marginTop: 20,
    flexDirection: 'row',
  },
  planCard_header: {
    ...themeText.bodyBoldThree,
    color: 'white',
  },
  planCard_paragraph: {
    ...themeText.bodyRegularFive,
    color: 'white',
    paddingVertical: 10,
  },
  planCard_textContainer: {
    width: 300,
    padding: 20,
    height: '100%',
    flexDirection: 'column',
  },
  planCard_icon: {
    width: 100,
    height: 100,
    position: 'absolute',
    top: -10,
    right: -10,
  },
});
