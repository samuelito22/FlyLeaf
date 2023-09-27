import * as registerActions from '../actions/registerActions';
import {TYPES} from '../../constants';

const initialStateRegister: TYPES.InitialStateRegisterType  = {
  firstName: '',
  dateOfBirth: null,
  primaryGenderId: 0,
  secondaryGenderId: null,
  email: '',
  phoneNumber: '',
  longitude: 0,
  latitude: 0,
  interestsIds: [],
  answers: [],
  relationshipGoalId: 0,
  seekingIds: [],
  isRegisterCompleted: {status: true, currentScreen: null},
  pictures: [],
  progressBarValue: 0

};

const registerReducer = (
  state = initialStateRegister,
  action: registerActions.RegisterActionTypes,
): TYPES.InitialStateRegisterType => {
  switch (action.type) {
    case registerActions.SET_FIRST_NAME:
      return {...state, firstName: action.payload as string};
    case registerActions.SET_DATE_OF_BIRTH:
      return {...state, dateOfBirth: action.payload as Date};
    case registerActions.SET_PRIMARY_GENDER_ID:
      return {...state, primaryGenderId: action.payload as number};
    case registerActions.SET_SECONDARY_GENDER_ID:
      return {...state, secondaryGenderId: action.payload as number};
    case registerActions.SET_EMAIL:
      return {...state, email: action.payload as string};
    case registerActions.SET_PHONE_NUMBER:
      return {...state, phoneNumber: action.payload as string};
    case registerActions.SET_LONGITUDE:
      return {...state, longitude: action.payload as number};
    case registerActions.SET_LATITUDE:
      return {...state, latitude: action.payload as number};
    case registerActions.SET_INTERESTS_IDS:
      return {...state, interestsIds: action.payload as number[]};
    case registerActions.SET_ANSWERS:
      return {...state, answers: action.payload as {questionId: number, answerId: number}[]};
      case registerActions.SET_PROGRESS_BAR_VALUE:
        return {...state, progressBarValue: action.payload as number};
    case registerActions.SET_RELATIONSHIP_GOAL_ID:
      return {...state, relationshipGoalId: action.payload as number};
    case registerActions.SET_SEEKING_IDS:
      return {...state, seekingIds: action.payload as number[]};
      case registerActions.SET_PICTURES:
        return {...state, pictures: action.payload as string[]};
      case registerActions.SET_IS_REGISTER_COMPLETED:
        return {
          ...state,
          isRegisterCompleted: action.payload as {
            status: boolean;
            currentScreen: keyof TYPES.RootStackParamList | null;
          },
        };
      case registerActions.RESET_REGISTER:
        let resetState = initialStateRegister;
        return resetState;
    default:
      return state;
  }
};

export default registerReducer;
