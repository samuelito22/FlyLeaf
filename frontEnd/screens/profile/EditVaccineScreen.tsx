import {Text, View, ScrollView, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  SafeContainer,
  Button,
  EditProfileHeader,
} from '../../components';
import {
  THEME_COLORS,
  TYPES,
  COMPONENT_COLORS,
  BORDER_RADIUS,
  themeText,
} from '../../constants';
import {EditProfileActions} from '../../redux';
import {useDispatch} from '../../utils/hooks';
import {verticalScale} from 'react-native-size-matters';
import {useSelector} from 'react-redux';

const EditVaccineScreen = () => {
  const { questionsList} =
    useSelector((state: TYPES.AppState) => state.usersReducer);
    const userResponses =
    useSelector((state: TYPES.AppState) => state.editUserReducer.userResponses);
  const vaccineField = questionsList?.find(item => item.shortForm === "Vaccine")
  const additionalInformation = useSelector((state: TYPES.AppState) => state.editUserReducer.userProfile?.additionalInformation)
  const [vaccine, setVaccine] = useState<undefined | string> (additionalInformation?.find(item => item.questionShortForm === 'Vaccine')?.answer)

  const dispatch = useDispatch();

  const ClickableIndicatorPrimaryButtonHandlePress = (name: string) => {
    if (vaccine == name) {
      setVaccine(undefined);
    } else {
      setVaccine(name);
    }
  };

  useEffect(() => {
    const updatedAdditionalInformation = additionalInformation?.map(item => 
      item.questionShortForm === 'Vaccine'
        ? { ...item, answer: vaccine }
        : item
    ) || [];
  
    if (!additionalInformation?.some(item => item.questionShortForm === 'Vaccine') && vaccine) {
      updatedAdditionalInformation.push({
        question: vaccineField?.question as string,
        questionShortForm: 'Vaccine',
        questionIcon: '',
        answer: vaccine,
        questionType: 'Basic' 
      });
    }
  
    dispatch(EditProfileActions.updateUserProfile('additionalInformation', updatedAdditionalInformation));
// Refactored code for updating userResponses
const newResponse = {
  questionId: vaccineField?._id,
  answerId: vaccineField?.answers.find(item => item.text === vaccine)?._id
};

const currentResponses = Array.isArray(userResponses) ? userResponses : [];

const updatedUserResponses = currentResponses.some(response => response.questionId === newResponse.questionId)
    ? currentResponses.map(response => response.questionId === newResponse.questionId ? newResponse : response)
    : [...currentResponses, newResponse];

dispatch(EditProfileActions.updateFormat('userResponses', updatedUserResponses));
  }, [vaccine]);
  return (
    <SafeContainer>
      <EditProfileHeader leftIconText="Save" />
      <View style={styles.container}>
        <Text style={styles.title}>{vaccineField?.question}</Text>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          overScrollMode={'never'}
          contentContainerStyle={{flexGrow: 1}}>
          {vaccineField?.answers.map((answer, index) => (
            <View key={index} style={styles.clickableIndicatorPrimaryButton}>
            <Button.ClickableIndicatorPrimaryButton
              onPress={() =>
                ClickableIndicatorPrimaryButtonHandlePress(answer.text)
              }
              isActive={vaccine === answer.text}>
              {answer.text}
            </Button.ClickableIndicatorPrimaryButton>
          </View>
          ))}
        </ScrollView>
        <Text style={styles.extraInformation}>
          Your preferences are used to tailor your matches. Your selections are
          shared publicly
        </Text>
      </View>
    </SafeContainer>
  );
};

export default EditVaccineScreen;

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
