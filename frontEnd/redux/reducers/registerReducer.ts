import * as registerActions from '../actions/registerActions';
import {TYPES} from '../../constants';
import {ObjectId} from 'mongodb';

const initialStateRegister: TYPES.InitialStateRegisterType = {
  dateOfBirth: null,
  username: '',
  seeking: [],
  gender: null,
  pictures: [],
  email: '',
  relationshipGoal: null,
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
    case registerActions.SET_DATE_OF_BIRTH:
      return {...state, dateOfBirth: action.payload as Date};
    case registerActions.SET_USERNAME:
      return {...state, username: action.payload as string};
    case registerActions.SET_SEEKING:
      return {...state, seeking: action.payload as ObjectId[]};
    case registerActions.SET_GENDER:
      return {
        ...state,
        gender: action.payload as {primary: ObjectId; secondary?: ObjectId},
      };
    case registerActions.SET_PICTURES:
      return {...state, pictures: action.payload as string[]};
    case registerActions.SET_EMAIL:
      return {...state, email: action.payload as string};
    case registerActions.SET_RELATIONSHIP_GOAL:
      return {...state, relationshipGoal: action.payload as ObjectId};
    case registerActions.SET_PHONE_NUMBER:
      return {...state, phoneNumber: action.payload as string};
    case registerActions.SET_PROGRESS_BAR_VALUE:
      return {...state, progressBarValue: action.payload as number};
    case registerActions.SET_ADDITIONAL_INFORMATION:
      return {
        ...state,
        additionalInformation: action.payload as [
          {questionId: ObjectId; answerId: ObjectId},
        ],
      };
    case registerActions.SET_IS_REGISTER_COMPLETED:
      return {
        ...state,
        isRegisterCompleted: action.payload as {
          status: boolean;
          currentScreen: keyof TYPES.RootStackParamList | null;
        },
      };
    case registerActions.RESET_REGISTER:
      console.log('Resetting register...');
      let resetState = initialStateRegister;
      console.log('Reset State:', resetState);
      return resetState;
    default:
      return state;
  }
};

export default registerReducer;
