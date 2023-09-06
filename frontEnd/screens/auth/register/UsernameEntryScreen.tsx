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

const UserNameEntryScreen = ({
  navigation,
}: {
  navigation: NavigationProp<TYPES.RootStackParamList>;
}) => {
  usePreventBackHandler();

  const [isLoading, setIsLoading] = useState(false);

  const [text, setText] = useState(''); // For username

  const [formattedUsername, setFormattedUsername] = useState(text);
  const dispatch = useDispatch();

  const [isAlertVisible, setAlertVisible] = useState(false);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    setValid(text.length > 1 && text.length < 11);
    setFormattedUsername(text);
  }, [text]);

  useEffect(
    () =>
      dispatch(
        RegisterActions.setIsRegisterCompleted({
          status: false,
          currentScreen: ROUTES.REGISTER_USERNAME_SCREEN,
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
      dispatch(RegisterActions.setUsername(formattedUsername));
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
          <Text style={styles.title}>What's your username?</Text>
          <Text style={styles.paragraph}>
            Please enter your username of maximum of 10 characters in the field below.
          </Text>
          <TextField
            placeholder="Type your username"
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
            textAlign="center"
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
            Usernames promote individuality and privacy in the Flyleaf
            community. It allows members to maintain their privacy while
            interacting with others. Please note, your username is visible to
            others and unchangeable.
          </Text>

          <Alert
            title="Confirmation"
            message={`You've entered your username as ${formattedUsername}. Is that correct?`}
            visible={isAlertVisible}
            onClose={handleAlertClose}
            onConfirm={handleAlertConfirm}
          />
        </View>
      </SafeContainer>
    </KeyboardAvoidingViewWrapper>
  );
};

export default UserNameEntryScreen;
