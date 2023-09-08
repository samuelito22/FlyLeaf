import {TYPES} from '../../constants';
import * as editUserActions from '../actions/editProfileActions';

const initialStateEditUser: TYPES.InitialStateEditUserType = {
  userProfile: null
};

const editUserReducer = (
  state = initialStateEditUser,
  action: TYPES.AppAction,
): TYPES.InitialStateEditUserType => {
  switch (action.type) {
    case editUserActions.INIT_USER_PROFILE:
      return {
        ...state,
        userProfile:action.payload
      }
      case editUserActions.UPDATE_USER_PROFILE:
        const {field, value} = action.payload;
        return {
          ...state,
          userProfile: state.userProfile 
            ? { ...state.userProfile, [field]: value } 
            : null
        };
      
    default:
      return state;
  }
};

export default editUserReducer;
