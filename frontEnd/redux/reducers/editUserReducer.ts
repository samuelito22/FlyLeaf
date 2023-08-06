import { TYPES } from "../../constants";
import * as  editUserAction from "../actions/editProfileActions"

const initialStateEditUser: TYPES.InitialStateEditUserType = {
    bio: '',
    height: null,
    additionalInformation: null,
    genderInformation: null,
    jobTitle: '',
    company: '',
    sexualOrientation: null,
    modalVisible: false,
    languages: [],
    pictures: null,
    coordinates: [...Array(6)].map(() => ({ topLeft: { x: 0, y: 0 }, bottomRight: { x: 0, y: 0 } }))
  };

const editUserReducer = (
    state = initialStateEditUser,
    action: TYPES.AppAction,
  ): TYPES.InitialStateEditUserType => {
    switch (action.type) {
      case editUserAction.EDIT_SET_BIO:
        return {...state, bio: action.payload as string | null};
        case editUserAction.EDIT_SET_PICTURES:
          return {...state, pictures: action.payload as string[] | null};
      case editUserAction.EDIT_SET_HEIGHT:
        return {...state, height: action.payload as {feet: number, inches: number} | null};
      case editUserAction.EDIT_SET_ADDITIONAL_INFORMATION:
        return {...state, additionalInformation: action.payload as {question: string, answer: string, icon: string}[]};
      case editUserAction.EDIT_SET_GENDER_INFORMATION:
        return {...state, genderInformation: action.payload as {general: string, specific: string | null}};
      case editUserAction.EDIT_SET_JOB_TITLE:
        return {...state, jobTitle: action.payload as string | null};
      case editUserAction.EDIT_SET_COMPANY:
        return {...state, company: action.payload as string | null};
      case editUserAction.EDIT_SET_SEXUAL_ORIENTATION:
        return {...state, sexualOrientation: action.payload as string[] | null};
      case editUserAction.EDIT_SET_COORDINATES: 
        return {...state, coordinates: action.payload as { topLeft: { x: number, y: number }, bottomRight: { x: number, y: number } }[]}
      case editUserAction.EDIT_SET_MODAL_VISIBLE:
        return {...state, modalVisible: action.payload as boolean};
      case editUserAction.EDIT_SET_LANGUAGES:
        return {...state, languages: action.payload as string[] | null};
        case editUserAction.EDIT_INIT_USER_PROFILE:
          return {
            ...initialStateEditUser,
            bio: action.payload.profile.bio,
            pictures: action.payload.profile.pictures,
            height: action.payload.profile.height,
            additionalInformation: action.payload.interests.additionalInformation,
            genderInformation: action.payload.profile.gender,
            jobTitle: action.payload.profile.jobTitle,
            company: action.payload.profile.company,
            sexualOrientation: action.payload.preferences.sexualOrientation,
            languages: action.payload.languages,
          };
      default:
        return state;
    }
  };

  export default editUserReducer