import {useEffect} from 'react'
import useDispatch from './useDispatch';
import { TYPES } from '../../constants';
import { useSelector } from 'react-redux';
import { UserActions, AppStatusActions } from '../../redux';
import { SpotifyService, UserService } from '../../services';
import auth from "@react-native-firebase/auth"

const useRefreshSpotify = () => {
  const dispatch = useDispatch();

  const { isProfileFetchComplete} = useSelector(
    (state: TYPES.AppState) => state.appStatusReducer,
  );

  const {currentUserId, byId} = useSelector(
    (state: TYPES.AppState) => state.usersReducer,
  );

  const userProfile = byId[currentUserId]
  
  useEffect(() => {
    const MAX_RETRIES = 3;
    const refreshSpotify = async (retryCount = 0) => {
        if(userProfile.profile.spotify.isConnected){
            const lastRefreshed = new Date(userProfile.profile.spotify.lastUpdated)
            const currentDate = new Date();
            
            const diffTime = Math.abs(currentDate.getTime() - lastRefreshed.getTime());

            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

            if(diffDays <= 10) {
                SpotifyService().refetchSpotify(userProfile.uid).catch(e => console.log(e))
            }
        }

        //dispatch(AppStatusActions.setIsRefreshSpotifyComplete(true))
    };

    if (isProfileFetchComplete) {
      refreshSpotify();
    }

    
  }, [isProfileFetchComplete]);
}

export default useRefreshSpotify;


