export const SET_USER_PROFILE = 'SET_USER_PROFILE';
export const SET_CURRENT_USER_ID = 'SET_CURRENT_USER_ID';
export const REMOVE_USER_PROFILE = 'REMOVE_USER_PROFILE';

import {TYPES} from '../../constants';

// Set user profile action
export const setUserProfile =
  (userId: string, userData: any) => 
  (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_USER_PROFILE,
      payload: { id: userId, data: userData },
    });
  };

// Set current user ID action
export const setCurrentUserId =
  (userId: string) => 
  (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_CURRENT_USER_ID,
      payload: userId,
    });
  };

// Remove user profile action
export const removeUserProfile =
  (userId: string) => 
  (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: REMOVE_USER_PROFILE,
      payload: userId,
    });
  };






