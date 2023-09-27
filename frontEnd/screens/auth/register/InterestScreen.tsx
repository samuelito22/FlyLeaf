import React, {useEffect, useState, useCallback} from 'react';
import {Text, View, ScrollView, Image, StyleSheet} from 'react-native';
import {styles as generalStyles} from './styles';
import {
  SafeContainer,
  Button,
  Loading,
} from '../../../components';
import {RegisterActions, AppStatusActions} from '../../../redux';
import {
  THEME_COLORS,
  ROUTES,
  TYPES,
  themeText,
  PALETTE,
} from '../../../constants';
import {NavigationProp} from '@react-navigation/native';
import {usePreventBackHandler, useDispatch, useErrorAlert} from '../../../utils/hooks';
import {useSelector} from 'react-redux';
import {AuthService} from '../../../services';
import { storeTokensInKeychain } from '../../../utils/keychain';
import { getLocationOnDemand } from '../../../utils/locationChecker';

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

const MAX_INTERESTS = 5;


type Props = {
  navigation: NavigationProp<TYPES.RootStackParamList>;
};

type Interest = {
  id: number;
  categoryId: number;
  category: {id: number, text: string};
  text: string;
};

type GroupedInterests = {
  [key: string]: Interest[];
};

const InterestScreen: React.FC<Props> = ({navigation}) => {
  usePreventBackHandler();
  const dispatch = useDispatch();
  const {
    email,
    dateOfBirth,
    pictures,
    phoneNumber,
    firstName,
    primaryGenderId,
    secondaryGenderId,
    longitude,
    latitude,
    interestsIds,
    answers,
    relationshipGoalId,
    seekingIds,
  } = useSelector((state: TYPES.AppState) => state.registerReducer);


  const {interests} = useSelector(
    (state: TYPES.AppState) => state.usersReducer,
  );

  const groupedInterests = interests?.reduce<GroupedInterests>(
    (accumulator, interest) => {
      accumulator[interest.category.text] = accumulator[interest.category.text] || [];
      accumulator[interest.category.text].push(interest);
      return accumulator;
    },
    {},
  );

  // Local states
  const [valid, setValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userChoices, setUserChoices] = useState<Set<number>>(new Set());
  const { notify, ErrorAlert } = useErrorAlert();


  // Handlers
  
  const handleInterestPress = useCallback((interestId: number) => {
    setUserChoices(prevState => {
      const newUserChoices = new Set(prevState);
      if (newUserChoices.has(interestId)) {
        newUserChoices.delete(interestId);
      } else {
        // If maximum interests haven't been reached, add the new interest.
        if (newUserChoices.size < MAX_INTERESTS) {
          newUserChoices.add(interestId);
        }
      }
      return newUserChoices;
    });
  }, []);

  const handlePress = async () => {
    if(valid){
      setIsLoading(true);
      dispatch(RegisterActions.setInterestsIds(Array.from(userChoices)))
      await getLocationOnDemand().then((position) => {
        dispatch(RegisterActions.setLongitude(position.coords.longitude))
        dispatch(RegisterActions.setLatitude(position.coords.latitude))
      })

      registration()

    }
  };


  const registration = async () => {
    let userRegisterParams: TYPES.UserRegisterParams = {
      firstName,
      phoneNumber,
      email,
      primaryGenderId,
      secondaryGenderId,
      longitude,
      latitude,
      seekingIds,
      interestsIds,
      dateOfBirth,
      pictures,
      relationshipGoalId,
      answers
    };
    try {
      await AuthService.userRegister(userRegisterParams).then(async result => {
        if (result.type === 'error') {
          console.log(result.message)
          notify('Something went wrong. Please try again later.');
        } else {
          await storeTokensInKeychain(
            result.accessToken,
            result.refreshToken,
          );

          dispatch(RegisterActions.resetRegister());
          dispatch(AppStatusActions.setCurrentScreen(ROUTES.BOTTOM_TAB_NAVIGATOR))
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
    setValid(userChoices.size === MAX_INTERESTS);
  }, [userChoices]);

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
              {ErrorAlert}

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
                    {interests.map((interest) => {
                      return (
                        <Button.interestsButton
                          active={userChoices.has(interest.id)}
                          key={interest.id}
                          style={styles.interest_button}
                          onPress={() => handleInterestPress(interest.id)}>
                          {interest.text}
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
