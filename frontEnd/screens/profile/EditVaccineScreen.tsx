import {Text, View, ScrollView, StyleSheet, BackHandler} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeContainer, Button, questionsList, EditProfileHeader} from '../../components';
import {THEME_COLORS,  TYPES, COMPONENT_COLORS, BORDER_RADIUS, themeText, PALETTE} from '../../constants';
import { EditProfileActions } from '../../redux';
import { useDispatch} from '../../utils/hooks';
import { verticalScale } from 'react-native-size-matters';
import { useSelector } from 'react-redux';

const EditVaccineScreen = () => {


  const [valid, setValid] = useState(false);

  const state = useSelector(
    (state: TYPES.AppState) => state.editUserReducer,
  );

  const [vaccine, setVaccine] = useState<string>(state.covidVaccination ? state.covidVaccination :
    "",
  );

  const dispatch = useDispatch();

  const handleBackPress = () => {
    if(valid) dispatch(EditProfileActions.updateUserProfile("covidVaccination", vaccine))
  }

  const vaccineField = questionsList.find(field => field.id === 17) as {question: string, id: number, answers: string[]}


  const ClickableIndicatorPrimaryButtonHandlePress = (name: string) => {
    setVaccine(name)
  
  };

  useEffect(() => {
    setValid(vaccine ? true : false);
  }, [vaccine]);

  useEffect(() => {
    // Add event listener for hardware back button
    const backAction = () => {
      handleBackPress()
      return false;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => {
      // Remove event listener when the component is unmounted
      backHandler.remove();
    };
  }, [valid]);


  return (
    <SafeContainer>
      <EditProfileHeader onBackPress={handleBackPress} leftIconText='Save'/>
      <View style={styles.container}>
        <Text style={styles.title}>{vaccineField?.question}</Text>
        <Text style={styles.paragraph}>
        You can either give a yes or a no answer.
        </Text>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          overScrollMode={'never'}
          contentContainerStyle={{flexGrow: 1}}>
          {vaccineField?.answers.map((answer, index) => (
            <View
              key={index}
              style={styles.clickableIndicatorPrimaryButton}>
              <Button.ClickableIndicatorPrimaryButton
                onPress={() =>
                  ClickableIndicatorPrimaryButtonHandlePress(answer)
                }
                isActive={vaccine.includes(answer)}>
                {answer}
              </Button.ClickableIndicatorPrimaryButton>
            </View>
          ))}
        </ScrollView>
        <Text style={styles.extraInformation}>
          Your preferences are used to tailor your matches. Your selections
          are shared publicly
        </Text>
      </View>
    </SafeContainer>
  );
};

export default EditVaccineScreen


const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      paddingTop: verticalScale(20),
      maxWidth: 325,
      width: '100%',
    },
    title: {
      ...themeText.headingTwo,
      color: THEME_COLORS.dark,
      marginBottom: verticalScale(12),
    },
    clickableIndicatorPrimaryButton: {
      marginBottom: 28,
      backgroundColor: COMPONENT_COLORS.primaryIndicatorBackground,
      borderRadius: BORDER_RADIUS.medium,
    },
    paragraph: {
        ...themeText.bodyRegularFive,
        color: THEME_COLORS.dark,
        marginBottom: verticalScale(17),
      },
      extraInformation: {
        ...themeText.bodyRegularSeven,
        color: THEME_COLORS.tertiary,
        textAlign: 'center',
        marginBottom: 15,
      },
  });
  