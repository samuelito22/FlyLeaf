import {persistReducer} from 'redux-persist';
import {TYPES} from '../../constants';
import * as appStatusActions from '../actions/appStatusActions';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const initialStateAppStatus: TYPES.InitialStateAppStatusType = {
  isBlocked: false,
  currentScreen: undefined,
  isOnline: true
  
};

const appStatusReducer = (
  state = initialStateAppStatus,
  action: appStatusActions.AppStatusActionTypes,
): TYPES.InitialStateAppStatusType => {
  switch (action.type) {
    case appStatusActions.SET_IS_BLOCKED:
      return {...state, isBlocked: action.payload as boolean};
      case appStatusActions.SET_CURRENT_SCREEN:
        return {...state, currentScreen: action.payload as keyof TYPES.RootStackParamList};
        case appStatusActions.SET_IS_ONLINE:
          return {...state, isOnline: action.payload as boolean};
    default:
      return state;
  }
};

const persistConfig = {
  key: 'appStatus',
  storage: AsyncStorage,
  whitelist: ['isBlocked', 'currentScreen'],
};

export default persistReducer(persistConfig, appStatusReducer);
