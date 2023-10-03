import {TYPES} from '../../constants';

// Define the action types
export const SET_PRIMARY_GENDER_ID = 'editProfile/SET_PRIMARY_GENDER_ID' as const;
export const SET_SECONDARY_GENDER_ID = 'editProfile/SET_SECONDARY_GENDER_ID' as const;
export const SET_INTERESTS_IDS = 'editProfile/SET_INTERESTS_IDS' as const;
export const SET_ANSWERS = 'editProfile/SET_ANSWERS' as const;
export const SET_SEEKING_IDS = 'editProfile/SET_SEEKING_IDS' as const;
export const SET_PICTURES_TO_ADD = 'editProfile/SET_PICTURES_TO_ADD' as const;
export const SET_PICTURES_TO_REMOVE = 'editProfile/SET_PICTURES_TO_REMOVE' as const;
export const INIT_USER_PROFILE = 'editProfile/INIT_USER_PROFILE' as const;
export const SET_BIO = 'editProfile/SET_BIO' as const;
export const SET_JOB_TITLE = 'editProfile/SET_JOB_TITLE' as const
export const SET_EMPLOYER = 'editProfile/SET_EMPLOYER' as const
export const SET_TOP_ARTISTS = 'editProfile/SET_TOP_ARTISTS' as const;
export const SET_INSTAGRAM_IMAGES = 'editProfile/SET_INSTAGRAM_IMAGES' as const
export const SET_LANGUAGES_IDS = 'editProfile/SET_LANGUAGES_IDS' as const
export const SET_HEIGHT = 'editProfile/SET_HEIGHT' as const


interface InitUserProfileAction {
  type: typeof INIT_USER_PROFILE;
  payload: TYPES.CurrentUser;
}

  interface SetBioAction {
    type: typeof SET_BIO;
    payload: string;
  }

  interface SetJobTitleAction {
    type: typeof SET_JOB_TITLE;
    payload: string;
  }
  
  interface SetEmployerAction {
    type: typeof SET_EMPLOYER;
    payload: string;
  }
  
  
interface SetPicturesToAddAction {
  type: typeof SET_PICTURES_TO_ADD;
  payload: string[];
}

interface SetPicturesToRemoveAction {
  type: typeof SET_PICTURES_TO_REMOVE;
  payload: ('picture-0' | 'picture-1' | 'picture-2' | 'picture-3' | 'picture-4' | 'picture-5') [];
}


interface SetPrimaryGenderIdAction {
  type: typeof SET_PRIMARY_GENDER_ID;
  payload: number;
}

interface SetHeightAction {
  type: typeof SET_HEIGHT;
  payload: number | undefined;
}

interface SetSecondaryGenderIdAction {
  type: typeof SET_SECONDARY_GENDER_ID;
  payload: number | undefined;
}

interface SetInterestsIdsAction {
  type: typeof SET_INTERESTS_IDS;
  payload: number[];
}

interface SetAnswersAction {
  type: typeof SET_ANSWERS;
  payload: { questionId: number; answerId: number }[];
}

interface SetSeekingIdsAction {
  type: typeof SET_SEEKING_IDS;
  payload: number[];
}

interface SetLanguagesIdsAction {
  type: typeof SET_LANGUAGES_IDS;
  payload: number[];
}

interface SetInstagramImagesAction {
  type: typeof SET_INSTAGRAM_IMAGES;
  payload: TYPES.InstagramImages[];
}

interface SetTopArtistsAction {
  type: typeof SET_TOP_ARTISTS;
  payload: TYPES.UserTopArtists[];
}

export type UserProfileUpdatesActionTypes = 
  InitUserProfileAction |
  SetPrimaryGenderIdAction |
  SetSecondaryGenderIdAction |
  SetInterestsIdsAction |
  SetPicturesToAddAction |
  SetPicturesToRemoveAction |
  SetAnswersAction |
  SetSeekingIdsAction |
  SetBioAction |
  SetJobTitleAction |
  SetEmployerAction |
  SetTopArtistsAction |
  SetInstagramImagesAction |
  SetHeightAction |
  SetLanguagesIdsAction
 

export const setPrimaryGenderId = (id: number) => (dispatch: (action: SetPrimaryGenderIdAction) => void) => {
  dispatch({ type: SET_PRIMARY_GENDER_ID, payload: id });
};

export const setSecondaryGenderId = (id: number | undefined) => (dispatch: (action: SetSecondaryGenderIdAction) => void) => {
  dispatch({ type: SET_SECONDARY_GENDER_ID, payload: id });
};

export const setInterestsIds = (ids: number[]) => (dispatch: (action: SetInterestsIdsAction) => void) => {
  dispatch({ type: SET_INTERESTS_IDS, payload: ids });
};

export const setAnswers = (answers: { questionId: number, answerId: number }[]) => (dispatch: (action: SetAnswersAction) => void) => {
  dispatch({ type: SET_ANSWERS, payload: answers });
};

export const setSeekingIds = (ids: number[]) => (dispatch: (action: SetSeekingIdsAction) => void) => {
  dispatch({ type: SET_SEEKING_IDS, payload: ids });
};

export const initUserProfile =
  (userProfile: TYPES.CurrentUser) =>
  (dispatch: (action: InitUserProfileAction) => void) => {
    dispatch({
      type: INIT_USER_PROFILE,
      payload: userProfile,
    });
  };

  export const setBio = (bio: string) => (dispatch: (action: SetBioAction) => void) => {
    dispatch({ type: SET_BIO, payload: bio });
  };

  export const setJobTitle = (jobTitle: string) => (dispatch: (action: SetJobTitleAction) => void) => {
    dispatch({ type: SET_JOB_TITLE, payload: jobTitle });
  };

  export const setEmployer = (employer: string) => (dispatch: (action: SetEmployerAction) => void) => {
    dispatch({ type: SET_EMPLOYER, payload: employer });
  };

  export const setTopArtists = (topArtists: TYPES.UserTopArtists[]) => (dispatch: (action: SetTopArtistsAction) => void) => {
    dispatch({ type: SET_TOP_ARTISTS, payload: topArtists });
  };

  export const setInstagramImages = (instagramImages: TYPES.InstagramImages[]) => (dispatch: (action: SetInstagramImagesAction) => void) => {
    dispatch({ type: SET_INSTAGRAM_IMAGES, payload: instagramImages });
  };

  export const setLanguagesIds = (ids: number[]) => (dispatch: (action: SetLanguagesIdsAction) => void) => {
    dispatch({ type: SET_LANGUAGES_IDS, payload: ids });
  };

  export const setHeight = (height: number | undefined) => (dispatch: (action: SetHeightAction) => void) => {
    dispatch({ type: SET_HEIGHT, payload: height });
  };
  
  export const setPicturesToAdd = (pictures: string[]) => (dispatch: (action: SetPicturesToAddAction) => void) => {
    dispatch({ type: SET_PICTURES_TO_ADD, payload: pictures });
  };

  export const setPicturesToRemove = (pictures: ('picture-0' | 'picture-1' | 'picture-2' | 'picture-3' | 'picture-4' | 'picture-5') []) => (dispatch: (action: SetPicturesToRemoveAction) => void) => {
    dispatch({ type: SET_PICTURES_TO_REMOVE, payload: pictures });
  };