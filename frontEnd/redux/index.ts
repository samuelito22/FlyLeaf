// Import the action creators
import {
  setDateOfBirth,
  setFirstName,
  setGenderPreferences,
  setGender,
  setPictures,
  setEmail,
  setRelationshipGoal,
  setPhoneNumber,
  setIsRegisterCompleted,
  setProgressBarValue,
  setAdditionalInformation,
  setInterests,
  resetRegister,
} from './actions/registerActions';
import 
  * as EditProfileActions
 from './actions/editProfileActions';
import * as UserActions from './actions/userActions';
import * as AppStatusActions from './actions/appStatusActions';

import {Store, Persistor} from './store';

// Export the action creators
export {
  AppStatusActions,
  setDateOfBirth,
  setFirstName,
  setGenderPreferences,
  setGender,
  setPictures,
  setEmail,
  setRelationshipGoal,
  setPhoneNumber,
  Store,
  setIsRegisterCompleted,
  Persistor,
  setProgressBarValue,
  setAdditionalInformation,
  setInterests,
  resetRegister,
  UserActions,
  EditProfileActions
};
