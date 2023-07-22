import {createStackNavigator} from '@react-navigation/stack';
import {ROUTES} from '../../constants';
import React from 'react';
import {
  LoginStartScreen,
  OTPScreen,
  EmailVerificationScreen,
} from '../../screens';
import {cardSlideLeftAnimation} from '../../utils/navigatorSlideAnimation';

const Stack = createStackNavigator();

const LoginNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.LOGIN_START_SCREEN}
      screenOptions={{
        headerShown: false,

        cardStyleInterpolator: cardSlideLeftAnimation,
      }}>
      <Stack.Screen
        name={ROUTES.LOGIN_START_SCREEN}
        component={LoginStartScreen}
      />
      <Stack.Screen name={ROUTES.LOGIN_OTP_SCREEN} component={OTPScreen} />
      <Stack.Screen
        name={ROUTES.EMAIL_VERIFICATION_SCREEN}
        component={EmailVerificationScreen}
      />
    </Stack.Navigator>
  );
};

export default LoginNavigator;
