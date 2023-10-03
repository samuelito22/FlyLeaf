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
  const { questions, answers} =
    useSelector((state: TYPES.AppState) => state.usersReducer);
  const vaccineField = questions?.find(item => item.shortForm === "Vaccine")
  const userResponse = useSelector((state: TYPES.AppState) => state.editUserReducer.answers)
  const [vaccineId, setVaccineId] = useState<undefined | number> (userResponse.find(item => item.questionId === vaccineField?.id)?.answerId)

  const dispatch = useDispatch();

  const ClickableIndicatorPrimaryButtonHandlePress = (id: number) => {
    if (vaccineId == id) {
      setVaccineId(undefined);
    } else {
      setVaccineId(id);
    }
  };

  useEffect(() => {
    let updatedAnswers:{questionId:number, answerId: number}[]
    if(vaccineId) {
      const isQuestionPresent = userResponse.some(item => item.questionId === vaccineField?.id);
      
      if (isQuestionPresent) {
        updatedAnswers = userResponse.map(item => {
          if (item.questionId === vaccineField?.id) {
            return {
              ...item,
              questionId: vaccineField?.id,
              answerId: vaccineId,
            };
          }
          return item;
        });
      } else {
        updatedAnswers = [
          ...userResponse,
          {
            questionId: vaccineField?.id!,
            answerId: vaccineId,
          },
        ];
      }
    } else {
      updatedAnswers = userResponse.filter(item => item.questionId !== vaccineField?.id);
    }
    

    dispatch(EditProfileActions.setAnswers(updatedAnswers))
  }, [vaccineId]);


  return (
    <SafeContainer>
      <EditProfileHeader leftIconText="Save" />
      <View style={styles.container}>
        <Text style={styles.title}>{vaccineField?.text}</Text>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          overScrollMode={'never'}
          contentContainerStyle={{flexGrow: 1}}>
          {answers?.filter(item => item.questionId === vaccineField?.id)?.map((answer, index) => (
            <View key={index} style={styles.clickableIndicatorPrimaryButton}>
              <Button.ClickableIndicatorPrimaryButton
                onPress={() =>
                  ClickableIndicatorPrimaryButtonHandlePress(answer.id)
                }
                isActive={vaccineId === answer.id}>
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
