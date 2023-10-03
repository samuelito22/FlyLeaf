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
  ROUTES,
} from '../../constants';
import {EditProfileActions} from '../../redux';
import {useDispatch} from '../../utils/hooks';
import {verticalScale} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import { RouteProp } from '@react-navigation/native';

type RouteParams = RouteProp<
  TYPES.RootStackParamList,
  typeof ROUTES.EDIT_ADVANCED_SCREEN
> & {
  params: {
    questionId: number;
  };
};

type Props = {
  route?: Partial<RouteParams>;
};

const EditAdvancedScreen: React.FC<Props> = ({ route }) => {
    const questionId = route?.params?.questionId

   const {questions, answers} = useSelector((state: TYPES.AppState) => state.usersReducer);
  const ethnicityField = questions?.find(item => item.id === questionId)
  const userResponse = useSelector((state: TYPES.AppState) => state.editUserReducer.answers)
  const [advancedId, setAdvancedId] = useState<undefined | number> (userResponse.find(item => item.questionId === ethnicityField?.id)?.answerId)

  const dispatch = useDispatch();

  const ClickableIndicatorPrimaryButtonHandlePress = (id: number) => {
    if (advancedId == id) {
      setAdvancedId(undefined);
    } else {
      setAdvancedId(id);
    }
  };

  useEffect(() => {
    let updatedAnswers:{questionId:number, answerId: number}[]
    if(advancedId) {
      const isQuestionPresent = userResponse.some(item => item.questionId === ethnicityField?.id);
      
      if (isQuestionPresent) {
        updatedAnswers = userResponse.map(item => {
          if (item.questionId === ethnicityField?.id) {
            return {
              ...item,
              questionId: ethnicityField?.id,
              answerId: advancedId,
            };
          }
          return item;
        });
      } else {
        updatedAnswers = [
          ...userResponse,
          {
            questionId: ethnicityField?.id!,
            answerId: advancedId,
          },
        ];
      }
      dispatch(EditProfileActions.setAnswers(updatedAnswers))

    }
    

  }, [advancedId]);


  return (
    <SafeContainer>
      <EditProfileHeader leftIconText="Save" />
      <View style={styles.container}>
        <Text style={styles.title}>{ethnicityField?.text}</Text>
        <Text style={styles.paragraph}>
          You can only select one answer.
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
                isActive={advancedId === answer.id}>
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

export default EditAdvancedScreen;

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
