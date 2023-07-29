import {TYPES} from '../../constants';
export const SET_SHOW_LOCATION_SCREEN = 'SET_SHOW_LOCATION_SCREEN';
export const SET_IS_BLOCKED = 'SET_IS_BLOCKED';
export const SET_IS_LOCATION_FETCH_COMPLETE = 'SET_IS_LOCATION_FETCH_COMPLETE'
export const SET_IS_PROFILE_FETCH_COMPLETE = 'SET_IS_PROFILE_FETCH_COMPLETE'
export const SET_IS_LOGGED_IN = 'SET_IS_LOGGED_IN'

export const setShowLocationScreen =
  (showLocationScreen: boolean) =>
  (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_SHOW_LOCATION_SCREEN,
      payload: showLocationScreen,
    });
  };

  export const setIsBlocked =
  (isBlocked: boolean) =>
  (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_IS_BLOCKED,
      payload: isBlocked,
    });
  };

  export const setIsLocationFetchComplete =
  (locationFetchComplete: boolean) =>
  (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_IS_LOCATION_FETCH_COMPLETE,
      payload: locationFetchComplete,
    });
  };

  export const setIsProfileFetchComplete =
  (profileFetchComplete: boolean) =>
  (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_IS_PROFILE_FETCH_COMPLETE,
      payload: profileFetchComplete,
    });
  };


  export const setIsLoggedIn =
  (isLoggedIn: boolean) =>
  (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_IS_LOGGED_IN,
      payload: isLoggedIn,
    });
  };