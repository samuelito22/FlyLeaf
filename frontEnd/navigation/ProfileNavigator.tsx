import {createStackNavigator} from '@react-navigation/stack';
import {ROUTES} from '../constants';
import React from 'react';
import {UserProfileScreen, PublicProfileScreen, EditProfileScreen} from '../screens';
import {cardSlideLeftAnimation} from '../utils/navigatorSlideAnimation';

const Stack = createStackNavigator();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,

        cardStyleInterpolator: cardSlideLeftAnimation,
      }}>
      <Stack.Screen
        name={ROUTES.USER_PROFILE_SCREEN}
        component={UserProfileScreen}
      />
      <Stack.Screen
        name={ROUTES.PUBLIC_PROFILE_SCREEN}
        component={PublicProfileScreen}
      />
      <Stack.Screen
        name={ROUTES.EDIT_PROFILE_SCREEN}
        component={EditProfileScreen}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
