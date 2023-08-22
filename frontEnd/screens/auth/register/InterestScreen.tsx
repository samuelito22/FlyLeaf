import React, {useEffect, useState, useCallback} from 'react';
import {Text, View, ScrollView, Image, StyleSheet} from 'react-native';
import {styles as generalStyles} from './styles';
import {
  SafeContainer,
  Button,
  ThreeDotsLoader,
  Loading,
} from '../../../components';
import {
  RegisterActions,
  AppStatusActions,
  UserActions
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
import {AuthService} from '../../../services';
import auth from '@react-native-firebase/auth';
import editUserReducer from '../../../redux/reducers/editUserReducer';

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

const InterestScreen = ({
  navigation,
}: {
  navigation: NavigationProp<TYPES.RootStackParamList>;
}) => {
  usePreventBackHandler();
  const dispatch = useDispatch();
  const {
    email,
    firstName,
    dateOfBirth,
    genderPreferences,
    gender,
    pictures,
    relationshipGoal,
    phoneNumber,
    additionalInformation,
    interests,
    interestsList
  } = useSelector((state: TYPES.AppState) => state.registerReducer);

  const [valid, setValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<Array<string>>([]);


  const registration = async () => {
    if (!firstName || !dateOfBirth || !genderPreferences || !gender || !pictures || !relationshipGoal || !phoneNumber || !additionalInformation || !interests) {
      // Handle missing data
      console.error("Missing data for registration");
      return;
  }
    const currentUser = auth().currentUser;
    if (currentUser) {
      const uid = currentUser.uid;
      let userRegisterParams: TYPES.UserRegisterParams = {
        uid,
        profile: {
          firstName,
          dateOfBirth,
          gender
        },
        preferences: {
          genderPreferences,
          relationshipGoal,
        },
        contact: {
          phoneNumber,
        },
        interests: {
          interests: interests || answer,
          additionalInformation,
        },
      };

      if (email) {
        userRegisterParams.contact.email = email;
      }

      if (pictures.length > 0) {
        userRegisterParams.profile.pictures = pictures;
      }

      if(!gender.specific){
        userRegisterParams.profile.gender = {general: userRegisterParams.profile.gender.general}
      }

      try {
        setIsLoading(true);
        await AuthService.userRegister(
          userRegisterParams,
        ).then(result => {
          if (result.type === 'error') {
            console.log(result.message);
          } else {
            dispatch(AppStatusActions.setIsLoggedIn(true));
            dispatch(UserActions.setCurrentUserId(uid))
            dispatch(RegisterActions.resetRegister());
            navigation.navigate(ROUTES.BOTTOM_TAB_NAVIGATOR);
          }
        });
      } catch (error) {
        console.error('Error during registration', error);
      }
      setIsLoading(false);

    }
  };

  const handlePress = () => {
    if (valid) {
      dispatch(RegisterActions.setInterests(answer));
      registration()
    }
  };

  const handleInterestPress = useCallback((interest: string) => {
    setAnswer(prevState => {
      let newAnswer;
      if (Array.isArray(prevState) && prevState.includes(interest)) {
        newAnswer = prevState.filter(item => item !== interest);
      } else {
        if (prevState.length === 5) return prevState;
        else newAnswer = [...prevState, interest];
      }
      setValid(newAnswer.length === 5);
      return newAnswer;
    });
}, []);


  useEffect(() => {
    setValid(answer.length === 5);
  }, [answer]);

  useEffect(
    () =>
      dispatch(
        RegisterActions.setIsRegisterCompleted({
          status: false,
          currentScreen: ROUTES.REGISTER_INTEREST_SCREEN,
        }),
      ),
    [],
  );


  return (
    <SafeContainer>
      {isLoading && <Loading.ActiveIndicator modalBackground={{backgroundColor:'white'}} />}
        <View style={generalStyles.container}>
          <Text style={generalStyles.title}>
            {interestsList?.question}
          </Text>
          <Text style={generalStyles.paragraph}>
              Please select 5 interests
            </Text>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            overScrollMode={'never'}
            contentContainerStyle={{flexGrow: 1}}>
            {interestsList?.answers.map((category, index) => (
                  <View
                    key={category.title + index}
                    style={styles.interest_section}>
                    <Text style={styles.interest_title}>{category.title}</Text>
                    <View style={styles.interest_buttonsContainer}>
                      {category.interests.map((interest, idx) => {
                        return (
                          <Button.interestsButton
                            active={answer.includes(interest.title)}
                            key={interest.title + idx}
                            style={styles.interest_button}
                            icon={interest.icon}
                            onPress={() => handleInterestPress(interest.title)}>
                            {interest.title}
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
    </SafeContainer>
  );
};

export default InterestScreen;
