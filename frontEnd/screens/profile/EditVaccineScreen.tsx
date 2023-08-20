import {Text, View, ScrollView, StyleSheet, BackHandler} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeContainer, Button, questionsList, EditProfileHeader} from '../../components';
import {THEME_COLORS,  TYPES, COMPONENT_COLORS, BORDER_RADIUS, themeText, PALETTE} from '../../constants';
import { EditProfileActions } from '../../redux';
import { useDispatch} from '../../utils/hooks';
import { verticalScale } from 'react-native-size-matters';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

const EditVaccineScreen = () => {



  const state = useSelector(
    (state: TYPES.AppState) => state.editUserReducer,
  );

  const [vaccine, setVaccine] = useState<string>(state.covidVaccination ? state.covidVaccination :
    "",
  );

  const dispatch = useDispatch();

 
  const vaccineField = questionsList.find(field => field.id === 17) as {question: string, id: number, answers: string[]}


  const ClickableIndicatorPrimaryButtonHandlePress = (name: string) => {
    if(vaccine == name){
      setVaccine("")
    }else{
      setVaccine(name)
    }
  
  };

  useEffect(() => {vaccine != "" ? dispatch(EditProfileActions.updateUserProfile("covidVaccination", vaccine)) : dispatch(EditProfileActions.updateUserProfile("covidVaccination", undefined))}, [vaccine])



  return (
    <SafeContainer>
      <EditProfileHeader leftIconText='Save'/>
      <View style={styles.container}>
        <Text style={styles.title}>{vaccineField?.question}</Text>
    
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
  