import {TYPES} from '../../constants';
import * as editUserActions from '../actions/editProfileActions';

const initialStateEditUser: TYPES.InitialStateEditUserType = {
  bio: "",
  answers: [],
  primaryGenderId: 0,
  interestsIds: [],
  seekingIds: [],
  topArtists: [],
  secondaryGenderId: undefined,
  instagramImages: [],
  jobTitle: "",
  employer: "",
  height: undefined,
  languagesIds: [],
  pictures: [],
  picturesToAdd: [],
  picturesToRemove: [],
  id: ""
};

const editUserReducer = (
  state = initialStateEditUser,
  action: editUserActions.UserProfileUpdatesActionTypes,
): TYPES.InitialStateEditUserType => {

  switch (action.type) {
    case editUserActions.INIT_USER_PROFILE:
      return {
        ...state,
        bio: action.payload.bio,
        answers: action.payload.answers.map(item => ({ questionId: item.answer.questionId, answerId: item.answerId })),
        primaryGenderId: action.payload.primaryGenderId,
        interestsIds: action.payload.interests.map(item => item.interestId),
        seekingIds: action.payload.seeking.map(item => item.primaryGenderId),
        topArtists: action.payload.topArtists,
        secondaryGenderId: action.payload.secondaryGenderId,
        instagramImages: action.payload.instagramImages,
        jobTitle: action.payload.jobTitle,
        employer: action.payload.employer,
        height: action.payload.height,
        languagesIds: action.payload.languages?.map(item => item.id),
        pictures: action.payload.pictures,
        id: action.payload.id
      }

    case editUserActions.SET_BIO:
      return {
        ...state,
        bio: action.payload,
      };

    case editUserActions.SET_JOB_TITLE:
      return {
        ...state,
        jobTitle: action.payload,
      };

    case editUserActions.SET_EMPLOYER:
      return {
        ...state,
        employer: action.payload,
      };

    case editUserActions.SET_PRIMARY_GENDER_ID:
      return {
        ...state,
        primaryGenderId: action.payload,
      };

    case editUserActions.SET_SECONDARY_GENDER_ID:
      return {
        ...state,
        secondaryGenderId: action.payload,
      };

    case editUserActions.SET_INTERESTS_IDS:
      return {
        ...state,
        interestsIds: action.payload,
      };

    case editUserActions.SET_ANSWERS:
      return {
        ...state,
        answers: action.payload,
      };

    case editUserActions.SET_SEEKING_IDS:
      return {
        ...state,
        seekingIds: action.payload,
      };

    case editUserActions.SET_TOP_ARTISTS:
      return {
        ...state,
        topArtists: action.payload,
      };

    case editUserActions.SET_INSTAGRAM_IMAGES:
      return {
        ...state,
        instagramImages: action.payload,
      };

    case editUserActions.SET_LANGUAGES_IDS:
      return {
        ...state,
        languagesIds: action.payload,
      };

    case editUserActions.SET_HEIGHT:
      return {
        ...state,
        height: action.payload,
      };
      case editUserActions.SET_PICTURES_TO_ADD:
        return {
          ...state,
          picturesToAdd: action.payload,
        };
        case editUserActions.SET_PICTURES_TO_REMOVE:
        return {
          ...state,
          picturesToRemove: action.payload,
        };

    default:
      return state;
  }
};

export default editUserReducer;
