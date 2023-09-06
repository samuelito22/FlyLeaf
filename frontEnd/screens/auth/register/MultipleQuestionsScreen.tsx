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
import {ObjectId} from 'mongodb';

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
  const {additionalInformation} = useSelector(
    (state: TYPES.AppState) => state.registerReducer,
  );

  const [valid, setValid] = useState(false);
  const [activeId, setActiveId] = useState<ObjectId | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(-1);

  const {questionsList} = useSelector(
    (state: TYPES.AppState) => state.usersReducer,
  );

  const questionFieldList = questionsList?.filter(
    item => item.type === 'Advanced',
  );

  const addInformation = (qId: ObjectId, aId: ObjectId) => {
    const newInfo = {
      questionId: qId,
      answerId: aId,
    };

    if (additionalInformation) {
      dispatch(
        RegisterActions.setAdditionalInformation([
          ...additionalInformation,
          newInfo,
        ]),
      );
    } else {
      dispatch(RegisterActions.setAdditionalInformation([newInfo]));
    }
  };

  const handlePress = () => {
    if (valid && questionFieldList) {
      addInformation(
        questionFieldList[currentQuestion]._id,
        activeId as ObjectId,
      );
      setActiveId(null);

      if (currentQuestion < questionFieldList.length - 1) {
        // Only proceed to the next question if we haven't reached the last one
        setCurrentQuestion(prevState => (prevState as number) + 1);
      } else {
        navigation.navigate(ROUTES.REGISTER_INTEREST_SCREEN);
      }
    }
  };

  const ClickableIndicatorPrimaryButtonHandlePress = (id: ObjectId) => {
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
            {questionFieldList && questionFieldList[currentQuestion].question}
          </Text>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            overScrollMode={'never'}
            contentContainerStyle={{flexGrow: 1}}>
            {questionFieldList && currentQuestion < questionFieldList.length ? (
              questionFieldList[currentQuestion].answers.map(
                (answer, index) => (
                  <View
                    key={questionFieldList[currentQuestion].question + index}
                    style={generalStyles.clickableIndicatorPrimaryButton}>
                    <Button.ClickableIndicatorPrimaryButton
                      onPress={() =>
                        ClickableIndicatorPrimaryButtonHandlePress(answer._id)
                      }
                      isActive={answer._id === activeId}>
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
