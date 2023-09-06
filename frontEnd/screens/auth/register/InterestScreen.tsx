import React, {useEffect, useState, useCallback} from 'react';
import {Text, View, ScrollView, Image, StyleSheet} from 'react-native';
import {styles as generalStyles} from './styles';
import {
  SafeContainer,
  Button,
  ThreeDotsLoader,
  Loading,
} from '../../../components';
import {RegisterActions, AppStatusActions, UserActions} from '../../../redux';
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
import editUserReducer from '../../../redux/reducers/editUserReducer';
import {ObjectId} from 'mongodb';
import { storeTokensInKeychain } from '../../../utils/keychain';
import { getData } from '../../../utils/storage';

const styles = StyleSheet.create({
  interest_title: {
    ...themeText.bodyBoldFour,
    color: THEME_COLORS.dark,
    paddingVertical: 10,
    textAlign: 'center',
  },
  interest_buttonsContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
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

const MAX_INTERESTS = 5;

type Interest = {
  _id: ObjectId;
  category: string;
  icon: string;
  name: string;
};

type GroupedInterests = {
  [key: string]: Interest[];
};

type Props = {
  navigation: NavigationProp<TYPES.RootStackParamList>;
};

const InterestScreen: React.FC<Props> = ({navigation}) => {
  usePreventBackHandler();
  const dispatch = useDispatch();
  const {
    email,
    username,
    dateOfBirth,
    seeking,
    gender,
    pictures,
    relationshipGoal,
    phoneNumber,
    additionalInformation,
  } = useSelector((state: TYPES.AppState) => state.registerReducer);

  const {interestsList} = useSelector(
    (state: TYPES.AppState) => state.usersReducer,
  );

  const groupedInterests = interestsList?.reduce<GroupedInterests>(
    (accumulator, interest) => {
      accumulator[interest.category] = accumulator[interest.category] || [];
      accumulator[interest.category].push(interest);
      return accumulator;
    },
    {},
  );

  // Local states
  const [valid, setValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<Set<ObjectId>>(new Set());

  // Handlers

  const handleInterestPress = useCallback((interestId: ObjectId) => {
    setAnswer(prevState => {
      const newAnswer = new Set(prevState);
      if (newAnswer.has(interestId)) {
        newAnswer.delete(interestId);
      } else {
        // If maximum interests haven't been reached, add the new interest.
        if (newAnswer.size < MAX_INTERESTS) {
          newAnswer.add(interestId);
        }
      }
      return newAnswer;
    });
  }, []);

  const handlePress = () => {
    if (valid) {
      //dispatch(RegisterActions.setInterests(Array.from(answer)));
      registration();
    }
  };

  const registration = async () => {
    if (
      !username ||
      !dateOfBirth ||
      !seeking ||
      !gender ||
      !pictures ||
      !relationshipGoal ||
      !additionalInformation ||
      !Array.from(answer)
    ) {
      // Handle missing data
      console.error('Missing data for registration');
      return;
    }

    let userRegisterParams: TYPES.UserRegisterParams = {
      username,
      dateOfBirth,
      seeking,
      gender: {primary: gender.primary},
      relationshipGoal,
      additionalInformation,
      interests: Array.from(answer),
      pictures,
    };

    if (email) {
      userRegisterParams.email = email;
    }

    if (phoneNumber) {
      userRegisterParams.phoneNumber = phoneNumber;
    }

    if (gender.secondary) {
      userRegisterParams.gender = {
        primary: gender.primary,
        secondary: gender.secondary,
      };
    }

    try {
      setIsLoading(true);
      const coordinates = await getData("coordinates")
      if(coordinates)
      await AuthService.userRegister(userRegisterParams,JSON.parse(coordinates) as {longitude: number, latitude: number}).then(async result => {
        if (result.type === 'error') {
          console.log(result.message);
        } else {
          await storeTokensInKeychain(
            result.accessToken,
            result.refreshToken,
          );

          dispatch(RegisterActions.resetRegister());
          navigation.navigate(ROUTES.BOTTOM_TAB_NAVIGATOR);
        }
      });
    } catch (error) {
      console.error('Error during registration', error);
    }
    setIsLoading(false);
  };

  // Effects
  useEffect(() => {
    setValid(answer.size === MAX_INTERESTS);
  }, [answer]);

  useEffect(() => {
    dispatch(
      RegisterActions.setIsRegisterCompleted({
        status: false,
        currentScreen: ROUTES.REGISTER_INTEREST_SCREEN,
      }),
    );
  }, []);

  return (
    <SafeContainer>
      {isLoading && (
        <Loading.ActiveIndicator modalBackground={{backgroundColor: 'white'}} />
      )}
      <View style={generalStyles.container}>
        <Text style={generalStyles.title}>What are your interests?</Text>
        <Text style={generalStyles.paragraph}>Please select 5 interests</Text>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          overScrollMode={'never'}
          contentContainerStyle={{flexGrow: 1}}>
          {groupedInterests &&
            Object.entries(groupedInterests as GroupedInterests).map(
              ([categoryTitle, interests]: [string, Interest[]], index) => (
                <View
                  key={categoryTitle + index}
                  style={styles.interest_section}>
                  <Text style={styles.interest_title}>{categoryTitle}</Text>
                  <View style={styles.interest_buttonsContainer}>
                    {interests.map((interest, idx) => {
                      return (
                        <Button.interestsButton
                          active={answer.has(interest._id)}
                          key={interest.name + idx}
                          style={styles.interest_button}
                          icon={interest.icon}
                          onPress={() => handleInterestPress(interest._id)}>
                          {interest.name}
                        </Button.interestsButton>
                      );
                    })}
                  </View>
                </View>
              ),
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
    </SafeContainer>
  );
};

export default InterestScreen;
