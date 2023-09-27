import {Text, View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  SafeContainer,
  Button,
  LoadingSpinner,
} from '../../../components';
import {styles} from './styles';
import {THEME_COLORS, ROUTES, TYPES} from '../../../constants';
import {RegisterActions} from '../../../redux';
import {NavigationProp} from '@react-navigation/native';
import {usePreventBackHandler, useDispatch} from '../../../utils/hooks';
import {useSelector} from 'react-redux';

const RelationshipGoalsScreen = ({
  navigation,
}: {
  navigation: NavigationProp<TYPES.RootStackParamList>;
}) => {
  // To prevent user from going back
  usePreventBackHandler();

  const [valid, setValid] = useState(false);
  const [activeId, setActiveId] = useState<null | number>(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const {relationshipGoals} = useSelector(
    (state: TYPES.AppState) => state.usersReducer,
  );

  const handlePress = () => {
    if (valid) {
      setIsLoading(true);
      try {
        navigation.navigate(ROUTES.REGISTER_PICTURE_UPLOAD_SCREEN);
        dispatch(RegisterActions.setProgressBarValue(70));
        dispatch(RegisterActions.setRelationshipGoalId(activeId as number));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const ClickableIndicatorPrimaryButtonHandlePress = (id: number) => {
    if (id === activeId) {
      // check if the current id is the activeId
      setActiveId(null);
    } else {
      setActiveId(id); // set the clicked id as the activeId
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
          {relationshipGoals?.map((goal) => (
            <View key={goal.id} style={styles.clickableIndicatorPrimaryButton}>
              <Button.ClickableIndicatorPrimaryButton
                onPress={() =>
                  ClickableIndicatorPrimaryButtonHandlePress(goal.id)
                }
                isActive={goal.id === activeId}>
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
