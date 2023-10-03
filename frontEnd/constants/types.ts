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
  byId: Record<string, CurrentUser>;
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
  bio?: string;
  answers: { questionId: number; answerId: number }[];
  primaryGenderId: number;
  interestsIds: number[];
  seekingIds: number[];
  topArtists?: UserTopArtists[];
  secondaryGenderId?: number;
  instagramImages?: InstagramImages[];
  jobTitle?: string;
  employer?: string;
  height?:number;
  languagesIds?: number[];
  pictures: Picture[],
  picturesToRemove?: ('picture-0' | 'picture-1' | 'picture-2' | 'picture-3' | 'picture-4' | 'picture-5') []; // Assuming they are arrays of strings (URLs or IDs)
  picturesToAdd?: string[];
  id: string
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
  EDIT_INTERESTS_SCREEN: undefined;
  EDIT_SEEKING_SCREEN: undefined;
  EDIT_ADVANCED_SCREEN: {questionId: number}
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



/**
 * User's interface
 */

interface IdAndText {
  id: number;
  text: string;
}

interface secondaryGender extends IdAndText {
  primaryGenderId: number;
  primaryGender: IdAndText
}

interface NotificationSettings {
  userId: string;
  emailNotifications: boolean;
  newMessageNotification: boolean;
  newMatchNotification: boolean;
  pushNotifications: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FilterSettings {
  userId: string;
  relationshipGoalId: number;
  ageMax: number;
  ageMin: number;
  global: boolean;
  distanceRadius: number;
  minPhotosRequired: number;
  showVerifiedProfilesOnly: boolean;
  createdAt: string;
  updatedAt: string;
  relationshipGoal: IdAndText;
}

interface PrivacySettings {
  userId: string;
  showOnlineStatus: boolean;
  showLastActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AccountSettings {
  userId: string;
  deactivateAccountAfterInactivity: null | string;
  discoverable: boolean;
  distanceInKm: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Interest {
  userId: string;
  interestId: number;
  createdAt: string;
  updatedAt: string;
  interest: IdAndText & {categoryId: number}
}

interface UserAnswer {
  userId: string;
  answerId: number;
  createdAt: string; // or Date if you plan to convert it to a Date object
  updatedAt: string; // or Date if you plan to convert it to a Date object
  answer: Answer;
}

interface UserConnects {
  userId: string;
  createdAt: string; // or Date if you plan to convert it to a Date object
  updatedAt: string; // or Date if you plan to convert it to a Date object
  remainingCount: number
  connectType: 'Connect Token' | 'Super Connect'
}

interface Answer {
  id: number;
  questionId: number;
  text: string;
  question: Question;
}

interface Question {
  id: number;
  shortForm: string;
  type: string; // You could make this an enum if you have specific types
  iconPath: string;
  text: string;
}

export interface UserTopArtists {
  userId: string;
  artistId: number;
  rank: number;
}

export interface InstagramImages {
  id: number;
  userId: string;
  imageUrl: string;
}

export interface Picture {
  id: number;
  userId: string;
  name: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

interface SeekingGender {
  userId: string;
  primaryGenderId: number;
}

export interface CurrentUser {
  id: string;
  firstName: string;
  dateOfBirth: string;
  primaryGenderId: number;
  secondaryGenderId?: number; // Optional
  jobTitle?: string;
  employer?: string;
  bio?: string; // Optional
  height?: number; // Optional
  email?: string; // Optional, if not used as the primary means of identification
  phoneNumber: string;
  city?: string; // Optional
  longitude: number;
  latitude: number;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  primaryGender: IdAndText;
  secondaryGender?: secondaryGender; // Optional
  notificationSettings: NotificationSettings;
  filterSettings: FilterSettings;
  privacySettings: PrivacySettings;
  accountSettings: AccountSettings;
  subscriptionFeatures?: any[]; // Optional
  languages?: IdAndText[]; // Optional
  interests: Interest[];
  answers: UserAnswer[];
  connects: UserConnects[]
  matches?: any[]; // Optional
  matchedBy?: any[]; // Optional
  pictures: Picture[];
  conversationsInitiated?: any[]; // Optional
  conversationsReceived?: any[]; // Optional
  payments?: any[]; // Optional
  notificationHistory?: any[]; // Optional
  blockedUsers?: any[]; // Optional
  deviceInfo?: null | any; // Optional
  topArtists?: UserTopArtists[]; // Optional
  instagramImages?: InstagramImages[]; // Optional
  subscriptions?: any[]; // Optional
  seeking: SeekingGender[]; // Optional
}


export interface ExternalUser {
  id: string;
  firstName: string;
  dateOfBirth: string;
  primaryGenderId: number;
  secondaryGenderId?:  number;
  bio:  string;
  jobTitle?: string;
  employer?: string;
  height:  number;
  city?: string;
  longitude: number;
  latitude: number;
  verified: boolean;
  primaryGender: IdAndText;
  secondaryGender?: secondaryGender;
  filterSettings: FilterSettings;
  privacySettings: PrivacySettings;
  languages?: IdAndText[];
  interests: Interest[];
  answers: UserAnswer[];
  pictures: Picture[];
  topArtists?: UserTopArtists[];
  instagramImages?: InstagramImages[];
  seeking: SeekingGender[];
}

