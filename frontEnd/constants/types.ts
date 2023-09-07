import React, {ReactNode} from 'react';
import {
  ImageSourcePropType,
  ViewStyle,
  TextStyle,
  TextInputProps,
  StyleProp,
} from 'react-native';
import {SpotifyDocument} from '../../SpotifyDocument';
import {InstagramDocument} from '../../InstagramDocument';
import {rootReducer} from '../redux/store';
import {ObjectId} from 'mongodb';

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
  width?: number;
  height?: number;
  textStyle?: TextStyle;
}

export interface InterestsButtonProps extends ButtonProps {
  active: boolean;
  icon?: string | null;
}

export interface ButtonImageProps extends ButtonProps {
  imgUrl: ImageSourcePropType;
  tintColor?: string;
  contentContainerStyle?: ViewStyle;
  iconHeaderLeft?: boolean;
  iconHeaderRight?: boolean;
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
  onClose?: () => void;
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
  multiLine?: boolean;
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

interface SetUsernameAction {
  type: 'SET_USERNAME';
  payload: string;
}

interface SetSeekingAction {
  type: 'SET_SEEKING';
  payload: ObjectId[];
}

interface setAdditionalInformation {
  type: 'SET_ADDITIONAL_INFORMATION';
  payload: {questionId: ObjectId; answerId: ObjectId}[] | null;
}

interface SetGenderAction {
  type: 'SET_GENDER';
  payload: {primary: ObjectId; secondary?: ObjectId | undefined};
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
  payload: ObjectId;
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
  payload: ObjectId[];
}

interface resetRegisterAction {
  type: 'RESET_REGISTER';
}

interface SetUserProfileAction {
  type: 'SET_USER_PROFILE';
  payload: {id: string; data: any};
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
  payload: boolean;
}



interface setCurrentScreen {
  type: 'SET_CURRENT_SCREEN';
  payload: keyof RootStackParamList;
}

interface updateUserProfile {
  type: 'UPDATE_USER_PROFILE';
  payload: {field: string; value: any};
}

interface initUserProfile {
  type: 'INIT_USER_PROFILE';
  payload: currentUserProfile;
}

export interface setQuestionsList {
  type: 'SET_QUESTIONS_LIST';
  payload: {
    _id: ObjectId;
    question: string;
    shortForm: string;
    icon: string;
    answers: {_id: ObjectId; text: string}[];
    type: 'Advanced' | 'Basic';
  }[];
}

export interface setInterestsList {
  type: 'SET_INTERESTS_LIST';
  payload: {_id: ObjectId; category: string; name: string; icon: string}[];
}

export interface setLanguagesList {
  type: 'SET_LANGUAGES_LIST';
  payload: {_id: ObjectId; code: string; name: string}[];
}

export interface setGendersList {
  type: 'SET_GENDERS_LIST';
  payload: {
    _id: ObjectId;
    primary: string;
    secondary: {_id: ObjectId; text: string}[];
  }[];
}

export type AppAction =
  | setInterestsList
  | setQuestionsList
  | updateUserProfile
  | initUserProfile
  | setAdditionalInformation
  | SetPhoneNumberAction
  | SetDateOfBirthAction
  | SetUsernameAction
  | SetSeekingAction
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
  | setCurrentScreen
  | setGendersList
  | setLanguagesList;

export interface InitialStateRegisterType {
  dateOfBirth: Date | null;
  username: string | null;
  seeking: ObjectId[] | null;
  gender: {primary: ObjectId; secondary?: ObjectId | undefined} | null;
  pictures: string[] | null;
  email: string | null;
  relationshipGoal: ObjectId | null;
  phoneNumber: string | null;
  progressBarValue: number;
  additionalInformation: {questionId: ObjectId; answerId: ObjectId}[] | null;
  interests: ObjectId[];
  isRegisterCompleted: {
    status: boolean;
    currentScreen: keyof RootStackParamList | null;
  };
}

export interface InitialStateAppStatusType {
  isBlocked: boolean;
  currentScreen: keyof RootStackParamList | undefined
}

export interface InitialStateUsersType {
  byId: Record<string, currentUserProfile>;
  currentUserId: string | null;
  questionsList:
    | {
        _id: ObjectId;
        question: string;
        shortForm: string;
        icon: string;
        answers: {_id: ObjectId; text: string}[];
        type: 'Advanced' | 'Basic';
      }[]
    | null;
  interestsList:
    | {_id: ObjectId; category: string; name: string; icon: string}[]
    | null;
  gendersList:
    | {
        _id: ObjectId;
        primary: string;
        secondary: {_id: ObjectId; text: string}[];
      }[]
    | null;
  languagesList: {code: string; name: string}[] | null;
}

export interface InitialStateEditUserType {
  modalVisible: boolean;
  bio: string;
  instagram: {
    isConnected?: boolean;
    instagram_id?: string;
    images: any;
  } | null;
  spotify: {
    isConnected?: boolean;
    spotify_id?: string;
    artists: any;
  } | null;
  height: {feets: string; inches: string} | undefined;
  interests: string[];
  additionalInformation: {
    question: string;
    answer: string;
    icon: string;
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
  ethnicity: string | undefined;
  questionsList:
    | {
        _id: ObjectId;
        question: string;
        shortForm: string;
        icon: string;
        answers: {_id: ObjectId; text: string}[];
      }[]
    | null;
  interestsList: {
    question: string;
    answers: {title: string; interests: {title: string; icon: string}[]}[];
  } | null;
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
  REGISTER_USERNAME_SCREEN: undefined;
  REGISTER_DATE_OF_BIRTH_SCREEN: undefined;
  REGISTER_SEEKING_SCREEN: undefined;
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
  EDIT_SEXUAL_ORIENTATION_SCREEN: undefined;
  EDIT_LANGUAGE_SCREEN: undefined;
  EDIT_JOB_TITLE_SCREEN: undefined;
  EDIT_COMPANY_SCREEN: undefined;
  EDIT_VACCINE_SCREEN: undefined;
  EDIT_ETHNICITY_SCREEN: undefined;
  PROFILE_NAVIGATOR: undefined;
};

/**
 * Services
 */

export interface UserRegisterParams {
  username: string;
  dateOfBirth: Date;
  gender: {primary: ObjectId; secondary?: ObjectId | undefined};
  seeking: ObjectId[];
  relationshipGoal: ObjectId;
  email?: string;
  phoneNumber?: string;
  interests: ObjectId[];
  additionalInformation: {questionId: ObjectId; answerId: ObjectId}[];
  pictures: string[];
}

export type PositionType = {
  latitude: number;
  longitude: number;
};

export type oAuth2WebViewType = {
  isVisible: boolean;
  onCodeReceived: (code: string) => void;
  config: {
    authorizationEndpoint: string;
    clientId: string;
    redirectUrl: string;
    scopes: string[];
  };
  onClose: () => void;
};



export type UserProfile = {
  _id: string;
  bio?:string;
  location: {coordinates: {longitude: number, latitude: number}, city?: string};
  height?: {feets: string, inches: string}
  username: string;
  gender: UserGender;
  interests: UserInterest[];
  languages: {_id: string, name: string}[]; // Assuming this should be an array of strings
  relationshipGoal: string;
  seeking: string[]; // Assuming this should be an array of strings
  dateOfBirth: string;
  verified: boolean;
  lastActive: string;
  __v: number;
  pictures: UserPicture[];
  additionalInformation: UserAdditionalInformation[];
  spotify?:any,
  instagram?: any
}

type UserGender = {
  primary: string;
  secondary: string;
}

type UserInterest = {
  _id: string;
  name: string;
  icon: string;
}

type UserPicture = {
  _id: string;
  name: string;
  blurLevel: number;
  url: string;
}

type UserAdditionalInformation = {
  question: string;
  questionShortForm: string;
  questionIcon: string;
  answer: string;
  questionType: 'Advanced' | 'Basic'
}

interface SpotifyArtist {
  id: string;
  name: string;
  type: string;
  images: Array<{
    height: number;
    width: number;
    url: string;
  }>;
  genres: string[];
}

interface InstagramPost {
  id: string;
  url: string;
}

interface SafetySettings {
  blockList: string[]; // Assuming it's a list of user ids
  reportList: string[]; // Assuming it's a list of user ids
}

interface FilterSettings {
  ageMax: number;
  ageMin: number;
  global: boolean;
  distanceRadius: number;
  showProfilesWithPhotos: number;
  showVerifiedProfilesOnly: boolean;
}

interface PrivacySettings {
  showOnlineStatus: boolean;
  showLastActive: boolean;
}

interface AccountSettings {
  deactivateAccountAfterInactivity: number[];
  discoverable: boolean;
}

interface NotificationSettings {
  emailNotifications: boolean;
  newMessageNotification: boolean;
  newMatchNotification: boolean;
  pushNotifications: boolean;
}

interface UserSettings {
  distanceInKm: boolean;
  notification: NotificationSettings;
  safety: SafetySettings;
  filter: FilterSettings;
  privacy: PrivacySettings;
  account: AccountSettings;
}

export interface currentUserProfile {
  _id: string;
  username: string;
  gender: UserGender;
  email: string;
  interests: UserInterest[];
  languages: string[]; // Assuming it's a list of languages e.g. ["English", "Spanish"]
  relationshipGoal: string;
  seeking: string[];
  dateOfBirth: Date;
  connects: number;
  isPremiumMember: boolean;
  verified: boolean;
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  location: {coordinates: {longitude: number, latitude: number}, city?: string};

  spotify: SpotifyArtist[];
  instagram: InstagramPost[];
  pictures: UserPicture[];
  additionalInformation: UserAdditionalInformation[];
  settings: UserSettings;
}