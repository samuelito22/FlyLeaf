import {TYPES} from '../../constants';

export const UPDATE_USER_PROFILE = 'UPDATE_USER_PROFILE' as const;
export const UPDATE_FORMAT= 'UPDATE_FORMAT' as const;
export const INIT_USER_PROFILE = 'INIT_USER_PROFILE' as const;


interface updateUserProfileAction {
  type: 'UPDATE_USER_PROFILE';
  payload: {field: string; value: any};
}

interface updateFormatAction {
  type: 'UPDATE_FORMAT';
  payload: {field: 'removedPictures' | 'newPictures' | 'userResponses' | 'gender'; value: any};
}

interface InitUserProfileAction {
  type: typeof INIT_USER_PROFILE;
  payload: TYPES.currentUserProfile;
}

export type UserProfileUpdatesActionTypes = 
  updateUserProfileAction |
  updateFormatAction |
  InitUserProfileAction;

// Thunk action creator for updating user profile
export const updateUserProfile = (field: string, value: any) => ({
  type: UPDATE_USER_PROFILE,
  payload: {field, value},
});

// Thunk action creator for initializing user profile
export const initUserProfile =
  (userProfile: TYPES.currentUserProfile) =>
  (dispatch: (action: InitUserProfileAction) => void) => {
    dispatch({
      type: INIT_USER_PROFILE,
      payload: userProfile,
    });
  };

  export const updateFormat = (field: 'removedPictures' | 'newPictures' | 'userResponses' | 'gender', value: any) => ({
    type: UPDATE_FORMAT,
    payload: {field, value},
  });
  