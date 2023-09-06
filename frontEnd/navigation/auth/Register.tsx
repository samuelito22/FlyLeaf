import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {
  DateOfBirthScreen,
  EmailVerificationScreen,
  GenderSelectionScreen,
  InterestScreen,
  MultipleQuestionsScreen,
  PictureUploadScreen,
  RecoveryEmailScreen,
  RelationshipGoalScreen,
  SeekingScreen,
  TermsAndConditionsScreen,
  WelcomeScreen,
} from '../../screens';
import {ProgressBar} from '../../components';
import {THEME_COLORS, ROUTES, TYPES} from '../../constants';
import {cardSlideLeftAnimation} from '../../utils/navigatorSlideAnimation';
import { useSelector} from 'react-redux';
import UserNameEntryScreen from '../../screens/auth/register/UsernameEntryScreen';
import { UserActions } from '../../redux';
import { UserService } from '../../services';
import { useDispatch } from '../../utils/hooks';

const Stack = createStackNavigator();

const RegisterNavigator = () => {
  const {isRegisterCompleted, progressBarValue} = useSelector(
    (state: TYPES.AppState) => state.registerReducer,
  );
  const dispatch = useDispatch()

  const [initialRouteName, setInitialRouteName] = React.useState<string>(
    ROUTES.REGISTER_WELCOME_SCREEN
  );

  React.useEffect(() => {
    const fetchInitialRouteName = async () => {
      if (isRegisterCompleted.currentScreen) {
        const result = await UserService.getOverviewEn();
        if (result.type === 'success') {
          dispatch(UserActions.setQuestionsList(result.questions));
          dispatch(UserActions.setInterestsList(result.interests));
          dispatch(UserActions.setLanguagesList(result.languages));
          dispatch(UserActions.setGendersList(result.genders));
        }
        setInitialRouteName(isRegisterCompleted.currentScreen);
      }
    };

    fetchInitialRouteName();
  }, [isRegisterCompleted.currentScreen, dispatch]);

  return (
    <>
      {progressBarValue !== 100 && isRegisterCompleted.currentScreen ? (
        <ProgressBar
          color={THEME_COLORS.primary}
          height={8}
          progress={progressBarValue}
          transparency={0.1}
        />
      ) : null}
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerShown: false,

          cardStyleInterpolator: cardSlideLeftAnimation,
        }}>
        <Stack.Screen
          name={ROUTES.REGISTER_USERNAME_SCREEN}
          component={UserNameEntryScreen}
        />
        <Stack.Screen
          name={ROUTES.REGISTER_DATE_OF_BIRTH_SCREEN}
          component={DateOfBirthScreen}
        />
        <Stack.Screen
          name={ROUTES.REGISTER_GENDER_SELECTION_SCREEN}
          component={GenderSelectionScreen}
        />
        <Stack.Screen
          name={ROUTES.REGISTER_SEEKING_SCREEN}
          component={SeekingScreen}
        />
        <Stack.Screen
          name={ROUTES.REGISTER_RELATIONSHIP_GOAL_SCREEN}
          component={RelationshipGoalScreen}
        />
        <Stack.Screen
          name={ROUTES.REGISTER_PICTURE_UPLOAD_SCREEN}
          component={PictureUploadScreen}
        />
        <Stack.Screen
          name={ROUTES.REGISTER_RECOVERY_EMAIL_SCREEN}
          component={RecoveryEmailScreen}
        />
        <Stack.Screen
          name={ROUTES.EMAIL_VERIFICATION_SCREEN}
          component={EmailVerificationScreen}
        />
        <Stack.Screen
          name={ROUTES.REGISTER_MULTIPLE_QUESTIONS_SCREEN}
          component={MultipleQuestionsScreen}
        />
        <Stack.Screen
          name={ROUTES.REGISTER_TERMS_AND_CONDITIONS_SCREEN}
          component={TermsAndConditionsScreen}
        />
        <Stack.Screen
          name={ROUTES.REGISTER_WELCOME_SCREEN}
          component={WelcomeScreen}
        />
        <Stack.Screen
          name={ROUTES.REGISTER_INTEREST_SCREEN}
          component={InterestScreen}
        />
      </Stack.Navigator>
    </>
  );
};

export default RegisterNavigator;
