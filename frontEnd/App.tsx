import MainNavigator from './navigation/MainNavigator';
import {Provider, useSelector} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {Store, Persistor} from './redux';
import {StatusBar} from 'react-native';
import {TYPES} from './constants';
import {BlockedScreen, LocationScreen} from './screens';
import {useGetProfile, useLocationService} from './utils/hooks';

const MainContent = () => {
  const {showLocationScreen, isBlocked} = useSelector(
    (state: TYPES.AppState) => state.appStatusReducer,
  );

  const {isRegisterCompleted} = useSelector(
    (state: TYPES.AppState) => state.registerReducer,
  );  


  useLocationService()

  useGetProfile();

  if(isBlocked) return <BlockedScreen/>


  return showLocationScreen && isRegisterCompleted.status ? (
    <LocationScreen />
  ) : (
    <MainNavigator />
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
