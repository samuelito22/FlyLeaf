import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {ImageSourcePropType, ViewStyle} from 'react-native';
import {NavigationProp} from '@react-navigation/native';

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
  active: boolean
}

export interface ButtonImageProps extends ButtonProps {
  imgUrl: Image;
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
  city: string;
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

interface SetGenderAction {
  type: 'SET_GENDER';
  payload: {general: string; specific: string | null};
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
    currentScreen: keyof TYPES.RootStackParamList | null;
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

// Edit Profile
interface EditSetBioAction {
  type: 'EDIT_SET_BIO';
  payload: string | null;
}

interface editSetPicture { 
  type: 'EDIT_SET_PICTURES';
  payload: string[]
}

interface EditSetHeightAction {
  type: 'EDIT_SET_HEIGHT';
  payload: {feet: number, inches: number} | null;
}

interface EditSetAdditionalInformationAction {
  type: 'EDIT_SET_ADDITIONAL_INFORMATION';
  payload: {question: string, answer: string, icon: string}[] | null;
}

interface EditSetGenderInformationAction {
  type: 'EDIT_SET_GENDER_INFORMATION';
  payload: {general: string, specific: string | null} | null;
}

interface EditSetJobTitleAction {
  type: 'EDIT_SET_JOB_TITLE';
  payload: string | null;
}

interface EditSetCompanyAction {
  type: 'EDIT_SET_COMPANY';
  payload: string | null;
}

interface EditSetSexualOrientationAction {
  type: 'EDIT_SET_SEXUAL_ORIENTATION';
  payload: string[] | null;
}

interface EditSetModalVisibleAction {
  type: 'EDIT_SET_MODAL_VISIBLE';
  payload: boolean;
}

interface EditSetLanguagesAction {
  type: 'EDIT_SET_LANGUAGES';
  payload: string[] | null;
}

interface EditInitUserProfileAction {
  type: 'EDIT_INIT_USER_PROFILE';
  payload: any;
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

interface editSetCoordinates {
  type: 'EDIT_SET_COORDINATES';
  payload: { topLeft: { x: number, y: number }, bottomRight: { x: number, y: number } }[]
}

interface setIsRefreshSpotifyComplete {
  type: 'SET_IS_REFRESH_SPOTIFY_COMPLETE';
  payload: boolean
}

export type AppAction =
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
  | SetInterestsActionAction
  | resetRegisterAction
  | setUserProfileAction
  | SetCurrentUserIdAction
  | RemoveUserProfileAction
  | EditSetBioAction
  | EditSetHeightAction
  | EditSetAdditionalInformationAction
  | EditSetGenderInformationAction
  | EditSetJobTitleAction
  | EditSetCompanyAction
  | EditSetSexualOrientationAction
  | EditSetModalVisibleAction
  | EditSetLanguagesAction
  | setIsBlocked
  | EditInitUserProfileAction
  | setIsLocationFetchComplete
  | setIsProfileFetchComplete
  | setIsLoggedIn
  |editSetCoordinates
  | setIsRefreshSpotifyComplete

export interface InitialStateRegisterType {
  dateOfBirth: Date | null;
  firstName: string | null;
  genderPreferences: string[] | null;
  gender: {general: string; specific: string | null} | null;
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
}

export interface InitialStateAppStatusType {
  showLocationScreen: boolean;
  isBlocked: boolean;
  isLocationFetchComplete:boolean;
  isProfileFetchComplete: boolean;
  isLoggedIn: boolean;
  isRefreshSpotifyComplete: boolean
}

export interface InitialStateUsersType {
  [key: string]: any;
  currentUserId: string | null
}

export interface InitialStateEditUserType {
  bio: string | null;
  height: {feet: number, inches: number} | null;
  additionalInformation: {question: string, answer: string, icon: string}[] | null;
  genderInformation: {general: string, specific: string | null} | null;
  jobTitle: string | null;
  company: string | null;
  sexualOrientation: string[] | null;
  modalVisible: boolean;
  languages: string[] | null;
  pictures: string[] | null;
  coordinates: { topLeft: { x: number, y: number }, bottomRight: { x: number, y: number } }[]
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
  PROFILE_NAVIGATOR: {
    screen: USER_PROFILE_SCREEN | PUBLIC_PROFILE_SCREEN;
  };
  USER_PROFILE_SCREEN: undefined;
  PUBLIC_PROFILE_SCREEN: undefined;
  EDIT_PROFILE_SCREEN: undefined;
  EDIT_GENDER_SCREEN: undefined;
  EDIT_SEXUAL_ORIENTATION_SCREEN: undefined
  EDIT_LANGUAGE_SCREEN: undefined;
  OAUTH_SCREEN: {
    config: {
      authorizationEndpoint: string,
      clientId: string,
      redirectUrl: string,
      scopes: string[]
  };
  authCodeRef: React.MutableRefObject<string | null>;
  }
};

/**
 * Services
 */

export interface UserRegisterParams {
  uid: string;
  profile: {
    firstName: string;
    dateOfBirth: Date;
    gender: { general: string; specific?: string };
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
  onCodeReceived: (code: string) => void, 
  config: {
    authorizationEndpoint: string, 
    clientId: string, 
    redirectUrl: string,
    scopes: string[]
  }, 
  onLoadStart: () => void,
  onLoadEnd: () => void
}