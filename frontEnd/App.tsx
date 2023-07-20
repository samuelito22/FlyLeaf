import MainNavigator from './navigation/MainNavigator';
import {Provider, useSelector} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {Store, Persistor, setUserProfile} from './redux';
import {StatusBar} from 'react-native';
import {TYPES} from './constants';
import {LocationScreen} from './screens';
import {useDispatch, useLocationService} from './utils/hooks';
import auth from '@react-native-firebase/auth';
import {useEffect} from 'react';
import {UserService} from './services';

const MainContent = () => {
  const dispatch = useDispatch();
  const {showLocationScreen} = useSelector(
    (state: TYPES.AppState) => state.appStatusReducer,
  );

  const {isRegisterCompleted} = useSelector(
    (state: TYPES.AppState) => state.registerReducer,
  );

  useLocationService();

  useEffect(() => {
    const getProfile = async () => {
      const uid = auth().currentUser?.uid;
      if (uid) {
        UserService.getProfile(uid).then(result => {
          dispatch(setUserProfile(result.profile));
        });
      }
    };
    const currentUid = auth().currentUser?.uid;
    if (isRegisterCompleted.status && currentUid) {
      getProfile();
    }
  }, [isRegisterCompleted, auth().currentUser?.uid]);

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
