import {Text, View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  SafeContainer,
  Button,
  LoadingSpinner,
  questionsList,
} from '../../../components';
import {styles} from './styles';
import {THEME_COLORS, ROUTES, TYPES} from '../../../constants';
import {RegisterActions} from '../../../redux';
import {NavigationProp} from '@react-navigation/native';
import {usePreventBackHandler, useDispatch} from '../../../utils/hooks';
import {useSelector} from 'react-redux';
import {ObjectId} from 'mongodb';

const RelationshipGoalsScreen = ({
  navigation,
}: {
  navigation: NavigationProp<TYPES.RootStackParamList>;
}) => {
  // To prevent user from going back
  usePreventBackHandler();

  const [valid, setValid] = useState(false);
  const [activeId, setActiveId] = useState<null | ObjectId>(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const {questionsList} = useSelector(
    (state: TYPES.AppState) => state.usersReducer,
  );

  const relationshipGoalField = questionsList?.find(
    item => item.shortForm === 'Goal',
  );

  const handlePress = () => {
    if (valid) {
      setIsLoading(true);
      try {
        navigation.navigate(ROUTES.REGISTER_PICTURE_UPLOAD_SCREEN);
        dispatch(RegisterActions.setProgressBarValue(70));
        dispatch(RegisterActions.setRelationshipGoal(activeId as ObjectId));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const ClickableIndicatorPrimaryButtonHandlePress = (_id: ObjectId) => {
    if (_id === activeId) {
      // check if the current id is the activeId
      setActiveId(null);
    } else {
      setActiveId(_id); // set the clicked id as the activeId
    }
  };

  useEffect(() => {
    setValid(activeId ? true : false);
  }, [activeId]);

  useEffect(
    () =>
      dispatch(
        RegisterActions.setIsRegisterCompleted({
          status: false,
          currentScreen: ROUTES.REGISTER_RELATIONSHIP_GOAL_SCREEN,
        }),
      ),
    [],
  );

  return (
    <SafeContainer>
      <View style={styles.container}>
        {isLoading && <LoadingSpinner />}
        <Text style={styles.requirement}>Required</Text>
        <Text style={styles.title}>What is your relationship goal?</Text>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          overScrollMode={'never'}
          contentContainerStyle={{flexGrow: 1}}>
          {relationshipGoalField?.answers.map((goal, index) => (
            <View key={index} style={styles.clickableIndicatorPrimaryButton}>
              <Button.ClickableIndicatorPrimaryButton
                onPress={() =>
                  ClickableIndicatorPrimaryButtonHandlePress(goal._id)
                }
                isActive={goal._id === activeId}>
                {goal.text}
              </Button.ClickableIndicatorPrimaryButton>
            </View>
          ))}
        </ScrollView>
        <View style={styles.alignNextButtonContainer}>
          <Button.PrimaryButton
            onPress={handlePress}
            style={{
              ...styles.nextButtonContainer,
              backgroundColor: valid
                ? THEME_COLORS.primary
                : THEME_COLORS.tertiary,
            }}>
            CONTINUE
          </Button.PrimaryButton>
        </View>
        <Text style={styles.extraInformation}>
          Your chosen relationship goal helps us provide a tailored experience
          for you. Remember, you're free to change this anytime in your
          settings.
        </Text>
      </View>
    </SafeContainer>
  );
};

export default RelationshipGoalsScreen;
