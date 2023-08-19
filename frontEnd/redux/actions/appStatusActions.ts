import {TYPES} from '../../constants';
export const SET_SHOW_LOCATION_SCREEN = 'SET_SHOW_LOCATION_SCREEN' as const;
export const SET_IS_BLOCKED = 'SET_IS_BLOCKED' as const;
export const SET_IS_LOCATION_FETCH_COMPLETE = 'SET_IS_LOCATION_FETCH_COMPLETE' as const;
export const SET_IS_PROFILE_FETCH_COMPLETE = 'SET_IS_PROFILE_FETCH_COMPLETE' as const;
export const SET_IS_LOGGED_IN = 'SET_IS_LOGGED_IN' as const;
export const SET_IS_REFRESH_SPOTIFY_COMPLETE = 'SET_IS_REFRESH_SPOTIFY_COMPLETE' as const;


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
  (isLocationFetchComplete: boolean) =>
  (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_IS_LOCATION_FETCH_COMPLETE,
      payload: isLocationFetchComplete,
    });
  };

  export const setIsProfileFetchComplete =
  (isProfileFetchComplete: boolean) =>
  (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_IS_PROFILE_FETCH_COMPLETE,
      payload: isProfileFetchComplete,
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

 export const setIsRefreshSpotifyComplete = (isRefreshSpotifyComplete: boolean) => (dispatch: (action: TYPES.AppAction) => void) => {
  dispatch({
    type: SET_IS_REFRESH_SPOTIFY_COMPLETE,
    payload: isRefreshSpotifyComplete,
  });
};