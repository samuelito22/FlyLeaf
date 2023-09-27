// Define the action types
export const SET_FIRST_NAME = 'SET_FIRST_NAME' as const;
export const SET_DATE_OF_BIRTH = 'SET_DATE_OF_BIRTH' as const;
export const SET_PRIMARY_GENDER_ID = 'SET_PRIMARY_GENDER_ID' as const;
export const SET_SECONDARY_GENDER_ID = 'SET_SECONDARY_GENDER_ID' as const;
export const SET_EMAIL = 'SET_EMAIL' as const;
export const SET_PHONE_NUMBER = 'SET_PHONE_NUMBER' as const;
export const SET_LONGITUDE = 'SET_LONGITUDE' as const;
export const SET_LATITUDE = 'SET_LATITUDE' as const;
export const SET_INTERESTS_IDS = 'SET_INTERESTS_IDS' as const;
export const SET_ANSWERS = 'SET_ANSWERS' as const;
export const SET_RELATIONSHIP_GOAL_ID = 'SET_RELATIONSHIP_GOAL_ID' as const;
export const SET_SEEKING_IDS = 'SET_SEEKING_IDS' as const;
export const RESET_REGISTER = 'RESET_REGISTER' as const;
export const SET_IS_REGISTER_COMPLETED = 'SET_IS_REGISTER_COMPLETED' as const;
export const SET_PICTURES = 'SET_PICTURES' as const;
export const SET_PROGRESS_BAR_VALUE = 'SET_PROGRESS_BAR_VALUE' as const



import {TYPES} from '../../constants';

interface SetPicturesAction {
  type: typeof SET_PICTURES;
  payload: string[];
}

interface SetProgressBarValueAction {
  type: typeof SET_PROGRESS_BAR_VALUE;
  payload: number;
}

interface SetFirstNameAction {
  type: typeof SET_FIRST_NAME;
  payload: string;
}

interface SetDateOfBirthAction {
  type: typeof SET_DATE_OF_BIRTH;
  payload: Date;
}

interface SetPrimaryGenderIdAction {
  type: typeof SET_PRIMARY_GENDER_ID;
  payload: number;
}

interface SetSecondaryGenderIdAction {
  type: typeof SET_SECONDARY_GENDER_ID;
  payload: number;
}

interface SetEmailAction {
  type: typeof SET_EMAIL;
  payload: string;
}

interface SetPhoneNumberAction {
  type: typeof SET_PHONE_NUMBER;
  payload: string;
}

interface SetLongitudeAction {
  type: typeof SET_LONGITUDE;
  payload: number;
}

interface SetLatitudeAction {
  type: typeof SET_LATITUDE;
  payload: number;
}

interface SetInterestsIdsAction {
  type: typeof SET_INTERESTS_IDS;
  payload: number[];
}

interface SetAnswersAction {
  type: typeof SET_ANSWERS;
  payload: { questionId: number; answerId: number }[];
}

interface SetRelationshipGoalIdAction {
  type: typeof SET_RELATIONSHIP_GOAL_ID;
  payload: number;
}

interface SetSeekingIdsAction {
  type: typeof SET_SEEKING_IDS;
  payload: number[];
}

interface ResetRegisterAction {
  type: typeof RESET_REGISTER;
}

interface SetIsRegisterCompletedAction {
  type: typeof SET_IS_REGISTER_COMPLETED;
  payload: {
    status: boolean;
    currentScreen: keyof TYPES.RootStackParamList | null;
  };
}

export type RegisterActionTypes = 
  SetFirstNameAction |
  SetDateOfBirthAction |
  SetPrimaryGenderIdAction |
  SetSecondaryGenderIdAction |
  SetEmailAction |
  SetPhoneNumberAction |
  SetLongitudeAction |
  SetLatitudeAction |
  SetInterestsIdsAction |
  SetPicturesAction |
  SetAnswersAction |
  SetRelationshipGoalIdAction |
  SetSeekingIdsAction |
  ResetRegisterAction |
  SetIsRegisterCompletedAction |
  SetProgressBarValueAction;

// Register action creators
export const setFirstName = (firstName: string) => (dispatch: (action: SetFirstNameAction) => void) => {
  dispatch({ type: SET_FIRST_NAME, payload: firstName });
};

export const setDateOfBirth = (dateOfBirth: Date) => (dispatch: (action: SetDateOfBirthAction) => void) => {
  dispatch({ type: SET_DATE_OF_BIRTH, payload: dateOfBirth });
};

export const setPrimaryGenderId = (id: number) => (dispatch: (action: SetPrimaryGenderIdAction) => void) => {
  dispatch({ type: SET_PRIMARY_GENDER_ID, payload: id });
};

export const setSecondaryGenderId = (id: number) => (dispatch: (action: SetSecondaryGenderIdAction) => void) => {
  dispatch({ type: SET_SECONDARY_GENDER_ID, payload: id });
};

export const setEmail = (email: string) => (dispatch: (action: SetEmailAction) => void) => {
  dispatch({ type: SET_EMAIL, payload: email });
};

export const setPhoneNumber = (phoneNumber: string) => (dispatch: (action: SetPhoneNumberAction) => void) => {
  dispatch({ type: SET_PHONE_NUMBER, payload: phoneNumber });
};

export const setLongitude = (longitude: number) => (dispatch: (action: SetLongitudeAction) => void) => {
  dispatch({ type: SET_LONGITUDE, payload: longitude });
};

export const setLatitude = (latitude: number) => (dispatch: (action: SetLatitudeAction) => void) => {
  dispatch({ type: SET_LATITUDE, payload: latitude });
};

export const setInterestsIds = (ids: number[]) => (dispatch: (action: SetInterestsIdsAction) => void) => {
  dispatch({ type: SET_INTERESTS_IDS, payload: ids });
};

export const setPictures =
  (pictures: string[]) => (dispatch: (action: SetPicturesAction) => void) => {
    dispatch({
      type: SET_PICTURES,
      payload: pictures,
    });
  };

export const setAnswers = (answers: { questionId: number, answerId: number }[]) => (dispatch: (action: SetAnswersAction) => void) => {
  dispatch({ type: SET_ANSWERS, payload: answers });
};

export const setRelationshipGoalId = (id: number) => (dispatch: (action: SetRelationshipGoalIdAction) => void) => {
  dispatch({ type: SET_RELATIONSHIP_GOAL_ID, payload: id });
};

export const setSeekingIds = (ids: number[]) => (dispatch: (action: SetSeekingIdsAction) => void) => {
  dispatch({ type: SET_SEEKING_IDS, payload: ids });
};

export const resetRegister = () => (dispatch: (action: ResetRegisterAction) => void) => {
  dispatch({ type: RESET_REGISTER });
};

export const setIsRegisterCompleted =
  (isRegisterCompleted: {
    status: boolean;
    currentScreen: keyof TYPES.RootStackParamList | null;
  }) =>
  (dispatch: (action: SetIsRegisterCompletedAction) => void) => {
    dispatch({
      type: SET_IS_REGISTER_COMPLETED,
      payload: isRegisterCompleted,
    });
  };

  export const setProgressBarValue =
  (progressBarValue: number) =>
  (dispatch: (action: SetProgressBarValueAction) => void) => {
    dispatch({
      type: SET_PROGRESS_BAR_VALUE,
      payload: progressBarValue,
    });
  };