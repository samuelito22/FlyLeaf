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

const EditEthnicityScreen = () => {
  const { questionsList} =
    useSelector((state: TYPES.AppState) => state.usersReducer);
    const userResponses =
    useSelector((state: TYPES.AppState) => state.editUserReducer.userResponses);
  const ethnicityField = questionsList?.find(item => item.shortForm === "Ethnicity")
  const additionalInformation = useSelector((state: TYPES.AppState) => state.editUserReducer.userProfile?.additionalInformation)
  const [ethnicity, setEthnicity] = useState<undefined | string> (additionalInformation?.find(item => item.questionShortForm === 'Ethnicity')?.answer)

  const dispatch = useDispatch();

  const ClickableIndicatorPrimaryButtonHandlePress = (name: string) => {
    if (ethnicity == name) {
      setEthnicity(undefined);
    } else {
      setEthnicity(name);
    }
  };

  useEffect(() => {
    const updatedAdditionalInformation = additionalInformation?.map(item => 
      item.questionShortForm === 'Ethnicity'
        ? { ...item, answer: ethnicity }
        : item
    ) || [];
  
    if (!additionalInformation?.some(item => item.questionShortForm === 'Ethnicity') && ethnicity) {
      updatedAdditionalInformation.push({
        question: ethnicityField?.question as string,
        questionShortForm: 'Ethnicity',
        questionIcon: '',
        answer: ethnicity,
        questionType: 'Basic' 
      });
    }
  
    dispatch(EditProfileActions.updateUserProfile('additionalInformation', updatedAdditionalInformation));
// Refactored code for updating userResponses
const newResponse = {
  questionId: ethnicityField?._id,
  answerId: ethnicityField?.answers.find(item => item.text === ethnicity)?._id
};

const currentResponses = Array.isArray(userResponses) ? userResponses : [];

const updatedUserResponses = currentResponses.some(response => response.questionId === newResponse.questionId)
    ? currentResponses.map(response => response.questionId === newResponse.questionId ? newResponse : response)
    : [...currentResponses, newResponse];

dispatch(EditProfileActions.updateFormat('userResponses', updatedUserResponses));
  }, [ethnicity]);

  return (
    <SafeContainer>
      <EditProfileHeader leftIconText="Save" />
      <View style={styles.container}>
        <Text style={styles.title}>{ethnicityField?.question}</Text>
        <Text style={styles.paragraph}>
          You can only select one ethnicity you belong to for your profile.
        </Text>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          overScrollMode={'never'}
          contentContainerStyle={{flexGrow: 1}}>
          {ethnicityField?.answers.map((answer, index) => (
            <View key={index} style={styles.clickableIndicatorPrimaryButton}>
              <Button.ClickableIndicatorPrimaryButton
                onPress={() =>
                  ClickableIndicatorPrimaryButtonHandlePress(answer.text)
                }
                isActive={ethnicity === answer.text}>
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

export default EditEthnicityScreen;

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
