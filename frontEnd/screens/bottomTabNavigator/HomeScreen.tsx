import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SafeContainer, UserProfileCard, HomeHeader} from '../../components';
import {icons, images} from '../../assets';
import {NavigationProp} from '@react-navigation/native';
import {TYPES} from '../../constants';

type LocationData = {
  latitude: number;
  longitude: number;
};

const HomeScreen = ({
  navigation,
}: {
  navigation: NavigationProp<TYPES.RootStackParamList>;
}) => {
  return (
    <SafeContainer>
      <HomeHeader />
      <View style={homeScreenStyles.container}>
        <UserProfileCard
          about="Adventure seeker and film enthusiast with a passion for cooking. I love exploring new places, whether it's hiking in the mountains or discovering..."
          firstName="Samuel"
          age="20"
          city="Newcastle"
          profileImage={images.manAvatar}
          statusText="relationship"
          statusIcon={icons.heartBold}
          interests={['anime', 'react', 'react native']}
        />
        <UserProfileCard
          about="Adventure seeker and film enthusiast with a passion for cooking. I love exploring new places, whether it's hiking in the mountains or discovering..."
          firstName="Samuel"
          age="20"
          city="Newcastle"
          profileImage={images.manAvatar}
          statusText="relationship"
          statusIcon={icons.heartBold}
          interests={['anime', 'react', 'react native']}
        />
      </View>
    </SafeContainer>
  );
};

export default HomeScreen;

const homeScreenStyles = StyleSheet.create({
  container: {
    maxWidth: 352,
    height: '100%',
  },
});
