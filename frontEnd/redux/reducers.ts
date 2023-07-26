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
  SET_INTERESTS,
  RESET_REGISTER,
  SET_USER_PROFILE,
  SET_ADDITIONAL_INFORMATION,
  EDIT_SET_BIO,
  EDIT_SET_HEIGHT,
  EDIT_SET_ADDITIONAL_INFORMATION,
  EDIT_SET_GENDER_INFORMATION,
  EDIT_SET_JOB_TITLE,
  EDIT_SET_COMPANY,
  EDIT_SET_SEXUAL_ORIENTATION,
  EDIT_SET_MODAL_VISIBLE,
  EDIT_SET_LANGUAGES,
  EDIT_INIT_USER_PROFILE
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
  additionalInformation: null,
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
    case SET_ADDITIONAL_INFORMATION:
      return {
        ...state,
        additionalInformation: action.payload as [
          {question: string; answer: string, icon: string},
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

const initialStateEditUser: TYPES.InitialStateEditUserType = {
  bio: '',
  height: null,
  additionalInformation: null,
  genderInformation: null,
  jobTitle: '',
  company: '',
  sexualOrientation: null,
  modalVisible: false,
  languages: []
};

const editUserReducer = (
  state = initialStateEditUser,
  action: TYPES.AppAction,
): TYPES.InitialStateEditUserType => {
  switch (action.type) {
    case EDIT_SET_BIO:
      return {...state, bio: action.payload as string | null};
    case EDIT_SET_HEIGHT:
      return {...state, height: action.payload as {feet: number, inches: number} | null};
    case EDIT_SET_ADDITIONAL_INFORMATION:
      return {...state, additionalInformation: action.payload as {question: string, answer: string, icon: string}[]};
    case EDIT_SET_GENDER_INFORMATION:
      return {...state, genderInformation: action.payload as {general: string, specific: string | null}};
    case EDIT_SET_JOB_TITLE:
      return {...state, jobTitle: action.payload as string | null};
    case EDIT_SET_COMPANY:
      return {...state, company: action.payload as string | null};
    case EDIT_SET_SEXUAL_ORIENTATION:
      return {...state, sexualOrientation: action.payload as string[] | null};
    case EDIT_SET_MODAL_VISIBLE:
      return {...state, modalVisible: action.payload as boolean};
    case EDIT_SET_LANGUAGES:
      return {...state, languages: action.payload as string[] | null};
    case EDIT_INIT_USER_PROFILE:
      let initState = initialStateEditUser;
      initState.bio = action.payload.profile.bio;
      initState.height = action.payload.profile.height;
      initState.additionalInformation = action.payload.interests.additionalInformation;
      initState.genderInformation = action.payload.profile.gender;
      initState.jobTitle = action.payload.profile.jobTitle;
      initState.company = action.payload.profile.company;
      initState.sexualOrientation = action.payload.preferences.sexualOrientation;
      initState.languages = action.payload.languages;
      return initState;
    default:
      return state;
  }
};

export {registerReducer, appStatusReducer, userReducer, editUserReducer};
