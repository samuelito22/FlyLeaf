import {combineReducers} from 'redux';
import registerReducer from './registerReducer';
import appStatusReducer from './appStatusReducer';
import usersReducer from './usersReducer';
import editUserReducer from './editUserReducer';

export default combineReducers({
  registerReducer,
  appStatusReducer,
  usersReducer,
  editUserReducer,
});
