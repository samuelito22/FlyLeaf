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
  const {additionalInformation, interests} = useSelector(
    (state: TYPES.AppState) => state.registerReducer,
  );

  const [valid, setValid] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(-1);
  const [answer, setAnswer] = useState<string | Array<string>>('');

  const handlePress = () => {
    if (valid) {
      setIsLoading(true);
      try {
        if (additionalInformation) {
          if (currentQuestion < 9) {
            dispatch(
              setAdditionalInformation([
                ...additionalInformation,
                {
                  question: questionsList[currentQuestion].question,
                  answer: answer,
                  icon:  questionsList[currentQuestion].icon
                },
              ]),
            );
          } else {
            if (Array.isArray(answer)) {
              dispatch(setInterests(answer));
            }
          }
        } else if (typeof answer === 'string') {
          dispatch(
            setAdditionalInformation([
              {
                question: questionsList[currentQuestion].question,
                answer: answer,
                icon:  questionsList[currentQuestion].icon
              },
            ]),
          );
        }

        currentQuestion < 9 ? setAnswer('') : setAnswer([]);
        setActiveId(null);

        if (additionalInformation && additionalInformation.length === 9 && interests) {
          navigation.navigate(ROUTES.REGISTER_TERMS_AND_CONDITIONS_SCREEN);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
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

  const handleInterestPress = (interest: string) => {
    setAnswer(prevState => {
      if (Array.isArray(prevState) && prevState.includes(interest)) {
        return (prevState as Array<string>).filter(item => item !== interest);
      } else {
        if (prevState.length === 5) return prevState;
        else return [...(prevState as Array<string>), interest];
      }
    });
  };

  useEffect(() => {
    if (currentQuestion < 9) {
      setValid(answer ? true : false);
    } else {
      setValid(answer.length === 5);
    }
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
    if (additionalInformation) {
      setCurrentQuestion(additionalInformation.length);
    }
  }, [additionalInformation]);

  return (
    <SafeContainer>
      {isLoading && <LoadingSpinner/>}
      {currentQuestion === -1 ? (
        <BuildYourProfileScreen handlePress={() => setCurrentQuestion(0)} />
      ) : (
        <View style={generalStyles.container}>
          {isLoading && <LoadingSpinner />}
          <Text style={generalStyles.requirement}>
            {currentQuestion + 1}/10
          </Text>
          <Text style={generalStyles.title}>
            {currentQuestion < 9
              ? questionsList[currentQuestion].question
              : interestsList.question}
          </Text>
          {currentQuestion === 9 && (
            <Text style={generalStyles.paragraph}>
              Please select at 5 interests
            </Text>
          )}

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            overScrollMode={'never'}
            contentContainerStyle={{flexGrow: 1}}>
            {currentQuestion < 9
              ? questionsList[currentQuestion].answers.map((answer, index) => (
                  <View
                    key={questionsList[currentQuestion].question + index}
                    style={generalStyles.clickableIndicatorPrimaryButton}>
                    <Button.ClickableIndicatorPrimaryButton
                      onPress={() =>
                        ClickableIndicatorPrimaryButtonHandlePress(
                          index,
                          answer,
                        )
                      }
                      isActive={index === activeId}>
                      {answer}
                    </Button.ClickableIndicatorPrimaryButton>
                  </View>
                ))
              : interestsList.answers.map((category, index) => (
                  <View
                    key={category.title + index}
                    style={styles.interest_section}>
                    <Text style={styles.interest_title}>{category.title}</Text>
                    <View style={styles.interest_buttonsContainer}>
                      {category.interests.map((interest, idx) => {
                        return (
                          <Button.interestsButton
                          active = {answer.includes(interest)}
                            key={interest + idx}
                            style={styles.interest_button}
                            onPress={() => handleInterestPress(interest)}>
                            {interest}
                          </Button.interestsButton>
                        );
                      })}
                    </View>
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
