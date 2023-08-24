import * as registerActions from "../actions/registerActions"
import {TYPES} from '../../constants';
  
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
    questionsList: null,
    interestsList: null,
    isRegisterCompleted: {status: true, currentScreen: null},
  };

  const registerReducer = (
    state = initialStateRegister,
    action: TYPES.AppAction,
  ): TYPES.InitialStateRegisterType => {
    switch (action.type) {
      case registerActions.SET_DATE_OF_BIRTH:
        return {...state, dateOfBirth: action.payload as Date};
      case registerActions.SET_FIRST_NAME:
        return {...state, firstName: action.payload as string};
      case registerActions.SET_GENDER_PREFERENCES:
        return {...state, genderPreferences: action.payload as string[]};
      case registerActions.SET_GENDER:
        return {
          ...state,
          gender: action.payload as { general: string; specific?: string },
        };
      case registerActions.SET_PICTURES:
        return {...state, pictures: action.payload as string[]};
      case registerActions.SET_EMAIL:
        return {...state, email: action.payload as string};
      case registerActions.SET_RELATIONSHIP_GOAL:
        return {...state, relationshipGoal: action.payload as string};
      case registerActions.SET_PHONE_NUMBER:
        return {...state, phoneNumber: action.payload as string};
      case registerActions.SET_PROGRESS_BAR_VALUE:
        return {...state, progressBarValue: action.payload as number};
      case registerActions.SET_ADDITIONAL_INFORMATION:
        return {
          ...state,
          additionalInformation: action.payload as [
            {question: string; answer: string, icon: string},
          ],
        };
      case registerActions.SET_INTERESTS:
        return {...state, interests: action.payload as string[]};
      case registerActions.SET_IS_REGISTER_COMPLETED:
        return {
          ...state,
          isRegisterCompleted: action.payload as {
            status: boolean;
            currentScreen: keyof TYPES.RootStackParamList | null;
          },
        };
        case registerActions.SET_QUESTIONS_LIST:
          return {...state, questionsList: action.payload as { id: number; question: string; answers: any, shortForm:string, icon: string}[]};
          case registerActions.SET_INTERESTS_LIST:
            return {...state, interestsList: action.payload as {question:string, answers:{title:string, interests:{title:string, icon:string}[]}[]}};
      case registerActions.RESET_REGISTER:
        console.log('Resetting register...');
        let resetState = initialStateRegister;
        console.log('Reset State:', resetState);
        return resetState;
      default:
        return state;
    }
  };

  export default registerReducer