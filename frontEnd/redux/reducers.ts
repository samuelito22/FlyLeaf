import {
  SET_DATE_OF_BIRTH,
  SET_FIRST_NAME,
  SET_GENDER_PREFERENCES,
  SET_GENDER,
  SET_PICTURES,
  SET_EMAIL,
  SET_RELATIONSHIP_GOAL,
  SET_PHONE_NUMBER,
  SET_SHOW_LOCATION_SCREEN,
  SET_IS_REGISTER_COMPLETED,
  SET_PROGRESS_BAR_VALUE,
  SET_QUESTION_AND_ANSWER,
  SET_INTERESTS,
  RESET_REGISTER,
  SET_USER_PROFILE,
} from './actions';
import {TYPES} from '../constants';

const initialStateRegister: TYPES.InitialStateRegisterType = {
  dateOfBirth: null,
  firstName: '',
  genderPreferences: [],
  gender: null,
  pictures: [],
  email: '',
  relationshipGoal: '',
  phoneNumber: '',
  progressBarValue: 0,
  questionAndAnswer: null,
  interests: [],
  isRegisterCompleted: {status: true, currentScreen: null},
};

const registerReducer = (
  state = initialStateRegister,
  action: TYPES.AppAction,
): TYPES.InitialStateRegisterType => {
  switch (action.type) {
    case SET_DATE_OF_BIRTH:
      return {...state, dateOfBirth: action.payload as Date};
    case SET_FIRST_NAME:
      return {...state, firstName: action.payload as string};
    case SET_GENDER_PREFERENCES:
      return {...state, genderPreferences: action.payload as string[]};
    case SET_GENDER:
      return {
        ...state,
        gender: action.payload as {general: string; specific: string | null},
      };
    case SET_PICTURES:
      return {...state, pictures: action.payload as string[]};
    case SET_EMAIL:
      return {...state, email: action.payload as string};
    case SET_RELATIONSHIP_GOAL:
      return {...state, relationshipGoal: action.payload as string};
    case SET_PHONE_NUMBER:
      return {...state, phoneNumber: action.payload as string};
    case SET_PROGRESS_BAR_VALUE:
      return {...state, progressBarValue: action.payload as number};
    case SET_QUESTION_AND_ANSWER:
      return {
        ...state,
        questionAndAnswer: action.payload as [
          {question: string; answer: string},
        ],
      };
    case SET_INTERESTS:
      return {...state, interests: action.payload as string[]};
    case SET_IS_REGISTER_COMPLETED:
      return {
        ...state,
        isRegisterCompleted: action.payload as {
          status: boolean;
          currentScreen: keyof TYPES.RootStackParamList | null;
        },
      };
    case RESET_REGISTER:
      console.log('Resetting register...');
      let resetState = initialStateRegister;
      console.log('Reset State:', resetState);
      return resetState;
    default:
      return state;
  }
};

const initialStateAppStatus: TYPES.InitialStateAppStatusType = {
  showLocationScreen: false,
};

const appStatusReducer = (
  state = initialStateAppStatus,
  action: TYPES.AppAction,
): TYPES.InitialStateAppStatusType => {
  switch (action.type) {
    case SET_SHOW_LOCATION_SCREEN:
      return {...state, showLocationScreen: action.payload as boolean};
    default:
      return state;
  }
};

const initialStateUser: TYPES.InitialStateUserType = {
  userProfile: null,
};

const userReducer = (
  state = initialStateUser,
  action: TYPES.AppAction,
): TYPES.InitialStateUserType => {
  switch (action.type) {
    case SET_USER_PROFILE:
      return {...state, userProfile: action.payload as any};
    default:
      return state;
  }
};

export {registerReducer, appStatusReducer, userReducer};
