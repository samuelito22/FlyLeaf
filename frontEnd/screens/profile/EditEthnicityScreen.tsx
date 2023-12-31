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
  const { questions, answers} =
    useSelector((state: TYPES.AppState) => state.usersReducer);
  const ethnicityField = questions?.find(item => item.shortForm === "Ethnicity")
  const userResponse = useSelector((state: TYPES.AppState) => state.editUserReducer.answers)
  const [ethnicityId, setEthnicityId] = useState<undefined | number> (userResponse.find(item => item.questionId === ethnicityField?.id)?.answerId)

  const dispatch = useDispatch();

  const ClickableIndicatorPrimaryButtonHandlePress = (id: number) => {
    if (ethnicityId == id) {
      setEthnicityId(undefined);
    } else {
      setEthnicityId(id);
    }
  };

  useEffect(() => {
    let updatedAnswers:{questionId:number, answerId: number}[]
    if(ethnicityId) {
      const isQuestionPresent = userResponse.some(item => item.questionId === ethnicityField?.id);
      
      if (isQuestionPresent) {
        updatedAnswers = userResponse.map(item => {
          if (item.questionId === ethnicityField?.id) {
            return {
              ...item,
              questionId: ethnicityField?.id,
              answerId: ethnicityId,
            };
          }
          return item;
        });
      } else {
        updatedAnswers = [
          ...userResponse,
          {
            questionId: ethnicityField?.id!,
            answerId: ethnicityId,
          },
        ];
      }
    } else {
      updatedAnswers = userResponse.filter(item => item.questionId !== ethnicityField?.id);
    }
    

    dispatch(EditProfileActions.setAnswers(updatedAnswers))
  }, [ethnicityId]);


  return (
    <SafeContainer>
      <EditProfileHeader leftIconText="Save" />
      <View style={styles.container}>
        <Text style={styles.title}>{ethnicityField?.text}</Text>
        <Text style={styles.paragraph}>
          You can only select one ethnicity you belong to for your profile.
        </Text>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          overScrollMode={'never'}
          contentContainerStyle={{flexGrow: 1}}>
          {answers?.filter(item => item.questionId === ethnicityField?.id)?.map((answer, index) => (
            <View key={index} style={styles.clickableIndicatorPrimaryButton}>
              <Button.ClickableIndicatorPrimaryButton
                onPress={() =>
                  ClickableIndicatorPrimaryButtonHandlePress(answer.id)
                }
                isActive={ethnicityId === answer.id}>
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
