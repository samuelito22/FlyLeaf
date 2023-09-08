import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {ROUTES, TYPES} from '../constants';
import LoginNavigator from './auth/Login';
import RegisterNavigator from './auth/Register';
import BottomTabNavigator from './BottomTabNavigator';
import {cardSlideDownAnimation, cardSlideLeftAnimation, cardSlideUpAnimation} from '../utils/navigatorSlideAnimation';
import {useSelector} from 'react-redux';
import ProfileNavigator from './ProfileNavigator';
import {retrieveTokensFromKeychain} from '../utils/keychain';
import {useEffect, useState} from 'react';
import { navigationRef } from '../App';

const Stack = createStackNavigator();

const MainNavigator = () => {
  const currentScreen = useSelector(
    (state: TYPES.AppState) => state.appStatusReducer.currentScreen,
  );



  

  const linking = {
    prefixes: ['flyleaf://'],
    config: {
      screens: {
        [ROUTES.LOGIN_NAVIGATOR]: {
          path: 'login',
          screens: {
            [ROUTES.EMAIL_VERIFICATION_SCREEN]: {
              path: 'verify',
              parse: {
                emailVerified: (value: string) => value === 'true',
                authCode: (authCode: string) => `${authCode}`,
              },
            },
          },
        },
        [ROUTES.REGISTER_NAVIGATOR]: {
          path: 'register',
          screens: {
            [ROUTES.EMAIL_VERIFICATION_SCREEN]: {
              path: 'verify',
              parse: {
                emailVerified: (value: string) => value === 'true',
              },
            },
          },
        },
      },
    },
  };

  return (
    <NavigationContainer linking={linking} ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: cardSlideLeftAnimation,
        }}
        initialRouteName={currentScreen || ROUTES.LOGIN_NAVIGATOR}>
      <Stack.Screen
    name={ROUTES.LOGIN_NAVIGATOR}
    component={LoginNavigator}
    options={{
        cardStyleInterpolator: cardSlideUpAnimation
    }}
/>
        <Stack.Screen
          name={ROUTES.REGISTER_NAVIGATOR}
          component={RegisterNavigator}
        />
        <Stack.Screen
          name={ROUTES.PROFILE_NAVIGATOR}
          component={ProfileNavigator}
        />
        <Stack.Screen
          name={ROUTES.BOTTOM_TAB_NAVIGATOR}
          component={BottomTabNavigator}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
