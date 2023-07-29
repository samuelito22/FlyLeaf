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
import {
  editSetBio,
  editSetHeight,
  editSetAdditionalInformation,
  editSetGenderInformation,
  editSetJobTitle,
  editSetCompany,
  editSetSexualOrientation,
  editSetModalVisible,
  editSetLanguages,
  editInitUserProfile,
} from './actions/editProfileActions';
import {setUserProfile,setCurrentUserId, removeUserProfile} from './actions/userActions';
import { setIsBlocked, setIsProfileFetchComplete,setIsLocationFetchComplete,setShowLocationScreen, setIsLoggedIn } from './actions/appStatusActions';

import {Store, Persistor} from './store';

// Export the action creators
export {
  setIsBlocked,
  setIsLocationFetchComplete,
  setIsProfileFetchComplete,
  setDateOfBirth,
  setFirstName,
  setGenderPreferences,
  setGender,
  setPictures,
  setEmail,
  setRelationshipGoal,
  setPhoneNumber,
  Store,
  setShowLocationScreen,
  setIsRegisterCompleted,
  Persistor,
  setProgressBarValue,
  setAdditionalInformation,
  setInterests,
  resetRegister,
  setUserProfile,
  editSetBio,
  editSetHeight,
  editSetAdditionalInformation,
  editSetGenderInformation,
  editSetJobTitle,
  editSetCompany,
  editSetSexualOrientation,
  editSetModalVisible,
  editSetLanguages,
  editInitUserProfile,
  setCurrentUserId,
  removeUserProfile,
  setIsLoggedIn
};
