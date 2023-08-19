import { TYPES } from "../../constants";

export const UPDATE_USER_PROFILE = 'UPDATE_USER_PROFILE' as const;
export const INIT_USER_PROFILE = 'INIT_USER_PROFILE'  as const;

// Thunk action creator for updating user profile
export const updateUserProfile = (field: string, value: any) => ({
  type: UPDATE_USER_PROFILE,
  payload: { field, value }
});

// Thunk action creator for initializing user profile
export const initUserProfile = 
  (userProfile: TYPES.userProfileDataStructure) => 
  (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: INIT_USER_PROFILE,
      payload: userProfile
    });
  };
