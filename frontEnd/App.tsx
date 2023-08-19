import MainNavigator from './navigation/MainNavigator';
import {Provider, useSelector} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {Store, Persistor, UserActions} from './redux';
import {StatusBar} from 'react-native';
import {TYPES} from './constants';
import {BlockedScreen, LocationScreen} from './screens';
import {useDispatch} from './utils/hooks';
import {useEffect}  from "react"
import auth from "@react-native-firebase/auth"
import { UserService } from './services';
import React from "react"

const MainContent = () => {
  const dispatch = useDispatch()

  const {showLocationScreen, isBlocked, isLoggedIn} = useSelector(
    (state: TYPES.AppState) => state.appStatusReducer,
  );
  const boo = useSelector((state: TYPES.AppState) => state.usersReducer.currentUserId);

  const {isRegisterCompleted} = useSelector(
    (state: TYPES.AppState) => state.registerReducer,
  );  

  const uid = auth().currentUser?.uid;

  const [locationData, setlocationData] = React.useState<null | TYPES.PositionType>(null)

  useEffect(() => {
    if(isLoggedIn && uid){
      dispatch(UserActions.setCurrentUserId(uid))
    }
  },[isLoggedIn, uid])


  UserService.getGeoLocation((position) => setlocationData(position))

  useEffect(() => {
    let controller: AbortController;
  
    if (uid && locationData) {
      controller = new AbortController();
      const formattedLocData = { longitude: locationData.longitude, latitude: locationData.latitude };
  
      UserService.initUserProfile(uid, formattedLocData, controller.signal)
        .then(result => dispatch(UserActions.setUserProfile(uid, result.profile)))
        .catch(e => console.log(e));
    }
  
    return () => {
      if (controller) {
        controller.abort();
      }
    };
  }, [uid, locationData]);
  

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
