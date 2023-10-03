// Import the action creators
import * as RegisterActions from './actions/registerActions';
import * as EditProfileActions from './actions/editProfileActions';
import * as UserActions from './actions/userActions';
import * as AppStatusActions from './actions/appStatusActions';

import {Store, Persistor} from './store';

export type AppAction = 
  EditProfileActions.UserProfileUpdatesActionTypes | 
  RegisterActions.RegisterActionTypes | 
  UserActions.UserProfileActionTypes | 
  AppStatusActions.AppStatusActionTypes;

export {
  AppStatusActions,
  RegisterActions,
  Store,
  Persistor,
  UserActions,
  EditProfileActions,
};
