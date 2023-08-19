import {persistReducer} from 'redux-persist';
import {TYPES} from '../../constants';
import storage from 'redux-persist/lib/storage';
import * as appStatusActions from '../actions/appStatusActions';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const initialStateAppStatus: TYPES.InitialStateAppStatusType = {
  showLocationScreen: false,
  isBlocked: false,
  isLocationFetchComplete: false,
  isProfileFetchComplete: false,
  isLoggedIn: false,
  isRefreshSpotifyComplete: false
};

const appStatusReducer = (
  state = initialStateAppStatus,
  action: TYPES.AppAction,
): TYPES.InitialStateAppStatusType => {
  switch (action.type) {
    case appStatusActions.SET_SHOW_LOCATION_SCREEN:
      return {...state, showLocationScreen: action.payload as boolean};
    case appStatusActions.SET_IS_BLOCKED:
      return {...state, isBlocked: action.payload as boolean};
    case appStatusActions.SET_IS_LOCATION_FETCH_COMPLETE:
      return {...state, isLocationFetchComplete: action.payload as boolean};
    case appStatusActions.SET_IS_PROFILE_FETCH_COMPLETE:
      return {...state, isProfileFetchComplete: action.payload as boolean};
    case appStatusActions.SET_IS_LOGGED_IN:
      return {...state, isLoggedIn: action.payload as boolean};
      case appStatusActions.SET_IS_REFRESH_SPOTIFY_COMPLETE:
        return { ...state, isRefreshSpotifyComplete: action.payload as boolean };      
    default:
      return state;
  }
};

const persistConfig = {
  key: 'appStatus',
  storage: AsyncStorage,
  whitelist: ['isBlocked', 'isLoggedIn', 'spotifyToken'],
};

export default persistReducer(persistConfig, appStatusReducer);
