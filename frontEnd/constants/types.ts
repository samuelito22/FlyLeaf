import React, { ReactNode } from 'react';
import { ImageSourcePropType, ViewStyle, TextStyle, TextInputProps, StyleProp } from 'react-native';
import {UserDocument} from "../../UserDocument"
import {SpotifyDocument} from "../../SpotifyDocument"
import {InstagramDocument } from "../../InstagramDocument"
import { rootReducer } from '../redux/store';

export interface LayoutChangeEvent {
  nativeEvent: {
    layout: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
}

/**
 * Button Related Props
 */
export interface ButtonProps {
  style?: ViewStyle;
  onPress?: () => void;
  children?: ReactNode;
  width?: number,
  height?: number,
  textStyle?: TextStyle
}

export interface InterestsButtonProps extends ButtonProps{
  active: boolean;
  icon?: string | null
}

export interface ButtonImageProps extends ButtonProps {
  imgUrl: ImageSourcePropType;
  tintColor?: string;
  contentContainerStyle?: ViewStyle,
  iconHeaderLeft?: boolean,
  iconHeaderRight?: boolean
}

export interface ClickableIndicatorPrimaryButton extends ButtonProps {
  children?: ReactNode;
  isActive: boolean;
}

/**
 * Alert Prop
 */
export interface AlertProps {
  title: string;
  message: string;
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * UploadSelectionAlert Prop
 */

export interface UploadSelectionAlertProps {
  visible: boolean;
  onClose: () => void;
  onGalleryPress: () => void;
  onTakePhotoPress: () => void;
}

/**
 * Dropdown Related Props
 */
export interface Country {
  name: string;
  code: string;
  mask: string;
  iso: string;
}

export interface DropdownItemProps {
  item: Country;
  handleOptionPress: (item: Country) => void;
}

export type RenderItemProps = DropdownItemProps;

export interface DropdownProps {
  borderColor: string;
  defaultValue?: string;
  setMask: (mask: string) => void;
  setDialingCode: (code: string) => void;
}

/**
 * TextInput Props
 */
export interface TextFieldProps extends TextInputProps {
  placeholder: string;
  text: string;
  setText: (text: string) => void;
  style?: ViewStyle;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?:
    | 'default'
    | 'number-pad'
    | 'decimal-pad'
    | 'numeric'
    | 'email-address'
    | 'phone-pad';
  secureTextEntry?: boolean;
  multiLine?: boolean
}

export interface OTPFieldProps {
  OTPLength: number;
  OTP: string;
  setOTP: React.Dispatch<React.SetStateAction<string>>;
  style?: ViewStyle;
}

export interface DateFieldProps {
  setDate: (date: string) => void;
  style?: ViewStyle;
}

/**
 * Container Props
 */
export interface ContainerProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export type KeyboardAvoidingViewWrapperProps = ContainerProps;

export type SafeContainerProps = ContainerProps;

export type SeparatorProps = ContainerProps;

/**
 * User Profile Card
 */

export interface UserProfileCardProps {
  about: string;
  firstName: string;
  age: string;
  city: string | undefined;
  statusText: string;
  interests: string[];
  movementActive?: boolean;
  dailyThoughts?: string;
}

/**
 * Progress Related Props
 */
export interface ProgressBarProps {
  height?: number;
  color: string;
  transparency?: number;
  progress?: number;
  style?: object;
}

export interface ProgressContextType {
  setProgress: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * Redux Actions
 */

interface SetPhoneNumberAction {
  type: 'SET_PHONE_NUMBER';
  payload: string;
}

interface SetDateOfBirthAction {
  type: 'SET_DATE_OF_BIRTH';
  payload: Date;
}

interface SetFirstNameAction {
  type: 'SET_FIRST_NAME';
  payload: string;
}

interface SetGenderPreferencesAction {
  type: 'SET_GENDER_PREFERENCES';
  payload: string[];
}

interface setAdditionalInformation {
  type: 'SET_ADDITIONAL_INFORMATION';
  payload: {question: string, answer: string, icon: string}[] | null;
}

interface SetGenderAction {
  type: 'SET_GENDER';
  payload: { general: string; specific?: string | undefined; }
}

interface SetPicturesAction {
  type: 'SET_PICTURES';
  payload: string[];
}

interface SetEmailAction {
  type: 'SET_EMAIL';
  payload: string;
}

interface SetRelationshipGoalAction {
  type: 'SET_RELATIONSHIP_GOAL';
  payload: string;
}

interface SetShowLocationScreenAction {
  type: 'SET_SHOW_LOCATION_SCREEN';
  payload: boolean;
}

interface SetIsRegisterCompletedAction {
  type: 'SET_IS_REGISTER_COMPLETED';
  payload: {
    status: boolean;
    currentScreen: keyof RootStackParamList | null;
  };
}

interface SetProgressBarValueAction {
  type: 'SET_PROGRESS_BAR_VALUE';
  payload: number;
}

interface SetQuestionAndAnswerAction {
  type: 'SET_QUESTION_AND_ANSWER';
  payload: {question: string; answer: string}[];
}

interface SetInterestsAction {
  type: 'SET_INTERESTS';
  payload: string[];
}

interface resetRegisterAction {
  type: 'RESET_REGISTER';
}

interface SetUserProfileAction {
  type: 'SET_USER_PROFILE';
  payload: { id: string; data: any }; 
}

interface SetCurrentUserIdAction {
  type: 'SET_CURRENT_USER_ID';
  payload: string;
}

interface RemoveUserProfileAction {
  type: 'REMOVE_USER_PROFILE';
  payload: string;
}

interface setIsBlocked { 
  type: 'SET_IS_BLOCKED';
  payload: boolean
}

interface setIsLocationFetchComplete { 
  type: 'SET_IS_LOCATION_FETCH_COMPLETE';
  payload: boolean
}

interface setIsProfileFetchComplete { 
  type: 'SET_IS_PROFILE_FETCH_COMPLETE';
  payload: boolean
}

interface setIsLoggedIn { 
  type: 'SET_IS_LOGGED_IN';
  payload: boolean
}


interface setIsRefreshSpotifyComplete {
  type: 'SET_IS_REFRESH_SPOTIFY_COMPLETE';
  payload: boolean
}

interface updateUserProfile {
  type: 'UPDATE_USER_PROFILE';
  payload: {field: string, value: any};
}

interface initUserProfile {
  type: 'INIT_USER_PROFILE';
  payload: userProfileDataStructure
}

interface setQuestionsList { 
  type: 'SET_QUESTIONS_LIST';
  payload: {id: number, question: string, answers: any}[]
}

interface setInterestsList {
  type: 'SET_INTERESTS_LIST';
  payload: {question:string, answers:{title:string, interests:{title:string, icon:string}[]}[]}
}

export type AppAction =
setInterestsList | 
setQuestionsList
|updateUserProfile
|initUserProfile
| setAdditionalInformation
  | SetPhoneNumberAction
  | SetDateOfBirthAction
  | SetFirstNameAction
  | SetGenderPreferencesAction
  | SetGenderAction
  | SetPicturesAction
  | SetEmailAction
  | SetRelationshipGoalAction
  | SetShowLocationScreenAction
  | SetIsRegisterCompletedAction
  | SetProgressBarValueAction
  | SetQuestionAndAnswerAction
  | SetInterestsAction
  | resetRegisterAction
  | SetUserProfileAction
  | SetCurrentUserIdAction
  | RemoveUserProfileAction
  | setIsBlocked
  | setIsLocationFetchComplete
  | setIsProfileFetchComplete
  | setIsLoggedIn
  | setIsRefreshSpotifyComplete

export interface InitialStateRegisterType {
  dateOfBirth: Date | null;
  firstName: string | null;
  genderPreferences: string[] | null;
  gender: { general: string; specific?: string | undefined; } | null;
  pictures: string[] | null;
  email: string | null;
  relationshipGoal: string | null;
  phoneNumber: string | null;
  progressBarValue: number;
  additionalInformation: {question: string; answer: string, icon: string}[] | null;
  interests: string[];
  isRegisterCompleted: {
    status: boolean;
    currentScreen: keyof RootStackParamList | null;
  };
  questionsList: {id: number, question: string, answers: any}[] | null
  interestsList: {question:string, answers:{title:string, interests:{title:string, icon:string}[]}[]} | null

}

export interface InitialStateAppStatusType {
  showLocationScreen: boolean;
  isBlocked: boolean;
  isLocationFetchComplete:boolean;
  isProfileFetchComplete: boolean;
  isLoggedIn: boolean;
  isRefreshSpotifyComplete: boolean
}


export interface userProfileDataStructure {
  user: UserDocument;
  spotify?: SpotifyDocument;
  instagram?: InstagramDocument;
}

export interface InitialStateUsersType {
  byId: Record<string, userProfileDataStructure>;
  currentUserId: string | null;
}


export interface InitialStateEditUserType {
  modalVisible: boolean;
  bio: string;
  instagram: {
    isConnected?: boolean;
    instagram_id?: string;
    images: any,
  } | null;
  spotify: {
    isConnected?: boolean;
    spotify_id?: string;
    artists:any
  } | null;
  height:{ feets: string; inches: string; } | undefined
  interests: string[];
  additionalInformation: {
    question: string;
    answer: string;
    icon: number;
  }[];
  jobTitle: string | undefined;
  company: string | undefined;
  gender: {
    general: string;
    specific?: string;
  } | null;
  sexualOrientation: string[] | undefined;
  pictures: string[];
  languages: string[] | undefined;
  covidVaccination: string | undefined;
  ethnicity: string | undefined
}

/**
 * Redux stor - App State
 */

export type AppState = ReturnType<typeof rootReducer>;

/**
 * RootStackParamList for navigator
 */
export type RootStackParamList = {
  // AUTH
  // Register
  REGISTER_NAVIGATOR: undefined;
  REGISTER_FIRST_NAME_SCREEN: undefined;
  REGISTER_DATE_OF_BIRTH_SCREEN: undefined;
  REGISTER_GENDER_PREFERENCE_SCREEN: undefined;
  REGISTER_GENDER_SELECTION_SCREEN: undefined;
  REGISTER_PICTURE_UPLOAD_SCREEN: undefined;
  REGISTER_RECOVERY_EMAIL_SCREEN: undefined;
  REGISTER_RELATIONSHIP_GOAL_SCREEN: undefined;
  REGISTER_MULTIPLE_QUESTIONS_SCREEN: undefined;
  REGISTER_TERMS_AND_CONDITIONS_SCREEN: undefined;
  REGISTER_WELCOME_SCREEN: undefined;
  REGISTER_INTEREST_SCREEN: undefined;

  // Login
  LOGIN_NAVIGATOR: undefined;
  LOGIN_START_SCREEN: undefined;
  LOGIN_OTP_SCREEN: {phoneNumber: string};

  EMAIL_VERIFICATION_SCREEN: {
    actionType: 'register' | 'login';
    email: string;
  };

  LOCATION_SCREEN: undefined;

  // Bottom tab navigator
  BOTTOM_TAB_NAVIGATOR: undefined;

  // Profile
  
  USER_PROFILE_SCREEN: undefined;
  PUBLIC_PROFILE_SCREEN: undefined;
  EDIT_PROFILE_SCREEN: undefined;
  EDIT_GENDER_SCREEN: undefined;
  EDIT_SEXUAL_ORIENTATION_SCREEN: undefined
  EDIT_LANGUAGE_SCREEN: undefined;
  EDIT_JOB_TITLE_SCREEN: undefined;
  EDIT_COMPANY_SCREEN: undefined;
  EDIT_VACCINE_SCREEN: undefined;
  EDIT_ETHNICITY_SCREEN: undefined;
  PROFILE_NAVIGATOR: undefined
};

/**
 * Services
 */

export interface UserRegisterParams {
  uid: string;
  profile: {
    firstName: string;
    dateOfBirth: Date;
    gender: { general: string; specific?: string | undefined; }
    pictures?: string[];
  };
  preferences: {
    genderPreferences: string[];
    relationshipGoal: string;
  };
  contact: {
    email?: string;
    phoneNumber?: string;
  };
  interests: {
    interests: string[];
    additionalInformation: { question: string; answer: string; icon: string }[];
  };
}




export type PositionType = {
  latitude: number;
    longitude: number;
};

export type oAuth2WebViewType = {
  isVisible: boolean, 
  onCodeReceived: (code: string) => void, 
  config: {
    authorizationEndpoint: string, 
    clientId: string, 
    redirectUrl: string,
    scopes: string[]
  }, 
  onClose: () => void
}