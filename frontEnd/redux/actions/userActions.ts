export const SET_USER_PROFILE = 'SET_USER_PROFILE' as const;
export const SET_CURRENT_USER_ID = 'SET_CURRENT_USER_ID' as const;
export const REMOVE_USER_PROFILE = 'REMOVE_USER_PROFILE' as const;
export const SET_QUESTIONS_LIST = 'SET_QUESTIONS_LIST' as const;
export const SET_INTERESTS_LIST = 'SET_INTERESTS_LIST' as const;
export const SET_GENDERS_LIST = 'SET_GENDERS_LIST' as const;
export const SET_LANGUAGES_LIST = 'SET_LANGUAGES_LIST' as const;

import {TYPES} from '../../constants';
import {ObjectId} from 'mongodb';

// Set user profile action
export const setUserProfile =
  (userId: string, userData: TYPES.currentUserProfile) =>
  (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_USER_PROFILE,
      payload: {id: userId, data: userData},
    });
  };

// Set current user ID action
export const setCurrentUserId =
  (userId: string) => (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_CURRENT_USER_ID,
      payload: userId,
    });
  };

// Remove user profile action
export const removeUserProfile =
  (userId: string) => (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: REMOVE_USER_PROFILE,
      payload: userId,
    });
  };

export const setQuestionsList =
  (
    questions: {
      _id: ObjectId;
      question: string;
      shortForm: string;
      icon: string;
      answers: {_id: ObjectId; text: string}[];
      type: 'Advanced' | 'Basic';
    }[],
  ) =>
  (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_QUESTIONS_LIST,
      payload: questions,
    });
  };

// Set interests list action
export const setInterestsList =
  (
    interests: {_id: ObjectId; category: string; name: string; icon: string}[],
  ) =>
  (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_INTERESTS_LIST,
      payload: interests,
    });
  };

// Set genders list action
export const setGendersList =
  (
    genders: {
      _id: ObjectId;
      primary: string;
      secondary: {_id: ObjectId; text: string}[];
    }[],
  ) =>
  (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_GENDERS_LIST,
      payload: genders,
    });
  };

// Set languages list action
export const setLanguagesList =
  (languages: {_id: ObjectId; code: string; name: string}[]) =>
  (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_LANGUAGES_LIST,
      payload: languages,
    });
  };
