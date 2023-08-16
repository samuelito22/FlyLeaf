import { TYPES } from "../../constants";
import * as  editUserAction from "../actions/editProfileActions"

const initialStateEditUser: TYPES.InitialStateEditUserType = {
    modalVisible: false,
    bio: "",
    instagram: null,
    spotify: null,
    height: null,
    interests: [],
    additionalInformation: [],
    jobTitle: "",
    company: "",
    gender: null,
    sexualOrientation: [],
    pictures: [],
    languages: [],
    uid: "",
    covidVaccination: "",
    ethnicity: ""
};

const editUserReducer = (
    state = initialStateEditUser,
    action: TYPES.AppAction
): TYPES.InitialStateEditUserType => {
    switch (action.type) {
        case editUserAction.INIT_USER_PROFILE:
            return {
                ...state,
                bio: action.payload.profile?.bio,
                instagram: {...action.payload.profile?.instagram, images: action.payload.instagram},
                spotify: {...action.payload.profile?.spotify, artists: action.payload.spotify},
                height: action.payload.profile?.height,
                interests: action.payload.interests?.interests,
                additionalInformation: action.payload.interests?.additionalInformation,
                jobTitle: action.payload.profile?.jobTitle,
                company: action.payload.profile?.company,
                gender: action.payload.profile?.gender,
                sexualOrientation: action.payload.preferences?.sexualOrientation,
                pictures: action.payload.profile?.pictures,
                languages: action.payload.interests?.languages,
                uid: action.payload.uid,
                covidVaccination: action.payload.interests?.covidVaccination,
                ethnicity: action.payload.interests?.ethnicity,
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

export default editUserReducer;
