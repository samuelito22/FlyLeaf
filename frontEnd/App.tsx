import MainNavigator from './navigation/MainNavigator';
import {Provider, useSelector} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {Store, Persistor, setCurrentUserId} from './redux';
import {StatusBar} from 'react-native';
import {TYPES} from './constants';
import {BlockedScreen, LocationScreen} from './screens';
import {useDispatch, useGetProfile, useLocationService} from './utils/hooks';
import {useEffect}  from "react"
import auth from "@react-native-firebase/auth"

const MainContent = () => {
  const dispatch = useDispatch()

  const {showLocationScreen, isBlocked, isLoggedIn} = useSelector(
    (state: TYPES.AppState) => state.appStatusReducer,
  );

  const {isRegisterCompleted} = useSelector(
    (state: TYPES.AppState) => state.registerReducer,
  );  

  useEffect(() => {
    if(isLoggedIn){
      const uid = auth().currentUser?.uid;
      if(uid) dispatch(setCurrentUserId(uid))
    }
  },[isLoggedIn])


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
