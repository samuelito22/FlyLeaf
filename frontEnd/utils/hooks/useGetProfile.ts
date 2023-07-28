import {useEffect} from 'react'
import useDispatch from './useDispatch';
import { TYPES } from '../../constants';
import { useSelector } from 'react-redux';
import { setCurrentUserId, setUserProfile } from '../../redux';
import { UserService } from '../../services';
import auth from "@react-native-firebase/auth"

const useGetProfile = () => {
  const dispatch = useDispatch();
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
          dispatch(setUserProfile(uid, result.profile));
          dispatch(setCurrentUserId(uid));
        } catch (e) {
          console.log(e);
          if (retryCount < MAX_RETRIES) {
            getProfile(retryCount + 1);
          }
        }
        return () => controller.abort();
      }
    };

    if (currentUserId) {
      getProfile();
    }
  }, [currentUserId]);
}

export default useGetProfile;


