import {TYPES} from '../../constants';
export const SET_SHOW_LOCATION_SCREEN = 'SET_SHOW_LOCATION_SCREEN';
export const SET_IS_BLOCKED = 'SET_IS_BLOCKED';
export const SET_LOCATION_FETCH_COMPLETE = 'SET_LOCATION_FETCH_COMPLETE'
export const SET_PROFILE_FETCH_COMPLETE = 'SET_PROFILE_FETCH_COMPLETE'

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

  export const setLocationFetchComplete =
  (locationFetchComplete: boolean) =>
  (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_IS_BLOCKED,
      payload: locationFetchComplete,
    });
  };

  export const setProfileFetchComplete =
  (profileFetchComplete: boolean) =>
  (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_IS_BLOCKED,
      payload: profileFetchComplete,
    });
  };