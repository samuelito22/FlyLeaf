import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {
  DateOfBirthScreen,
  EmailVerificationScreen,
  FirstNameEntryScreen,
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
import {Loading, ProgressBar} from '../../components';
import {THEME_COLORS, ROUTES, TYPES} from '../../constants';
import {cardSlideLeftAnimation} from '../../utils/navigatorSlideAnimation';
import { useSelector} from 'react-redux';
import { UserActions } from '../../redux';
import { UserService } from '../../services';
import { useDispatch } from '../../utils/hooks';

const Stack = createStackNavigator();

const RegisterNavigator = () => {
  const {isRegisterCompleted, progressBarValue} = useSelector(
    (state: TYPES.AppState) => state.registerReducer,
  );
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = React.useState(true)
  const [isOverviewFetched, setIsOverviewFetched] = React.useState(false)

  const isOnline = useSelector(
    (state: TYPES.AppState) => state.appStatusReducer.isOnline,
  );

  const {questions, languages, interests, relationshipGoals, answers, genders} = useSelector(
    (state: TYPES.AppState) => state.usersReducer,
  );

  React.useEffect(() => {
    const fetchInitialRouteName = async () => {
      if (isRegisterCompleted.currentScreen) {
        try{
        const result = await UserService.getOverviewEn();
        if (result.type === 'success') {
          dispatch(UserActions.setQuestions(result.questions));
          dispatch(UserActions.setInterests(result.interests));
          dispatch(UserActions.setLanguages(result.languages));
          dispatch(UserActions.setGenders(result.genders));
          dispatch(UserActions.setRelationshipGoals(result.relationshipGoals));
        dispatch(UserActions.setAnswers(result.answers));
        setIsOverviewFetched(true)
        }
      }
      catch(error){
        console.log("Error in getting FlyLeaf's overview.")
      }
      }
    };

    if(isOnline && !questions && !languages && !interests && !genders && !relationshipGoals && !answers ) fetchInitialRouteName();
  }, [isOnline]);

  React.useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000); 
  
      return () => clearTimeout(timer); 
    }
  }, [isLoading]);

  

  return (
    <>
    {(!isRegisterCompleted.status && (isLoading || !(isRegisterCompleted.currentScreen && isOverviewFetched))) && <Loading.ThreeDotsLoader modalBackground={{backgroundColor:"white"}}/>}
      {progressBarValue !== 100 && isRegisterCompleted.currentScreen ? (
        <ProgressBar
          color={THEME_COLORS.primary}
          height={8}
          progress={progressBarValue}
          transparency={0.1}
        />
      ) : null}
      <Stack.Navigator
        initialRouteName={isRegisterCompleted.currentScreen || ROUTES.REGISTER_WELCOME_SCREEN}
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
