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

import {RegisterActions} from '../../../redux';
import {ROUTES, THEME_COLORS, TYPES} from '../../../constants';

import {styles} from './styles';
import {usePreventBackHandler, useDispatch} from '../../../utils/hooks';

const FirstNameEntryScreen = ({
  navigation,
}: {
  navigation: NavigationProp<TYPES.RootStackParamList>;
}) => {
  usePreventBackHandler();

  const [isLoading, setIsLoading] = useState(false);

  const [text, setText] = useState(''); // For first name

  const [formattedFirstName, setFormattedFirstName] = useState(text);
  const dispatch = useDispatch();

  const [isAlertVisible, setAlertVisible] = useState(false);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    setValid(text.length > 1 && text.length < 21);
    setFormattedFirstName(text);
  }, [text]);

  const handlePress = () => {
    if (valid) {
      setAlertVisible(true);
    }
  };

  const handleAlertClose = () => {
    setAlertVisible(false);
  };
  
  useEffect(
    () =>
      dispatch(
        RegisterActions.setIsRegisterCompleted({
          status: false,
          currentScreen: ROUTES.REGISTER_FIRST_NAME_SCREEN,
        }),
      ),
    [],
  );

  const handleAlertConfirm = async () => {
    setIsLoading(true);
    try {
      setAlertVisible(false);
      dispatch(RegisterActions.setFirstName(formattedFirstName));
      navigation.navigate(ROUTES.REGISTER_DATE_OF_BIRTH_SCREEN);
      dispatch(RegisterActions.setProgressBarValue(14));
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
          <Text style={styles.title}>What's your first name?</Text>
          <Text style={styles.paragraph}>
            Please enter your first name in the field below.
          </Text>
          <TextField
            placeholder="Type your first name"
            text={text}
            setText={text => setText(text)}
            keyboardType="default"
            autoCapitalize="words"
            style={{
              borderBottomColor: valid
                ? THEME_COLORS.primary
                : THEME_COLORS.tertiary,
              maxHeight: 45,
              maxWidth: 350,
              width: '100%',
              alignSelf: 'center',
            }}
          />
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
            Your first name promotes individuality and privacy in the Flyleaf
            community. It allows members to maintain their privacy while
            interacting with others. Please note, your first name is visible to
            others and unchangeable.
          </Text>

          <Alert
            title="Confirmation"
            message={`You've entered your first name as ${formattedFirstName}. Is that correct?`}
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
