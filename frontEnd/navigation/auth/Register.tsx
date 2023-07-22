import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {
  DateOfBirthScreen,
  EmailVerificationScreen,
  FirstNameEntryScreen,
  GenderPreferenceScreen,
  GenderSelectionScreen,
  MultipleQuestionsScreen,
  PictureUploadScreen,
  RecoveryEmailScreen,
  RelationshipGoalScreen,
  TermsAndConditionsScreen,
} from '../../screens';
import {ProgressBar} from '../../components';
import {THEME_COLORS, ROUTES, TYPES} from '../../constants';
import {cardSlideLeftAnimation} from '../../utils/navigatorSlideAnimation';
import {useSelector} from 'react-redux';

const Stack = createStackNavigator();

const RegisterNavigator = () => {
  const {isRegisterCompleted, progressBarValue} = useSelector(
    (state: TYPES.AppState) => state.registerReducer,
  );
  const initialRouteNameDecider = () => {
    if (isRegisterCompleted.currentScreen) {
      //suppose to be without the exlamation mark
      return isRegisterCompleted.currentScreen;
    } else {
      return ROUTES.REGISTER_FIRST_NAME_SCREEN;
    }
  };

  return (
    <>
      {progressBarValue !== 100 ? (
        <ProgressBar
          color={THEME_COLORS.primary}
          height={8}
          progress={progressBarValue}
          transparency={0.1}
        />
      ) : null}
      <Stack.Navigator
        initialRouteName={initialRouteNameDecider()}
        screenOptions={{
          headerShown: false,

          cardStyleInterpolator: cardSlideLeftAnimation,
        }}>
        <Stack.Screen
          name={ROUTES.REGISTER_FIRST_NAME_SCREEN}
          component={FirstNameEntryScreen}
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
          name={ROUTES.REGISTER_GENDER_PREFERENCE_SCREEN}
          component={GenderPreferenceScreen}
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
      </Stack.Navigator>
    </>
  );
};

export default RegisterNavigator;
