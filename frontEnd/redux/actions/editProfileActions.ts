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
export const EDIT_SET_PICTURES = 'EDIT_SET_PICTURES'
export const EDIT_SET_COORDINATES = 'EDIT_SET_COORDINATES'


import {TYPES} from '../../constants';

// Edit profile
export const editSetBio = (bio: string) => (dispatch: (action: TYPES.AppAction) => void) => {
  dispatch({
    type: EDIT_SET_BIO,
    payload: bio,
  });
};

export const editSetPictures =
  (pictures: string[]) => (dispatch: (action: TYPES.AppAction) => void) => {
    dispatch({
      type: EDIT_SET_PICTURES,
      payload: pictures,
    });
  };

export const editSetCoordinates = (coordinates: { topLeft: { x: number, y: number }, bottomRight: { x: number, y: number } }[]) => (dispatch: (action: TYPES.AppAction) => void) => {
  dispatch({
    type: EDIT_SET_COORDINATES,
    payload: coordinates
  })
}

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
