// Define the action types
export const SET_PHONE_NUMBER = 'SET_PHONE_NUMBER';
export const SET_DATE_OF_BIRTH = 'SET_DATE_OF_BIRTH';
export const SET_FIRST_NAME = 'SET_FIRST_NAME';
export const SET_GENDER_PREFERENCES = 'SET_GENDER_PREFERENCES';
export const SET_GENDER = 'SET_GENDER';
export const SET_PICTURES = 'SET_PICTURES';
export const SET_EMAIL = 'SET_EMAIL';
export const SET_RELATIONSHIP_GOAL = 'SET_RELATIONSHIP_GOAL';
export const SET_SHOW_LOCATION_SCREEN = 'SET_SHOW_LOCATION_SCREEN';
export const SET_IS_REGISTER_COMPLETED = 'SET_IS_REGISTER_COMPLETED';
export const SET_PROGRESS_BAR_VALUE = 'SET_PROGRESS_BAR_VALUE';
export const SET_ADDITIONAL_INFORMATION = 'SET_ADDITIONAL_INFORMATION';
export const SET_INTERESTS = 'SET_INTERESTS';
export const RESET_REGISTER = 'RESET_REGISTER';
export const SET_USER_PROFILE = 'SET_USER_PROFILE';

export const EDIT_SET_BIO = 'EDIT_SET_BIO';
export const EDIT_SET_HEIGHT = 'EDIT_SET_HEIGHT';
export const EDIT_SET_ADDITIONAL_INFORMATION = 'EDIT_SET_ADDITIONAL_INFORMATION';
export const EDIT_SET_GENDER_INFORMATION = 'EDIT_SET_GENDER_INFORMATION';
export const EDIT_SET_JOB_TITLE = 'EDIT_SET_JOB_TITLE';
export const EDIT_SET_COMPANY = 'EDIT_SET_COMPANY';
export const EDIT_SET_SEXUAL_ORIENTATION = 'EDIT_SET_SEXUAL_ORIENTATION';
export const EDIT_SET_MODAL_VISIBLE = 'EDIT_SET_MODAL_VISIBLE';
export const EDIT_SET_LANGUAGES = 'EDIT_SET_LANGUAGES';
export const EDIT_INIT_USER_PROFILE = 'EDIT_INIT_USER_PROFILE';


import {TYPES} from '../constants';

// Register
export const setPhoneNumber =
  (phoneNumber: string) => (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_PHONE_NUMBER,
      payload: phoneNumber,
    });
  };

export const setDateOfBirth =
  (dateOfBirth: Date) => (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_DATE_OF_BIRTH,
      payload: dateOfBirth,
    });
  };

export const setFirstName =
  (firstName: string) => (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_FIRST_NAME,
      payload: firstName,
    });
  };

export const setGenderPreferences =
  (genderPreferences: string[]) =>
  (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_GENDER_PREFERENCES,
      payload: genderPreferences,
    });
  };

export const setGender =
  (gender: {general: string; specific: string | null}) =>
  (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_GENDER,
      payload: gender,
    });
  };

export const setPictures =
  (pictures: string[]) => (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_PICTURES,
      payload: pictures,
    });
  };

export const setEmail =
  (email: string) => (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_EMAIL,
      payload: email,
    });
  };

export const setRelationshipGoal =
  (relationshipGoal: string) =>
  (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_RELATIONSHIP_GOAL,
      payload: relationshipGoal,
    });
  };

export const setShowLocationScreen =
  (showLocationScreen: boolean) =>
  (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_SHOW_LOCATION_SCREEN,
      payload: showLocationScreen,
    });
  };

export const setIsRegisterCompleted =
  (isRegisterCompleted: {
    status: boolean;
    currentScreen: keyof TYPES.RootStackParamList | null;
  }) =>
  (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_IS_REGISTER_COMPLETED,
      payload: isRegisterCompleted,
    });
  };

export const setProgressBarValue =
  (progressBarValue: number) =>
  (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_PROGRESS_BAR_VALUE,
      payload: progressBarValue,
    });
  };

export const setAdditionalInformation =
  (additionalInformation: {question: string; answer: string, icon: string}[]) =>
  (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_ADDITIONAL_INFORMATION,
      payload: additionalInformation,
    });
  };

export const setInterests =
  (interests: string[]) => (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_INTERESTS,
      payload: interests,
    });
  };

export const resetRegister = (): TYPES.AppAction => ({
  type: RESET_REGISTER,
});

export const setUserProfile =
  (userProfile: any) => (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: SET_USER_PROFILE,
      payload: userProfile,
    });
  };



// Edit profile
export const editSetBio = (bio: string) => (dispatch: (action: TYPES.AppAction) => void) => {
  dispatch({
    type: EDIT_SET_BIO,
    payload: bio,
  });
};

export const editSetHeight = (height: {feet: number, inches: number}) => (dispatch: (action: TYPES.AppAction) => void) => {
  dispatch({
    type: EDIT_SET_HEIGHT,
    payload: height,
  });
};

export const editSetAdditionalInformation = (additionalInformation: {question: string, answer: string, icon: string}[]) => (dispatch: (action: TYPES.AppAction) => void) => {
  dispatch({
    type: EDIT_SET_ADDITIONAL_INFORMATION,
    payload: additionalInformation,
  });
};

export const editSetGenderInformation = (genderInformation: {general: string, specific: string | null}) => (dispatch: (action: TYPES.AppAction) => void) => {
  dispatch({
    type: EDIT_SET_GENDER_INFORMATION,
    payload: genderInformation,
  });
};

export const editSetJobTitle = (jobTitle: string) => (dispatch: (action: TYPES.AppAction) => void) => {
  dispatch({
    type: EDIT_SET_JOB_TITLE,
    payload: jobTitle,
  });
};

export const editSetCompany = (company: string) => (dispatch: (action: TYPES.AppAction) => void) => {
  dispatch({
    type: EDIT_SET_COMPANY,
    payload: company,
  });
};

export const editSetSexualOrientation = (sexualOrientation: string[]) => (dispatch: (action: TYPES.AppAction) => void) => {
  dispatch({
    type: EDIT_SET_SEXUAL_ORIENTATION,
    payload: sexualOrientation,
  });
};

export const editSetModalVisible = (modalVisible: boolean) => (dispatch: (action: TYPES.AppAction) => void) => {
  dispatch({
    type: EDIT_SET_MODAL_VISIBLE,
    payload: modalVisible,
  });
};

export const editSetLanguages = (languages: string[] | null) => (dispatch: (action: TYPES.AppAction) => void) => {
  dispatch({
    type: EDIT_SET_LANGUAGES,
    payload: languages,
  });
};

export const editInitUserProfile = (userProfile: any) => (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: EDIT_INIT_USER_PROFILE,
      payload: userProfile,
    });
  };
