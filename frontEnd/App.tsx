import MainNavigator from './navigation/MainNavigator';
import {Provider, useSelector} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {Store, Persistor, UserActions, AppStatusActions} from './redux';
import {StatusBar} from 'react-native';
import {ROUTES, TYPES} from './constants';
import {BlockedScreen} from './screens';
import {useDispatch} from './utils/hooks';
import {useEffect} from 'react';
import {UserService} from './services';
import React from 'react';
import {
  startContinuouslyCheckingLocation,
  stopContinuouslyCheckingLocation,
} from './utils/locationChecker';
import {
  removeTokensFromKeychain,
  retrieveTokensFromKeychain,
} from './utils/keychain';
import {getData} from './utils/storage';
import {NavigationContainerRef} from '@react-navigation/native';

export const navigationRef =
  React.createRef<NavigationContainerRef<TYPES.RootStackParamList>>();

const MainContent = () => {
  const dispatch = useDispatch();

  const {isBlocked} = useSelector(
    (state: TYPES.AppState) => state.appStatusReducer,
  );

  const {isRegisterCompleted} = useSelector(
    (state: TYPES.AppState) => state.registerReducer,
  );

  useEffect(() => {
    let controller = new AbortController();
    const collectUserProfile = async () => {
      const tokens = await retrieveTokensFromKeychain();
      const coordinates = await getData('coordinates');

      if (tokens && coordinates) {
        const {accessToken, refreshToken} = tokens;
        await UserService.getMyProfile(
          JSON.parse(coordinates) as {longitude: number; latitude: number},
          accessToken,
          refreshToken,
          controller.signal,
        )
          .then(async result => {
            if (result.type === 'error') {
              dispatch(
                AppStatusActions.setCurrentScreen(ROUTES.LOGIN_NAVIGATOR),
              );
              navigationRef.current?.navigate(ROUTES.LOGIN_NAVIGATOR);
              await removeTokensFromKeychain();
            } else {
              dispatch(UserActions.setCurrentUserId(result.user._id));
              dispatch(
                UserActions.setUserProfile(result.user._id, result.user),
              );
            }
          })
          .catch(e => {
            console.log(e);
          });

        // Use the tokens as needed...
      } else {
        navigationRef.current?.navigate(ROUTES.LOGIN_NAVIGATOR);
      }
    };

    collectUserProfile();

    return () => {
      if (controller) {
        controller.abort();
      }
    };
  }, []);

  useEffect(() => {
    // Start checking location when the component is mounted
    startContinuouslyCheckingLocation();

    // Cleanup function: stops checking location when the component is unmounted
    return () => {
      stopContinuouslyCheckingLocation();
    };
  }, []);

  if (isBlocked) return <BlockedScreen />;

  return <MainNavigator />;
};

export default function App() {
  return (
    <Provider store={Store}>
      <PersistGate loading={null} persistor={Persistor}>
        <StatusBar backgroundColor={'white'} barStyle="dark-content" />
        <MainContent />
      </PersistGate>
    </Provider>
  );
}
