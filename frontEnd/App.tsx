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
import collectUserProfile from './utils/collectUserProfile';

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

    if (online && !currentUserId && currentScreen == ROUTES.BOTTOM_TAB_NAVIGATOR) {
        collectUserProfile(dispatch, controller);
    }

    return () => {
        if (controller) {
            controller.abort();
        }
    };
}, [online, currentUserId, currentScreen]);


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
