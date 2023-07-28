import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {styles} from './styles';

import {
  Button,
  Dropdown,
  KeyboardAvoidingViewWrapper,
  LoadingSpinner,
  SafeContainer,
  Separator,
  TextField,
} from '../../../components';

import {ROUTES, THEME_COLORS, themeText, TYPES} from '../../../constants';
import {useFormValidation} from '../../../utils/hooks';
import {images} from '../../../assets';
import {NavigationProp} from '@react-navigation/native';
import {AuthService} from '../../../services';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {WEB_CLIENT_ID} from '@env';

const LoginStartScreen = ({
  navigation,
}: {
  navigation: NavigationProp<TYPES.RootStackParamList>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [dialingCode, setDialingCode] = useState('+44');
  const [mask, setMask] = useState('##-####-####');
  const {validateEmail, validatePhoneNumber, formatPhoneNumber} =
    useFormValidation();
  const [email, setEmail] = useState('');
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [phone, setPhone] = useState('');
  const [phoneIsValid, setPhoneIsValid] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      scopes: ['email'],
    });
  }, []);

  useEffect(() => {
    setEmailIsValid(validateEmail(email));
  }, [email]);

  useEffect(() => {
    setPhoneIsValid(
      validatePhoneNumber(phone)
        ? formatPhoneNumber(phone, dialingCode, mask) !== ''
        : false,
    );
  }, [phone]);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      if (showEmail && emailIsValid) {
        navigation.navigate(ROUTES.EMAIL_VERIFICATION_SCREEN, {
          actionType: 'login',
          email: email,
        });
      } else if (!showEmail && phoneIsValid) {
        const phoneNumber = formatPhoneNumber(phone, dialingCode, mask);
        navigation.navigate(ROUTES.LOGIN_OTP_SCREEN, {
          phoneNumber: phoneNumber,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingViewWrapper>
      <SafeContainer>
        {isLoading && <LoadingSpinner />}
        <View style={[styles.maxWidth_login, styles.container]}>
          <Text style={styles.title}>Welcome</Text>
          <View style={styles.toggleContainer}>
            <Text
              style={{
                color: THEME_COLORS.tertiary,
                ...themeText.bodyBoldSix,
                marginBottom: 5,
              }}>
              {showEmail ? 'Log In with phone number' : 'Log In with email'}
            </Text>
            <Text
              style={{color: THEME_COLORS.dark, ...themeText.bodyBoldThree}}>
              {showEmail ? 'Log In with email' : 'Log In with phone number'}
            </Text>
            <Button.ButtonImage
              imgUrl={images.swap}
              onPress={() => setShowEmail(!showEmail)}
              contentContainerStyle={styles.toggleContainer_swapButton}
              width={37.08}
              height={37.08}
            />
          </View>
          <View style={styles.inputBox}>
            {showEmail ? (
              <TextField
                placeholder="Type your email"
                text={email}
                setText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                  borderBottomColor: emailIsValid
                    ? THEME_COLORS.primary
                    : THEME_COLORS.tertiary,
                }}
              />
            ) : (
              <>
                <Dropdown
                  borderColor={
                    phoneIsValid ? THEME_COLORS.primary : THEME_COLORS.tertiary
                  }
                  setDialingCode={setDialingCode}
                  setMask={setMask}
                />
                <TextField
                  placeholder="Type your number"
                  text={phone}
                  setText={setPhone}
                  keyboardType="number-pad"
                  autoCapitalize="none"
                  style={{
                    borderBottomColor: phoneIsValid
                      ? THEME_COLORS.primary
                      : THEME_COLORS.tertiary,
                  }}
                />
              </>
            )}
          </View>
          <Button.PrimaryButton
            onPress={handleSignIn}
            style={{
              ...styles.signInButton,
              backgroundColor: showEmail
                ? emailIsValid
                  ? THEME_COLORS.primary
                  : THEME_COLORS.tertiary
                : phoneIsValid
                ? THEME_COLORS.primary
                : THEME_COLORS.tertiary,
            }}>
            Sign In
          </Button.PrimaryButton>
          <Separator style={styles.separator}>Or</Separator>
          <View style={styles.socialButtonsContainer}>
            <Button.ButtonImage
              imgUrl={images.googleBar}
              onPress={AuthService.onGoogleButtonPress} //Need to check if user.uid exist or not, to decide wether to send the user to register or not
              contentContainerStyle={styles.socialButton}
              width={301.54}
              height={51}
            />
            <Button.ButtonImage
              imgUrl={images.facebookBar}
              onPress={AuthService.onFacebookButtonPress} //Need to check if user.uid exist or not, to decide wether to send the user to register or not
              contentContainerStyle={styles.socialButton}
              width={301.54}
              height={51}
            />
          </View>
        </View>
      </SafeContainer>
    </KeyboardAvoidingViewWrapper>
  );
};

export default LoginStartScreen;
