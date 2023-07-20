import {createStackNavigator} from '@react-navigation/stack';
import {ROUTES} from '../constants';
import React from 'react';
import {UserProfileScreen, PublicProfileScreen} from '../screens';
import {cardSlideAnimation} from '../utils/navigatorSlideAnimation';

const Stack = createStackNavigator();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,

        cardStyleInterpolator: cardSlideAnimation,
      }}>
      <Stack.Screen
        name={ROUTES.USER_PROFILE_SCREEN}
        component={UserProfileScreen}
      />
      <Stack.Screen
        name={ROUTES.PUBLIC_PROFILE_SCREEN}
        component={PublicProfileScreen}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
