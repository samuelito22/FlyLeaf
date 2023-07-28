import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import moment from 'moment';

import {
  Button,
  KeyboardAvoidingViewWrapper,
  SafeContainer,
  BirthdayField,
  Alert,
  LoadingSpinner,
} from '../../../components';

import {ROUTES, THEME_COLORS, TYPES} from '../../../constants';

import {styles} from './styles';
import {usePreventBackHandler, useDispatch} from '../../../utils/hooks';
import {
  setDateOfBirth,
  setProgressBarValue,
  setIsRegisterCompleted,
} from '../../../redux';
import { AuthService } from '../../../services';
import { setIsBlocked } from '../../../redux';
import auth from "@react-native-firebase/auth"

const DateOfBirthScreen = ({
  navigation,
}: {
  navigation: NavigationProp<TYPES.RootStackParamList>;
}) => {
  // To prevent user from going back
  usePreventBackHandler();

  const [isLoading, setIsLoading] = useState(false);

  // Retrieve the birthday value from the Redux store
  const [dateOfBirthTemp, setDateOfBirthTemp] = useState<string | Date>('');

  // Dispatch function from Redux to update the birthday value
  const dispatch = useDispatch();

  // State variables for the alert visibility and validity of the input
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    // Check if the birthday is a valid date and age is less than 100
    const isValidDate = moment(dateOfBirthTemp, 'DDMMYYYY').isValid();
    const isAgeLessThan100 =
      moment().year() - moment(dateOfBirthTemp, 'DDMMYYYY').year() <= 100;

    if (
      isValidDate &&
      isAgeLessThan100 &&
      typeof dateOfBirthTemp === 'string' &&
      dateOfBirthTemp.length > 7
    ) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [dateOfBirthTemp]);

  useEffect(
    () =>
      dispatch(
        setIsRegisterCompleted({
          status: false,
          currentScreen: ROUTES.REGISTER_DATE_OF_BIRTH_SCREEN,
        }),
      ),
    [],
  );

  const handlePress = () => {
    if (valid) {
      setAlertVisible(true);
    }
  };

  const handleAlertClose = () => {
    setAlertVisible(false);
  };

  const handleAlertConfirm = async () => {
    setIsLoading(true);
    try {
      setAlertVisible(false);
      if (moment().year() - moment(dateOfBirthTemp, 'DDMMYYYY').year() < 18) {
        const controller = new AbortController()
        const uid = auth().currentUser?.uid
        if(uid)
        {
          AuthService.ageRestrictUser(uid, moment(dateOfBirthTemp, 'DD/MM/YYYY').toDate(), controller.signal).then(result => {
          dispatch(setIsBlocked(true))
        }
        ).catch(e => console.error(e))
      }
        setIsLoading(false)
        return () => controller.abort()
      } 
      // Dispatch the action to update the birthday in Redux
      dispatch(setDateOfBirth(moment(dateOfBirthTemp, 'DD/MM/YYYY').toDate()));
      // Navigate to the next screen
      navigation.navigate(ROUTES.REGISTER_GENDER_SELECTION_SCREEN);

      dispatch(setProgressBarValue(28));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingViewWrapper>
      <SafeContainer>
        {isLoading && <LoadingSpinner />}
        <View style={styles.container}>
          <Text style={styles.requirement}>Required</Text>
          <Text style={styles.title}>When is your birthday?</Text>
          <Text style={styles.paragraph}>
            Please input your birthdate in the field below
          </Text>
          <BirthdayField setDate={text => setDateOfBirthTemp(text)} />
          <View style={styles.alignNextButtonContainer}>
            <Button.PrimaryButton
              onPress={handlePress}
              style={{
                ...styles.nextButtonContainer,
                backgroundColor: valid
                  ? THEME_COLORS.primary
                  : THEME_COLORS.tertiary,
              }}>
              CONTINUE
            </Button.PrimaryButton>
          </View>
          <Text style={styles.extraInformation}>
            Your age, from your provided birthdate, will be shown to others and
            can't be altered. You must be at least 18 to use Flyleaf
          </Text>

          <Alert
            title="Confirmation"
            message={`Your birthday is on ${moment(
              dateOfBirthTemp,
              'DDMMYYYY',
            ).format('DD/MM/YYYY')}. Is that correct?`}
            visible={isAlertVisible}
            onClose={handleAlertClose}
            onConfirm={handleAlertConfirm}
          />
        </View>
      </SafeContainer>
    </KeyboardAvoidingViewWrapper>
  );
};

export default DateOfBirthScreen;
