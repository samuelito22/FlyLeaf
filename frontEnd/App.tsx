import MainNavigator from './navigation/MainNavigator';
import {Provider, useSelector} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {Store, Persistor, UserActions, AppStatusActions} from './redux';
import {StatusBar} from 'react-native';
import {ROUTES, TYPES} from './constants';
import {BlockedScreen} from './screens';
import {useDispatch, useInternetConnection} from './utils/hooks';
import {useEffect} from 'react';
import {UserService} from './services';
import React from 'react';
import {
  removeTokensFromKeychain,
  retrieveTokensFromKeychain,
} from './utils/keychain';
import {getData} from './utils/storage';
import {NavigationContainerRef} from '@react-navigation/native';
import { useErrorAlert } from './utils/hooks';
import { getLocationOnDemand } from './utils/locationChecker';

export const navigationRef =
  React.createRef<NavigationContainerRef<TYPES.RootStackParamList>>();

const MainContent = () => {
  

  const {isBlocked, currentScreen} = useSelector(
    (state: TYPES.AppState) => state.appStatusReducer,
  );
  const currentUserId = useSelector(
    (state: TYPES.AppState) => state.usersReducer.currentUserId,
  );
  const dispatch = useDispatch();

  const online = useInternetConnection()

  const { notify, ErrorAlert } = useErrorAlert();

  useEffect(() => {
    dispatch(AppStatusActions.setIsOnline(online))
    if (!online) {
      notify('No internet connection. Please connect to the internet.');
    }
  },[online])


  useEffect(() => {
    let controller = new AbortController();

    const collectUserProfile = async () => {
        const tokens = await retrieveTokensFromKeychain();

        if (tokens) {
            const {accessToken, refreshToken} = tokens;

            try {
                const { longitude, latitude} = (await getLocationOnDemand()).coords
                const result = await UserService.getMyProfile(
                    accessToken,
                    refreshToken,
                    longitude,
                    latitude,
                    controller.signal,
                )

                if (result.type === 'error') {
                    dispatch(AppStatusActions.setCurrentScreen(ROUTES.LOGIN_NAVIGATOR));
                    navigationRef.current?.navigate(ROUTES.LOGIN_NAVIGATOR);
                    await removeTokensFromKeychain();
                } else {
                    dispatch(UserActions.setCurrentUserId(result.user._id));
                    dispatch(UserActions.setUserProfile(result.user._id, result.user));
                }
            } catch (e:any) {
                if (e.name === 'AbortError') {
                    console.log('AbortError: Fetch request aborted.');
                } else {
                    console.log(e);
                }
            }
        } else {
            navigationRef.current?.navigate(ROUTES.LOGIN_NAVIGATOR);
        }
    };

    if (online && !currentUserId && currentScreen == ROUTES.BOTTOM_TAB_NAVIGATOR) {
        collectUserProfile();
    }

    return () => {
        if (controller) {
            controller.abort();
        }
    };
}, [online]);


  if (isBlocked) return <BlockedScreen />;

  return(
    <>
        {ErrorAlert}
  <MainNavigator />
  </>
  );
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
