import React, {useEffect, useState} from 'react';
import {Text, View, ScrollView, Image, StyleSheet} from 'react-native';
import {styles as generalStyles} from './styles';
import {
  SafeContainer,
  Button,
  LoadingSpinner,
  questionsList,
  interestsList,
} from '../../../components';
import {
  setInterests,
  setIsRegisterCompleted,
  setAdditionalInformation,
  resetRegister,
} from '../../../redux';
import {
  THEME_COLORS,
  ROUTES,
  TYPES,
  themeText,
  PALETTE,
} from '../../../constants';
import {NavigationProp} from '@react-navigation/native';
import {usePreventBackHandler, useDispatch} from '../../../utils/hooks';
import {useSelector} from 'react-redux';
import {icons} from '../../../assets';
import {AuthService} from '../../../services';
import auth from '@react-native-firebase/auth';

const styles = StyleSheet.create({
  interest_title: {
    ...themeText.bodyBoldFour,
    color: THEME_COLORS.dark,
    paddingVertical: 10,
  },
  interest_buttonsContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  interest_button: {
    marginVertical: 10,
    marginRight: 10,
  },
  interest_section: {
    borderBottomColor: PALETTE.GHOSTWHITE,
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingBottom: 10,
  },
});

const BuildYourProfileScreen = ({handlePress}: {handlePress: () => void}) => {
  return (
    <SafeContainer>
      <View style={generalStyles.container}>
        <Image
          source={icons.writing}
          style={{width: 150, height: 150, marginBottom: 20}}
          resizeMode="contain"
        />
        <Text style={generalStyles.title}>You thought you were done?</Text>
        <Text style={generalStyles.paragraph}>
          It's important to have a well structured and informative profile, so
          to attract others and let people know you are the boss!
        </Text>
      </View>
      <View style={generalStyles.alignNextButtonContainer}>
        <Button.PrimaryButton
          onPress={handlePress}
          style={{
            ...generalStyles.nextButtonContainer,
            backgroundColor: THEME_COLORS.primary,
          }}>
          CONTINUE
        </Button.PrimaryButton>
      </View>
    </SafeContainer>
  );
};

const MultipleQuestionsScreen = ({
  navigation,
}: {
  navigation: NavigationProp<TYPES.RootStackParamList>;
}) => {
  usePreventBackHandler();
  const dispatch = useDispatch();
  const {additionalInformation} = useSelector(
    (state: TYPES.AppState) => state.registerReducer,
  );

  const [valid, setValid] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(-1);
  const [answer, setAnswer] = useState<string>('');

  const questionFieldList = questionsList.filter(
    item => item.id >= 1 && item.id <= 9 || item.id == 15,
  ) as Array<{question: string; id: number; answers: string[]; icon: string}>;

  const handlePress = () => {
    if (valid) {
      if(additionalInformation){
      dispatch(
        setAdditionalInformation([
          ...additionalInformation,
          {
            question: questionFieldList[currentQuestion].question,
            answer: answer,
            icon: questionFieldList[currentQuestion].icon,
          },
        ]),
      );
      }else{
        dispatch(
          setAdditionalInformation([
            {
              question: questionFieldList[currentQuestion].question,
              answer: answer,
              icon: questionFieldList[currentQuestion].icon,
            },
          ]),
        );
      }

      setAnswer('');
      setActiveId(null);

      if (additionalInformation && additionalInformation.length === 9) {
        navigation.navigate(ROUTES.REGISTER_INTEREST_SCREEN)
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
      setAnswer('');
    } else {
      setActiveId(id); // set the clicked id as the activeId
      setAnswer(text);
    }
  };

  useEffect(() => {
    setValid(answer ? true : false);
  }, [answer]);

  useEffect(
    () =>
      dispatch(
        setIsRegisterCompleted({
          status: false,
          currentScreen: ROUTES.REGISTER_MULTIPLE_QUESTIONS_SCREEN,
        }),
      ),
    [],
  );

  useEffect(() => {
    if (additionalInformation && additionalInformation.length < 10) {
      setCurrentQuestion(additionalInformation.length);
    }
  }, [additionalInformation]);


  return (
    <SafeContainer>
      {currentQuestion === -1 ? (
        <BuildYourProfileScreen handlePress={() => setCurrentQuestion(0)} />
      ) : (
        <View style={generalStyles.container}>
          <Text style={generalStyles.requirement}>
            {currentQuestion + 1}/10
          </Text>
          <Text style={generalStyles.title}>
            {questionFieldList[currentQuestion].question}
          </Text>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            overScrollMode={'never'}
            contentContainerStyle={{flexGrow: 1}}>
            {questionFieldList[currentQuestion].answers.map((answer, index) => (
              <View
                key={questionFieldList[currentQuestion].question + index}
                style={generalStyles.clickableIndicatorPrimaryButton}>
                <Button.ClickableIndicatorPrimaryButton
                  onPress={() =>
                    ClickableIndicatorPrimaryButtonHandlePress(index, answer)
                  }
                  isActive={index === activeId}>
                  {answer}
                </Button.ClickableIndicatorPrimaryButton>
              </View>
            ))}
          </ScrollView>
          <View style={generalStyles.alignNextButtonContainer}>
            <Button.PrimaryButton
              onPress={handlePress}
              style={{
                ...generalStyles.nextButtonContainer,
                backgroundColor: valid
                  ? THEME_COLORS.primary
                  : THEME_COLORS.tertiary,
              }}>
              CONTINUE
            </Button.PrimaryButton>
          </View>
          <Text style={generalStyles.extraInformation}>
            Sharing more about yourself helps you in getting more people
            interested in you
          </Text>
        </View>
      )}
    </SafeContainer>
  );
};

export default MultipleQuestionsScreen;
