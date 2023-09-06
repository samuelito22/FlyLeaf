import {TYPES} from '../../constants';
import * as editUserActions from '../actions/editProfileActions';

const initialStateEditUser: TYPES.InitialStateEditUserType = {
  modalVisible: false,
  bio: '',
  instagram: null,
  spotify: null,
  interests: [],
  additionalInformation: [],
  gender: null,
  pictures: [],
  height: undefined,
  jobTitle: undefined,
  company: undefined,
  ethnicity: undefined,
  covidVaccination: undefined,
  sexualOrientation: undefined,
  languages: undefined,
  questionsList: null,
  interestsList: null,
};

const editUserReducer = (
  state = initialStateEditUser,
  action: TYPES.AppAction,
): TYPES.InitialStateEditUserType => {
  switch (action.type) {
    case editUserActions.INIT_USER_PROFILE:
      return {
        ...state,
        bio: action.payload.user.profile?.bio,
        instagram: {
          ...action.payload.user.profile?.instagram,
          images: action.payload.instagram,
        },
        spotify: {
          ...action.payload.user.profile?.spotify,
          artists: action.payload.spotify,
        },
        height: action.payload.user.profile?.height,
        interests: action.payload.user.interests?.interests,
        additionalInformation:
          action.payload.user.interests?.additionalInformation,
        jobTitle: action.payload.user.profile?.jobTitle,
        company: action.payload.user.profile?.company,
        gender: action.payload.user.profile?.gender,
        sexualOrientation: action.payload.user.preferences?.sexualOrientation,
        pictures: action.payload.user.profile?.pictures,
        languages: action.payload.user.interests?.languages,
        covidVaccination: action.payload.user.interests?.covidVaccination,
        ethnicity: action.payload.user.interests?.ethnicity,
      };
    case editUserActions.UPDATE_USER_PROFILE:
      const {field, value} = action.payload;
      return {
        ...state,
        [field]: value,
      };
    case editUserActions.SET_QUESTIONS_LIST:
      return {
        ...state,
        questionsList: action.payload as {
          id: number;
          question: string;
          answers: any;
          shortForm: string;
          icon: string;
        }[],
      };
    case editUserActions.SET_INTERESTS_LIST:
      return {
        ...state,
        interestsList: action.payload as {
          question: string;
          answers: {
            title: string;
            interests: {title: string; icon: string}[];
          }[];
        },
      };
    default:
      return state;
  }
};

export default editUserReducer;
