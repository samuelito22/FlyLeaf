// Define the action types
export const SET_PHONE_NUMBER = 'SET_PHONE_NUMBER';
export const SET_DATE_OF_BIRTH = 'SET_DATE_OF_BIRTH';
export const SET_FIRST_NAME = 'SET_FIRST_NAME';
export const SET_GENDER_PREFERENCES = 'SET_GENDER_PREFERENCES';
export const SET_GENDER = 'SET_GENDER';
export const SET_PICTURES = 'SET_PICTURES';
export const SET_EMAIL = 'SET_EMAIL';
export const SET_RELATIONSHIP_GOAL = 'SET_RELATIONSHIP_GOAL';
export const SET_IS_REGISTER_COMPLETED = 'SET_IS_REGISTER_COMPLETED';
export const SET_PROGRESS_BAR_VALUE = 'SET_PROGRESS_BAR_VALUE';
export const SET_ADDITIONAL_INFORMATION = 'SET_ADDITIONAL_INFORMATION';
export const SET_INTERESTS = 'SET_INTERESTS';
export const RESET_REGISTER = 'RESET_REGISTER';


import {TYPES} from '../../constants';

// Register
export const setPhoneNumber =
  (phoneNumber: string) => (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_PHONE_NUMBER,
      payload: phoneNumber,
    });
  };

export const setDateOfBirth =
  (dateOfBirth: Date) => (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_DATE_OF_BIRTH,
      payload: dateOfBirth,
    });
  };

export const setFirstName =
  (firstName: string) => (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_FIRST_NAME,
      payload: firstName,
    });
  };

export const setGenderPreferences =
  (genderPreferences: string[]) =>
  (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_GENDER_PREFERENCES,
      payload: genderPreferences,
    });
  };

export const setGender =
  (gender: {general: string; specific: string | null}) =>
  (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_GENDER,
      payload: gender,
    });
  };

export const setPictures =
  (pictures: string[]) => (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_PICTURES,
      payload: pictures,
    });
  };

export const setEmail =
  (email: string) => (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_EMAIL,
      payload: email,
    });
  };

export const setRelationshipGoal =
  (relationshipGoal: string) =>
  (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_RELATIONSHIP_GOAL,
      payload: relationshipGoal,
    });
  };

export const setIsRegisterCompleted =
  (isRegisterCompleted: {
    status: boolean;
    currentScreen: keyof TYPES.RootStackParamList | null;
  }) =>
  (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_IS_REGISTER_COMPLETED,
      payload: isRegisterCompleted,
    });
  };

export const setProgressBarValue =
  (progressBarValue: number) =>
  (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_PROGRESS_BAR_VALUE,
      payload: progressBarValue,
    });
  };

export const setAdditionalInformation =
  (additionalInformation: {question: string; answer: string, icon: string}[]) =>
  (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_ADDITIONAL_INFORMATION,
      payload: additionalInformation,
    });
  };

export const setInterests =
  (interests: string[]) => (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_INTERESTS,
      payload: interests,
    });
  };

export const resetRegister = (): TYPES.AppAction => ({
  type: RESET_REGISTER,
});

