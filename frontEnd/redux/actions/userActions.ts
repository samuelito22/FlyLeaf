export const SET_USER_PROFILE = 'SET_USER_PROFILE' as const;
export const SET_CURRENT_USER_ID = 'SET_CURRENT_USER_ID' as const;
export const REMOVE_USER_PROFILE = 'REMOVE_USER_PROFILE' as const;
export const SET_QUESTIONS = 'SET_QUESTIONS' as const;
export const SET_INTERESTS = 'SET_INTERESTS' as const;
export const SET_GENDERS = 'SET_GENDERS' as const;
export const SET_LANGUAGES = 'SET_LANGUAGES' as const;
export const SET_ANSWERS = 'SET_ANSWERS' as const
export const SET_RELATIONSHIP_GOALS = 'SET_RELATIONSHIP_GOALS' as const

import {TYPES} from '../../constants';


interface SetCurrentUserIdAction {
  type: typeof SET_CURRENT_USER_ID;
  payload: string;
}

interface RemoveUserProfileAction {
  type: typeof REMOVE_USER_PROFILE;
  payload: string;
}


interface SetUserProfileAction {
  type: typeof SET_USER_PROFILE;
  payload: {id: string; data: any};
}

// Update setQuestionsList interface
interface SetQuestionsAction {
  type: typeof SET_QUESTIONS;
  payload: {
    id: number;
    text: string;
    shortForm: string;
    iconPath: string;
    type: 'Advanced' | 'Basic';
  }[];
}

// Update setInterestsList interface
interface SetInterestsAction {
  type: typeof SET_INTERESTS;
  payload: {
    id: number;
    text: string;
    categoryId: number;
    category: {
      id: number;
      text: string;
    };
  }[];
}

// Update setLanguagesList interface
interface SetLanguagesAction {
  type: typeof SET_LANGUAGES;
  payload: {
    id: number;
    text: string;
  }[];
}

interface SetRelationshipGoalsAction {
  type: typeof SET_RELATIONSHIP_GOALS;
  payload: {
    id: number;
    text: string;
  }[];
}


// Update setGendersList interface
interface SetGendersAction {
  type: typeof SET_GENDERS;
  payload: {
    primaryGenders: {
      id: number;
      text: string;
    }[];
    secondaryGenders: {
      id: number;
      text: string;
      primaryGenderId: number;
    }[];
  };
}

interface SetAnswersAction {
  type: typeof SET_ANSWERS;
  payload: {
    id: number;
    text: string;
    questionId: number;
  }[];
}

export type UserProfileActionTypes =
  SetUserProfileAction |
  SetCurrentUserIdAction |
  RemoveUserProfileAction |
  SetQuestionsAction |
  SetInterestsAction |
  SetGendersAction |
  SetLanguagesAction |
  SetAnswersAction |
  SetRelationshipGoalsAction;

// Set user profile action
export const setUserProfile =
  (userId: string, userData: TYPES.currentUserProfile) =>
  (dispatch: (action: SetUserProfileAction) => void) => {
    dispatch({
      type: SET_USER_PROFILE,
      payload: {id: userId, data: userData},
    });
  };

// Set current user ID action
export const setCurrentUserId =
  (userId: string) => (dispatch: (action: SetCurrentUserIdAction) => void) => {
    dispatch({
      type: SET_CURRENT_USER_ID,
      payload: userId,
    });
  };

// Remove user profile action
export const removeUserProfile =
  (userId: string) => (dispatch: (action: RemoveUserProfileAction) => void) => {
    dispatch({
      type: REMOVE_USER_PROFILE,
      payload: userId,
    });
  };
  export const setQuestions =
  (
    questions: {
      id: number;
      text: string;
      shortForm: string;
      iconPath: string;
      type: 'Advanced' | 'Basic';
    }[],
  ) =>
  (dispatch: (action: SetQuestionsAction) => void) => {
    dispatch({
      type: SET_QUESTIONS,
      payload: questions,
    });
  };

// Set interests list action
export const setInterests =
  (
    interests: {
      id: number;
      text: string;
      categoryId: number;
      category: {
        id: number;
        text: string;
      };
    }[],
  ) =>
  (dispatch: (action: SetInterestsAction) => void) => {
    dispatch({
      type: SET_INTERESTS,
      payload: interests,
    });
  };

// Set genders list action
export const setGenders =
  (
    genders: {
      primaryGenders: {
        id: number;
        text: string;
      }[];
      secondaryGenders: {
        id: number;
        text: string;
        primaryGenderId: number;
      }[];
    },
  ) =>
  (dispatch: (action: SetGendersAction) => void) => {
    dispatch({
      type: SET_GENDERS,
      payload: genders,
    });
  };

// Set languages list action
export const setLanguages =
  (
    languages: {
      id: number;
      text: string;
    }[],
  ) =>
  (dispatch: (action: SetLanguagesAction) => void) => {
    dispatch({
      type: SET_LANGUAGES,
      payload: languages,
    });
  };

  export const setRelationshipGoals =
  (
    relationshipGoals: {
      id: number;
      text: string;
    }[],
  ) =>
  (dispatch: (action: SetRelationshipGoalsAction) => void) => {
    dispatch({
      type: SET_RELATIONSHIP_GOALS,
      payload: relationshipGoals,
    });
  };

// Set answers list action
export const setAnswers =
  (
    answers: {
      id: number;
      text: string;
      questionId: number;
    }[],
  ) =>
  (dispatch: (action: SetAnswersAction) => void) => {
    dispatch({
      type: SET_ANSWERS,
      payload: answers,
    });
  };