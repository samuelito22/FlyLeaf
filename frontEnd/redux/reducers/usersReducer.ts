import {TYPES} from '../../constants';

import * as userAction from '../actions/userActions';

const initialStateUsers: TYPES.InitialStateUsersType = {
  byId: {},
  currentUserId: null,
  questionsList: null,
  interestsList: null,
  gendersList: null,
  languagesList: null,
};

const usersReducer = (state = initialStateUsers, action: TYPES.AppAction) => {
  switch (action.type) {
    case userAction.SET_USER_PROFILE:
      // Action payload should be an object with user id and user data.
      const {id, data} = action.payload;

      // Add or update user in the "byId" map.
      return {
        ...state,
        byId: {
          ...state.byId,
          [id]: data,
        },
      };

    case userAction.SET_CURRENT_USER_ID:
      // Action payload should be the id of the current user.
      return {
        ...state,
        currentUserId: action.payload,
      };

    case userAction.REMOVE_USER_PROFILE:
      // Action payload should be the id of the user to be removed.
      const {[action.payload]: removedUser, ...restOfUsers} = state.byId;

      return {
        ...state,
        byId: restOfUsers,
      };

    case userAction.SET_QUESTIONS_LIST:
      // Action payload should be an array of questions.
      return {
        ...state,
        questionsList: action.payload,
      };

    case userAction.SET_INTERESTS_LIST:
      // Action payload should be an array of interests.
      return {
        ...state,
        interestsList: action.payload,
      };

    case userAction.SET_GENDERS_LIST:
      // Action payload should be an array of genders.
      return {
        ...state,
        gendersList: action.payload,
      };

    case userAction.SET_LANGUAGES_LIST:
      // Action payload should be an array of languages.
      return {
        ...state,
        languagesList: action.payload,
      };

    default:
      return state;
  }
};

export default usersReducer;
