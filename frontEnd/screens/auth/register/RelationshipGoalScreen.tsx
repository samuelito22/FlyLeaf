import {Text, View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeContainer, Button, LoadingSpinner} from '../../../components';
import {styles} from './styles';
import {COLORS, ROUTES, TYPES} from '../../../constants';
import {
  setIsRegisterCompleted,
  setProgressBarValue,
  setRelationshipGoal,
} from '../../../redux';
import {NavigationProp} from '@react-navigation/native';
import {usePreventBackHandler, useDispatch} from '../../../utils/hooks';

const RelationshipGoalsScreen = ({
  navigation,
}: {
  navigation: NavigationProp<TYPES.RootStackParamList>;
}) => {
  // To prevent user from going back
  usePreventBackHandler();

  const [valid, setValid] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [relationshipGoalTemp, setRelationshipGoalTemp] = useState('');

  const dispatch = useDispatch();

  const relationshipGoalList = [
    {id: 1, name: 'Committed Relationship'},
    {id: 2, name: 'Marriage'},
    {id: 3, name: 'Open Relationship'},
    {id: 4, name: 'Casual Dating'},
    {id: 5, name: 'Friendship'},
    {id: 6, name: 'Exploring Options'},
  ];

  const handlePress = () => {
    if (valid) {
      setIsLoading(true);
      try {
        navigation.navigate(ROUTES.REGISTER_PICTURE_UPLOAD_SCREEN);
        dispatch(setProgressBarValue(70));
        dispatch(setRelationshipGoal(relationshipGoalTemp));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const ClickableIndicatorPrimaryButtonHandlePress = (
    id: number,
    text: string,
  ) => {
    if (id === activeId) {
      // check if the current id is the activeId
      setActiveId(null);
      setRelationshipGoalTemp('');
    } else {
      setActiveId(id); // set the clicked id as the activeId
      setRelationshipGoalTemp(text);
    }
  };

  useEffect(() => {
    setValid(relationshipGoalTemp ? true : false);
  }, [relationshipGoalTemp]);

  useEffect(
    () => dispatch(setIsRegisterCompleted({status: false, currentScreen: ROUTES.REGISTER_RELATIONSHIP_GOAL_SCREEN})),
    [],
  );

  return (
    <SafeContainer>
      <View style={styles.container}>
        {isLoading && <LoadingSpinner />}
        <Text style={styles.requirement}>Required</Text>
        <Text style={styles.title}>What's your relationship goal?</Text>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          overScrollMode={'never'}
          contentContainerStyle={{flexGrow: 1}}>
          {relationshipGoalList.map(goal => (
            <View key={goal.id} style={styles.clickableIndicatorPrimaryButton}>
              <Button.ClickableIndicatorPrimaryButton
                onPress={() =>
                  ClickableIndicatorPrimaryButtonHandlePress(goal.id, goal.name)
                }
                isActive={goal.id === activeId}>
                {goal.name}
              </Button.ClickableIndicatorPrimaryButton>
            </View>
          ))}
        </ScrollView>
        <View style={styles.alignNextButtonContainer}>
          <Button.PrimaryButton
            onPress={handlePress}
            style={{
              ...styles.nextButtonContainer,
              backgroundColor: valid ? COLORS.primary : COLORS.gray,
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
