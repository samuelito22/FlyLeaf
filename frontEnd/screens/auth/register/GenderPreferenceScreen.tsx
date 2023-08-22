import {Text, View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeContainer, Button, LoadingSpinner, questionsList} from '../../../components';
import {styles} from './styles';
import {THEME_COLORS, ROUTES, TYPES} from '../../../constants';
import {
  RegisterActions
} from '../../../redux';
import {NavigationProp} from '@react-navigation/native';
import {usePreventBackHandler, useDispatch} from '../../../utils/hooks';

const GenderPreferenceScreen = ({
  navigation,
}: {
  navigation: NavigationProp<TYPES.RootStackParamList>;
}) => {
  // To prevent user from going back
  usePreventBackHandler();

  const [isLoading, setIsLoading] = useState(false);

  const [valid, setValid] = useState(false);

  const [genderPreferencesTemp, setGenderPreferencesTemp] = useState<string[]>(
    [],
  );

  const dispatch = useDispatch();

  const genderField = questionsList.find(field => field.id === 10) as {question: string, id: number, answers: string[],  icon:string}

  const handlePress = async () => {
    if (valid) {
      setIsLoading(true);
      try {
        navigation.navigate(ROUTES.REGISTER_RELATIONSHIP_GOAL_SCREEN);
        dispatch(RegisterActions.setProgressBarValue(56));
        dispatch(RegisterActions.setGenderPreferences(genderPreferencesTemp));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const ClickableIndicatorPrimaryButtonHandlePress = (name: string) => {
    if (genderPreferencesTemp.includes(name)) {
      setGenderPreferencesTemp(
        genderPreferencesTemp.filter((pref: string) => pref !== name),
      );
    } else {
      setGenderPreferencesTemp([...genderPreferencesTemp, name]);
    }
  };

  useEffect(() => {
    setValid(genderPreferencesTemp.length > 0 ? true : false);
  }, [genderPreferencesTemp]);

  useEffect(
    () =>
      dispatch(
        RegisterActions.setIsRegisterCompleted({
          status: false,
          currentScreen: ROUTES.REGISTER_GENDER_PREFERENCE_SCREEN,
        }),
      ),
    [],
  );

  return (
    <SafeContainer>
      <View style={styles.container}>
        {isLoading && <LoadingSpinner />}
        <Text style={styles.requirement}>Required</Text>
        <Text style={styles.title}>{genderField?.question}</Text>
        <Text style={styles.paragraph}>
          Multiple selections and future changes are allowed
        </Text>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          overScrollMode={'never'}
          contentContainerStyle={{flexGrow: 1}}>
          {genderField?.answers.map((gender, index) => (
            <View
              key={index}
              style={styles.clickableIndicatorPrimaryButton}>
              <Button.ClickableIndicatorPrimaryButton
                onPress={() =>
                  ClickableIndicatorPrimaryButtonHandlePress(gender)
                }
                isActive={genderPreferencesTemp.includes(gender)}>
                {gender}
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
          Your preferences are used to tailor your matches. Your selections
          aren't shared publicly.
        </Text>
      </View>
    </SafeContainer>
  );
};

export default GenderPreferenceScreen;
