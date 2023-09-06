import {TYPES} from '../../constants';

export const UPDATE_USER_PROFILE = 'UPDATE_USER_PROFILE' as const;
export const INIT_USER_PROFILE = 'INIT_USER_PROFILE' as const;
export const SET_QUESTIONS_LIST = 'SET_QUESTIONS_LIST' as const;
export const SET_INTERESTS_LIST = 'SET_INTERESTS_LIST' as const;

// Thunk action creator for updating user profile
export const updateUserProfile = (field: string, value: any) => ({
  type: UPDATE_USER_PROFILE,
  payload: {field, value},
});

// Thunk action creator for initializing user profile
export const initUserProfile =
  (userProfile: TYPES.userProfileDataStructure) =>
  (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: INIT_USER_PROFILE,
      payload: userProfile,
    });
  };

export const setQuestionsList =
  (
    questionsList: {
      id: number;
      question: string;
      shortForm: string;
      icon: string;
      answers: any;
    }[],
  ) =>
  (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_QUESTIONS_LIST,
      payload: questionsList,
    });
  };

export const setInterestsList =
  (interestsList: {
    question: string;
    answers: {title: string; interests: {title: string; icon: string}[]}[];
  }) =>
  (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_INTERESTS_LIST,
      payload: interestsList,
    });
  };
