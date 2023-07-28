import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { TYPES } from "../../constants";
import * as appStatusActions from "../actions/appStatusActions"

export const initialStateAppStatus: TYPES.InitialStateAppStatusType = {
    showLocationScreen: false,
    isBlocked: false,
    locationFetchComplete: false,
    profileFetchComplete: false
};

const appStatusReducer = (
    state = initialStateAppStatus,
    action: TYPES.AppAction,
): TYPES.InitialStateAppStatusType => {
    switch (action.type) {
        case appStatusActions.SET_SHOW_LOCATION_SCREEN:
            return { ...state, showLocationScreen: action.payload as boolean };
        case appStatusActions.SET_IS_BLOCKED:
            return { ...state, isBlocked: action.payload as boolean }
            case appStatusActions.SET_LOCATION_FETCH_COMPLETE:
              return { ...state,locationFetchComplete: action.payload as boolean };
              case appStatusActions.SET_PROFILE_FETCH_COMPLETE:
                return { ...state, profileFetchComplete: action.payload as boolean };
        default:
            return state;
    }
};

const persistConfig = {
    key: 'appStatus',
    storage,
    whitelist: ['isBlocked'], // only isBlocked will be persisted
};

export default persistReducer(persistConfig, appStatusReducer);
