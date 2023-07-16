import React, {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {NavigationProp} from '@react-navigation/native';

import {
  Button,
  KeyboardAvoidingViewWrapper,
  LoadingSpinner,
  SafeContainer,
  TextField,
} from '../../../components';
import {ROUTES, COLORS, TYPES} from '../../../constants';
import {styles} from './styles';
import {
  useDispatch,
  useFormValidation,
  usePreventBackHandler,
} from '../../../utils/hooks';
import { setIsRegisterCompleted, setProgressBarValue} from '../../../redux';

const RecoveryEmailScreen = ({
  navigation,
}: {
  navigation: NavigationProp<TYPES.RootStackParamList>;
}) => {
  usePreventBackHandler();
  const [emailTemp, setEmailTemp] = useState('');

  const {validateEmail} = useFormValidation();

  const [valid, setValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => setValid(validateEmail(emailTemp)), [emailTemp]);

  useEffect(
    () => dispatch(setIsRegisterCompleted({status: false, currentScreen: ROUTES.REGISTER_RECOVERY_EMAIL_SCREEN})),
    [],
  );

  const handleProceedPress = () => {
    if (valid) {
      setIsLoading(true);
      try {
        navigation.navigate(ROUTES.EMAIL_VERIFICATION_SCREEN, {
          actionType: 'register',
          email: emailTemp,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSkipPress = () => {
    dispatch(setProgressBarValue(100));
    navigation.navigate(ROUTES.REGISTER_MULTIPLE_QUESTIONS_SCREEN);
  };

  return (
    <KeyboardAvoidingViewWrapper>
      <SafeContainer>
        {isLoading && <LoadingSpinner />}
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.skipContainer}
            onPress={handleSkipPress}>
            <Text style={styles.skipContainerText}>SKIP</Text>
          </TouchableOpacity>
          <Text style={styles.requirement}>Optional</Text>
          <Text style={styles.title}>What’s your recovery email?</Text>
          <Text style={styles.paragraph}>
            Please enter your recovery email in the field below
          </Text>
          <TextField
            placeholder="Type your email"
            text={emailTemp}
            setText={text => setEmailTemp(text)}
            keyboardType="email-address"
            autoCapitalize="none"
            style={{borderBottomColor: valid ? COLORS.primary : COLORS.gray}}
          />
          <View style={styles.alignNextButtonContainer}>
            <Button.PrimaryButton
              onPress={handleProceedPress}
              style={{
                ...styles.nextButtonContainer,
                backgroundColor: valid ? COLORS.primary : COLORS.gray,
              }}>
              CONTINUE
            </Button.PrimaryButton>
          </View>
          <Text style={styles.extraInformation}>
            It is important to have a recovery email as it will allow you to
            sign in your account without a phone number
          </Text>
        </View>
      </SafeContainer>
    </KeyboardAvoidingViewWrapper>
  );
};

export default RecoveryEmailScreen;
