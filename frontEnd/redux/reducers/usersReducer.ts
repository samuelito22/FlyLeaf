import {TYPES} from '../../constants';

import * as userAction from '../actions/userActions';

const initialStateUsers: TYPES.InitialStateUsersType = {
  byId: {},
  currentUserId: null,
  questions: null,
  interests: null,
  genders: null,
  languages: null,
  answers: null,
  relationshipGoals: null
};

const usersReducer = (state = initialStateUsers, action: userAction.UserProfileActionTypes): TYPES.InitialStateUsersType => {
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

    case userAction.SET_QUESTIONS:
      // Action payload should be an array of questions.
      return {
        ...state,
        questions: action.payload,
      };
    
      case userAction.SET_ANSWERS:
        // Action payload should be an array of questions.
        return {
          ...state,
          answers: action.payload,
        };

    case userAction.SET_INTERESTS:
      // Action payload should be an array of interests.
      return {
        ...state,
        interests: action.payload,
      };

    case userAction.SET_GENDERS:
      // Action payload should be an array of genders.
      return {
        ...state,
        genders: action.payload,
      };

    case userAction.SET_LANGUAGES:
      // Action payload should be an array of languages.
      return {
        ...state,
        languages: action.payload,
      };
    
      case userAction.SET_RELATIONSHIP_GOALS:
      // Action payload should be an array of languages.
      return {
        ...state,
        relationshipGoals: action.payload,
      };

    default:
      return state;
  }
};

export default usersReducer;
