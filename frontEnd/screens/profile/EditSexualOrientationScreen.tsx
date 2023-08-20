import {Text, View, ScrollView, StyleSheet, BackHandler} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeContainer, Button, questionsList, EditProfileHeader} from '../../components';
import {THEME_COLORS,  TYPES, COMPONENT_COLORS, BORDER_RADIUS, themeText, PALETTE} from '../../constants';
import { EditProfileActions } from '../../redux';
import { useDispatch} from '../../utils/hooks';
import { verticalScale } from 'react-native-size-matters';
import { useSelector } from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const EditSexualOrientationScreen = () => {



  const sexualOrientation = useSelector(
    (state: TYPES.AppState) => state.editUserReducer.sexualOrientation,
  );

  const [sexualOrientationTemp, setsexualOrientationTemp] = useState<string[]>(sexualOrientation ? sexualOrientation :
    [],
  );

  const dispatch = useDispatch();



  const sexualOrientationField = questionsList.find(field => field.id === 13) as {question: string, id: number, answers: string[]}


  const ClickableIndicatorPrimaryButtonHandlePress = (name: string) => {
    if (sexualOrientationTemp.includes(name)) {
      setsexualOrientationTemp(
        sexualOrientationTemp.filter((pref: string) => pref !== name),
      );
    } else if(sexualOrientationTemp.length < 5) {
      setsexualOrientationTemp([...sexualOrientationTemp, name]);
    }
  
  };

  useEffect(() =>    { sexualOrientationTemp.length != 0 ? dispatch(EditProfileActions.updateUserProfile("sexualOrientation", sexualOrientationTemp)) : dispatch(EditProfileActions.updateUserProfile("sexualOrientation", undefined))}
,[sexualOrientationTemp]  )


  return (
    <SafeContainer>
      <EditProfileHeader leftIconText='Save'/>
      <View style={styles.container}>
        <Text style={styles.title}>{sexualOrientationField?.question}</Text>
        <Text style={styles.paragraph}>
        You can select up to 5 sexual orientations for your profile.
        </Text>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          overScrollMode={'never'}
          contentContainerStyle={{flexGrow: 1}}>
          {sexualOrientationField?.answers.map((sexualOrientation, index) => (
            <View
              key={index}
              style={styles.clickableIndicatorPrimaryButton}>
              <Button.ClickableIndicatorPrimaryButton
                onPress={() =>
                  ClickableIndicatorPrimaryButtonHandlePress(sexualOrientation)
                }
                isActive={sexualOrientationTemp.includes(sexualOrientation)}>
                {sexualOrientation}
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

export default EditSexualOrientationScreen


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
  