import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SafeContainer, UserProfileCard, HomeHeader, Loading} from '../../components';
import {icons, images} from '../../assets';
import {NavigationProp} from '@react-navigation/native';
import {TYPES} from '../../constants';
import { useSelector } from 'react-redux';

type LocationData = {
  latitude: number;
  longitude: number;
};

const HomeScreen = ({
  navigation,
}: {
  navigation: NavigationProp<TYPES.RootStackParamList>;
}) => {
    const currentUserId =
    useSelector((state: TYPES.AppState) => state.usersReducer.currentUserId) ||
    null;

  const currentUser = useSelector((state: TYPES.AppState) =>
    currentUserId
      ? (state.usersReducer.byId[currentUserId])
      : null,
  );

  return (
    <SafeContainer>
      <HomeHeader />
        {!currentUserId ? <Loading.ActiveIndicator modalBackground={{backgroundColor:"transparent"}}/> : 
      <View style={homeScreenStyles.container}>
      
        {currentUser && <UserProfileCard
        moveable={true}
          userData={currentUser as any}
        />}
   
      </View>
      }
    </SafeContainer>
  );
};

export default HomeScreen;

const homeScreenStyles = StyleSheet.create({
  container: {
    width:"100%",
    position:"relative"
  },
});
