import React, {ReactNode} from 'react';
import {
  ImageSourcePropType,
  ViewStyle,
  TextStyle,
  TextInputProps,
  StyleProp,
} from 'react-native';
import {rootReducer} from '../redux/store';

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

  export interface InitialStateRegisterType {
    firstName: string;
    dateOfBirth: Date | null;
    primaryGenderId: number;
    secondaryGenderId: number | null;
    email: string;
    phoneNumber: string;
    longitude: number;
    latitude: number;
    interestsIds: number[];
    answers: { questionId: number; answerId: number }[];
    relationshipGoalId: number;
    seekingIds: number[];
    isRegisterCompleted: {
      status: boolean;
      currentScreen: keyof RootStackParamList | null;
    };
    progressBarValue: number;
    pictures: string[]
  }

export interface InitialStateAppStatusType {
  isBlocked: boolean;
  currentScreen: keyof RootStackParamList | undefined
  isOnline: boolean
}

export interface InitialStateUsersType {
  byId: Record<string, currentUserProfile>;
  currentUserId: string | null;
  questions:
    | {
        id: number;
        text: string;
        shortForm: string;
        iconPath: string;
        type: 'Advanced' | 'Basic';
      }[]
    | null;
  answers: {
    id: number;
    text: string;
    questionId: number
  }[] | null
  interests:
    | {id: number;
      text: string;
      categoryId: number;
      category: {
        id: number;
        text: string;
      };}[]
    | null;
  genders:
    | {
        primaryGenders: {
          id: number;
          text: string;
        }[];
        secondaryGenders: {
          id: number;
          text: string;
          primaryGenderId: number
        }[];
      }
    | null;
  languages: {
    id: number;
    text: string;
  }[] | null;
  relationshipGoals: {
    id: number;
    text: string;
  }[] | null
}


export interface InitialStateEditUserType {
  userProfile: EditProfile | null
  userResponses: {questionId: string, answerId: string}[]
  newPictures: { [key: string]: any }[];
  removedPictures: string[];
  gender?: {primary: string, secondary?: string}
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
  firstName: string;
    dateOfBirth: Date | null;
    primaryGenderId: number;
    secondaryGenderId: number | null;
    email: string;
    phoneNumber: string;
    longitude: number;
    latitude: number;
    interestsIds: number[];
    answers: { questionId: number; answerId: number }[];
    relationshipGoalId: number;
    seekingIds: number[];
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

type UserGender = {
  primary: string;
  secondary?: string;
}

type UserInterest = {
  _id: string;
  name: string;
  icon: string;
}

export type UserPicture = {
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

export interface SpotifyArtist {
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

export interface InstagramPost {
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
export type UserProfile = {
  _id: string;
  bio?: string;
  location: {coordinates: {longitude: number, latitude: number}, city?: string};
  height?: {feets: string, inches: string};
  username: string;
  gender: UserGender;
  interests: UserInterest[];
  relationshipGoal: string;
  seeking: string[]; // Array of strings
  verified: boolean;
  pictures: UserPicture[];
  additionalInformation: UserAdditionalInformation[];
  spotify?: SpotifyArtist[];
  instagram?: InstagramPost[];
  languages?: {_id: string, name: string}[]; // Same structure as in UserProfile
  dateOfBirth: Date;
  lastActive: Date;
  createdAt: Date;
  profession?: {jobTitle?: string, employer?:string}

}

export interface currentUserProfile extends UserProfile {
  email?: string;
  phoneNumber?: string;
  connects: number;
  isPremiumMember: boolean;
  settings: UserSettings;
}

export interface EditProfile {
  _id: string;
  bio?: string;
  location: { city?: string};
  height?: {feets: string, inches: string};
  gender: UserGender;
  interests: UserInterest[];
  relationshipGoal: string;
  pictures: UserPicture[];
  additionalInformation: UserAdditionalInformation[];
  spotify?: SpotifyArtist[];
  instagram?: InstagramPost[];
  languages?: {_id: string, name: string}[]; // Same structure as in UserProfile
  profession?: {jobTitle?: string, employer?:string}
  seeking: string[]; // Array of strings

}


/**
 * GeoLocation
 */

export interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
}

export interface GeolocationPosition {
  coords: GeolocationCoordinates;
  timestamp: number;
}
