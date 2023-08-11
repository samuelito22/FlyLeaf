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
      case editUserAction.INIT_USER_PROFILE:
        return {
            ...state,
            ...action.payload
    };
    case editUserAction.UPDATE_USER_PROFILE:
            const { field, value } = action.payload;
            return {
                ...state,
                [field]: value
            };
      default:
        return state;
    }
  };

  export default editUserReducer