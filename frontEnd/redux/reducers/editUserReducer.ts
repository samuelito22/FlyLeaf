import {TYPES} from '../../constants';
import * as editUserActions from '../actions/editProfileActions';

const initialStateEditUser: TYPES.InitialStateEditUserType = {
  userProfile: null,
  userResponses: [],
  newPictures: [],
  removedPictures: [],
  gender: undefined
};

interface AnyObject {
  [key: string]: any;
}

const updateNestedObject = <T extends AnyObject>(obj: T, path: string[], value: any): T => {
  if (path.length === 1) {
    return { ...obj, [path[0]]: value } as T;
  }
  const [first, ...rest] = path;
  
  let nextObj = obj[first];
  if (typeof nextObj !== 'object' || nextObj === null) {
    // If it's not an object or it's null, initialize it as an empty object
    nextObj = {};
  }

  return {
    ...obj,
    [first]: updateNestedObject(nextObj, rest, value)
  } as T;
}




const editUserReducer = (
  state = initialStateEditUser,
  action: editUserActions.UserProfileUpdatesActionTypes,
): TYPES.InitialStateEditUserType => {
  let field: string;
  let value: any;

  switch (action.type) {
    case editUserActions.INIT_USER_PROFILE:
      return {
        ...state,
        userProfile: action.payload
      }
      case editUserActions.UPDATE_FORMAT:
          ( {field, value} = action.payload);
          return {
            ...state,
            [field]: value
          };
      case editUserActions.UPDATE_USER_PROFILE:
        ( {field, value} = action.payload);
        if (!state.userProfile) return state;
        
        // Split the field string by '.' to get an array path
        const fieldPath = field.split('.');
        
        return {
          ...state,
          userProfile: updateNestedObject(state.userProfile, fieldPath, value)
        };
        
        
    default:
      return state;
  }
};

export default editUserReducer;
