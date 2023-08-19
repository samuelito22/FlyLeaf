import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {ROUTES, TYPES} from '../constants';
import LoginNavigator from './auth/Login';
import RegisterNavigator from './auth/Register';
import BottomTabNavigator from './BottomTabNavigator';
import {cardSlideLeftAnimation} from '../utils/navigatorSlideAnimation';
import {useSelector} from 'react-redux';
import {firebase} from '@react-native-firebase/auth';
import ProfileNavigator from './ProfileNavigator';

const Stack = createStackNavigator();

const MainNavigator = () => {
  const isLoggedIn = useSelector(
    (state: TYPES.AppState) => state.appStatusReducer.isLoggedIn,
  );

  const isRegisterCompleted = useSelector(
    (state: TYPES.AppState) => state.registerReducer.isRegisterCompleted,
  );

  const initialRouteNameDecider = () => {
    if (isLoggedIn) {
      //suppose to be without the exlamation mark
      return ROUTES.BOTTOM_TAB_NAVIGATOR;
    } else {
      if (isRegisterCompleted.currentScreen) {
        return ROUTES.REGISTER_NAVIGATOR;
      } else {
        return ROUTES.LOGIN_NAVIGATOR;
      }
    }
  };

  const linking = {
    prefixes: ['https://91db-90-242-236-229.ngrok-free.app'],
    config: {
      screens: {
        InstagramOAuthScreen: 'instagram/oauth/',
      },
    },
  };

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,

          cardStyleInterpolator: cardSlideLeftAnimation,
        }}
        initialRouteName={ROUTES.BOTTOM_TAB_NAVIGATOR}>
        <Stack.Screen
          name={ROUTES.LOGIN_NAVIGATOR}
          component={LoginNavigator}
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
