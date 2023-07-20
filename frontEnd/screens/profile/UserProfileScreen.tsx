import {View, ScrollView, } from 'react-native';
import React from 'react';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {TYPES} from '../../constants';
import {useSelector} from 'react-redux';
import {BackButton, Button, SafeContainer, UserProfileCard} from '../../components';
import {style as GeneralStyles} from './styles';

const UserProfileScreen = () => {
  const {userProfile} = useSelector(
    (state: TYPES.AppState) => state.userReducer,
  );

  const navigation = useNavigation<NavigationProp<TYPES.RootStackParamList>>();

  const dateOfBirth = new Date(userProfile.dateOfBirth);

  // Format the date
  const formattedDate = dateOfBirth.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

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
      <BackButton onPress={() => navigation.goBack()} />
      <View style={GeneralStyles.container}>
        <ScrollView>
          <UserProfileCard
            about={userProfile.bio}
            firstName={userProfile.firstName}
            age={age.toString()}
            city={userProfile.lastLocation.city}
            statusText={userProfile.relationshipGoal}
            interests={userProfile.interests.slice(0, 3)}
            movementActive={false}
            questionAndAnswer={userProfile.questionAndAnswer}
          />
        </ScrollView>
      </View>
    </SafeContainer>
  );
};

export default UserProfileScreen;
