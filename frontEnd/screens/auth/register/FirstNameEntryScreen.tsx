import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {NavigationProp} from '@react-navigation/native';

import {
  Button,
  KeyboardAvoidingViewWrapper,
  SafeContainer,
  TextField,
  Alert,
  LoadingSpinner,
} from '../../../components';

import {
  setFirstName,
  setIsRegisterCompleted,
  setProgressBarValue,
} from '../../../redux';
import {ROUTES, COLORS, TYPES} from '../../../constants';

import {styles} from './styles';
import {usePreventBackHandler, useDispatch} from '../../../utils/hooks';

const FirstNameEntryScreen = ({
  navigation,
}: {
  navigation: NavigationProp<TYPES.RootStackParamList>;
}) => {
  // To prevent user from going back
  usePreventBackHandler();

  const [isLoading, setIsLoading] = useState(false);

  const [text, setText] = useState(''); // For first name

  // Local state to store the formatted first name
  const [formattedFirstName, setFormattedFirstName] = useState(text);

  // Dispatch function from Redux to update the firstName value
  const dispatch = useDispatch();

  // State variables for the alert visibility and validity of the input
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    // Update the validity based on the length of the firstName
    setValid(text.length > 1);

    // Format the firstName with proper capitalization
    const nameParts = text.split(' ');
    for (let i = 0; i < nameParts.length; i++) {
      nameParts[i] =
        nameParts[i].charAt(0).toUpperCase() +
        nameParts[i].slice(1).toLowerCase();
    }
    setFormattedFirstName(nameParts.join(' '));
  }, [text]);

  useEffect(
    () => dispatch(setIsRegisterCompleted({status: false, currentScreen: ROUTES.REGISTER_FIRST_NAME_SCREEN})),
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
      // Dispatch the action to update the firstName in Redux
      dispatch(setFirstName(formattedFirstName));

      // Navigate to the next screen
      navigation.navigate(ROUTES.REGISTER_DATE_OF_BIRTH_SCREEN);

      // Update the progress using the setProgress function
      dispatch(setProgressBarValue(14));
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
          <Text style={styles.title}>What’s your first name?</Text>
          <Text style={styles.paragraph}>
            Please enter your first name in the field below
          </Text>
          <TextField
            placeholder="Type your first name"
            text={text}
            setText={text => setText(text)}
            keyboardType="default"
            autoCapitalize="words"
            style={{
              borderBottomColor: valid ? COLORS.primary : COLORS.gray,
            }}
          />
          <View style={styles.alignNextButtonContainer}>
            <Button.PrimaryButton
              onPress={handlePress}
              style={{
                ...styles.nextButtonContainer,
                backgroundColor: valid ? COLORS.primary : COLORS.gray,
              }}>
              CONTINUE
            </Button.PrimaryButton>
          </View>
          <Text style={styles.extraInformation}>
            Your first name promotes authenticity in the Flyleaf community. It's
            visible to others and unchangeable
          </Text>

          <Alert
            title="Confirmation"
            message={`You've entered your name as ${formattedFirstName}. Is that correct?`}
            visible={isAlertVisible}
            onClose={handleAlertClose}
            onConfirm={handleAlertConfirm}
          />
        </View>
      </SafeContainer>
    </KeyboardAvoidingViewWrapper>
  );
};

export default FirstNameEntryScreen;
