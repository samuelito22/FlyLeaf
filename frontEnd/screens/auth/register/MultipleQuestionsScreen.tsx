import React, {useEffect, useState} from 'react';
import {Text, View, ScrollView, Image, StyleSheet} from 'react-native';
import {styles as generalStyles} from './styles';
import {SafeContainer, Button} from '../../../components';
import {RegisterActions} from '../../../redux';
import {THEME_COLORS, ROUTES, TYPES} from '../../../constants';
import {NavigationProp} from '@react-navigation/native';
import {usePreventBackHandler, useDispatch} from '../../../utils/hooks';
import {useSelector} from 'react-redux';
import {icons} from '../../../assets';

const BuildYourProfileScreen = ({handlePress}: {handlePress: () => void}) => {
  return (
    <SafeContainer>
      <View style={generalStyles.container}>
        <Image
          source={icons.sprout}
          style={{
            width: 150,
            height: 150,
            marginBottom: 20,
            alignSelf: 'center',
          }}
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
  const userAnswers = useSelector(
    (state: TYPES.AppState) => state.registerReducer.answers,
  );

  const [valid, setValid] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(-1);

  const {questions, answers} = useSelector(
    (state: TYPES.AppState) => state.usersReducer,
  );

  const questionFieldList = questions?.filter(
    item => item.type === 'Advanced',
  );

  const [tempAnswers, setTempAnswers] = useState<{questionId: number, answerId: number}[]>([]);

  const addInformation = (qId: number, aId: number) => {
    const newInfo = {
      questionId: qId,
      answerId: aId,
    };
    // Change this line to update the tempAnswers state variable
    setTempAnswers(prevState => [...prevState, newInfo]);
  };
  
  const handlePress = () => {
    if (valid && questionFieldList) {
      addInformation(
        questionFieldList[currentQuestion].id,
        activeId as number,
      );
      setActiveId(null);
  
      if (currentQuestion < questionFieldList.length - 1) {
        setCurrentQuestion(prevState => (prevState as number) + 1);
      } else {
        
        navigation.navigate(ROUTES.REGISTER_INTEREST_SCREEN);
      }
    }
  };

  useEffect(() => {
    if (tempAnswers.length === 10) {
      dispatch(RegisterActions.setAnswers(tempAnswers));
    }
  }, [tempAnswers]);
  
  const ClickableIndicatorPrimaryButtonHandlePress = (id: number) => {
    if (id === activeId) {
      // check if the current id is the activeId
      setActiveId(null);
    } else {
      setActiveId(id); // set the clicked id as the activeId
    }
  };

  useEffect(() => {
    setValid(activeId !== null ? true : false);
  }, [activeId]);

  useEffect(
    () =>
      dispatch(
        RegisterActions.setIsRegisterCompleted({
          status: false,
          currentScreen: ROUTES.REGISTER_MULTIPLE_QUESTIONS_SCREEN,
        }),
      ),
    [],
  );

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
            {questionFieldList && questionFieldList[currentQuestion].text}
          </Text>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            overScrollMode={'never'}
            contentContainerStyle={{flexGrow: 1}}>
            {questionFieldList && currentQuestion < questionFieldList.length ? (
              answers?.filter(item=> item.questionId === questionFieldList[currentQuestion].id).map(
                (answer, index) => (
                  <View
                    key={answer.id}
                    style={generalStyles.clickableIndicatorPrimaryButton}>
                    <Button.ClickableIndicatorPrimaryButton
                      onPress={() =>
                        ClickableIndicatorPrimaryButtonHandlePress(answer.id)
                      }
                      isActive={answer.id === activeId}>
                      {answer.text}
                    </Button.ClickableIndicatorPrimaryButton>
                  </View>
                ),
              )
            ) : (
              <Text>No more answers to show.</Text>
            )}
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
