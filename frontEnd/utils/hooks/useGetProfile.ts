import {useEffect} from 'react'
import useDispatch from './useDispatch';
import { TYPES } from '../../constants';
import { useSelector } from 'react-redux';
import { setCurrentUserId, setIsProfileFetchComplete, setUserProfile } from '../../redux';
import { UserService } from '../../services';
import auth from "@react-native-firebase/auth"

const useGetProfile = () => {
  const dispatch = useDispatch();

  const {isLocationFetchComplete} = useSelector(
    (state: TYPES.AppState) => state.appStatusReducer,
  );

  const {currentUserId} = useSelector(
    (state: TYPES.AppState) => state.usersReducer,
  );
  
  useEffect(() => {
    const MAX_RETRIES = 3;
    const getProfile = async (retryCount = 0) => {
      const uid = auth().currentUser?.uid;
      if (uid) {
        const controller = new AbortController();
        try {
          const result = await UserService.getProfile(uid, controller.signal);
          dispatch(setUserProfile(currentUserId, result.profile));
          dispatch(setCurrentUserId(uid));
          dispatch(setIsProfileFetchComplete(true))
          console.log("Profile Fetched")
        } catch (e) {
          console.log(e);
          if (retryCount < MAX_RETRIES) {
            getProfile(retryCount + 1);
          }
        }
        return () => controller.abort();
      }
    };

    if (isLocationFetchComplete) {
      getProfile();
    }
  }, [isLocationFetchComplete]);
}

export default useGetProfile;


