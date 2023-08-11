export const UPDATE_USER_PROFILE = 'UPDATE_USER_PROFILE';
export const INIT_USER_PROFILE = 'INIT_USER_PROFILE';

export const updateUserProfile = (field:string, value:any) => ({
  type: UPDATE_USER_PROFILE,
  payload: { field, value }
});

export const initUserProfile = (profile:any) => ({
    type: INIT_USER_PROFILE,
    payload: profile
});