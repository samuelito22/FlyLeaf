import React, {useEffect, useState, useCallback} from 'react';
import {View, Text} from 'react-native';
import {ROUTES, THEME_COLORS, TYPES} from '../../../constants';
import {AuthService} from '../../../services';
import {NavigationProp, RouteProp} from '@react-navigation/native';

import {
  BackButton,
  Button,
  KeyboardAvoidingViewWrapper,
  Loading,
  LoadingSpinner,
  OTPField,
  SafeContainer,
} from '../../../components';


import {styles} from './styles';
import {useCountdown, useDispatch} from '../../../utils/hooks';
import {storeTokensInKeychain} from '../../../utils/keychain';
import { AppStatusActions, RegisterActions } from '../../../redux';

interface LoginOTPScreenProps {
  navigation?: NavigationProp<TYPES.RootStackParamList>;
  route?: RouteProp<TYPES.RootStackParamList, 'LOGIN_OTP_SCREEN'>;
}

const OTP_LENGTH = 6;
const RESEND_COUNTDOWN_START = 60;
const RESEND_COUNTDOWN_INTERVAL = 1000; // in milliseconds

const LoginOTPScreen = ({navigation, route}: LoginOTPScreenProps) => {
  const {phoneNumber} = route?.params || {};

  // states
  const [OTP, setOTP] = useState('');
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendButtonActive, setResendButtonActive] = useState(false);
  const [showResendInfo, setShowResendInfo] = useState(false);
  const dispatch = useDispatch()

  // effect - OTP
  useEffect(() => {
    if (OTP.length === OTP_LENGTH) {
      confirmOTPCode();
    } else {
      setShowError(false);
    }
  }, [OTP]);

  const confirmOTPCode = useCallback(async () => {
    if (phoneNumber && OTP.length === 6) {
      try {
        setIsLoading(true);

        const result = await AuthService.confirmVerificationCode(
          OTP,
          phoneNumber,
        );

        setIsLoading(false);

        if (result?.type === 'success') {
          if (result.newUser) {
            dispatch(RegisterActions.setPhoneNumber(phoneNumber))
            navigation?.navigate(ROUTES.REGISTER_NAVIGATOR);
          } else {
            await storeTokensInKeychain(
              result.accessToken,
              result.refreshToken,
            );
            navigation?.navigate(ROUTES.BOTTOM_TAB_NAVIGATOR);
            dispatch(AppStatusActions.setCurrentScreen(ROUTES.BOTTOM_TAB_NAVIGATOR))

          }
        } else {
          setShowError(true);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [phoneNumber, OTP, navigation]);

  const sendOTP = useCallback(async () => {
    if (!phoneNumber) return;

    setIsLoading(true);
    try {
      await AuthService.sendVerificationCode(phoneNumber);
      setShowResendInfo(true);
    } catch (error) {
      console.error(error);
      setShowError(true);
    }
    setIsLoading(false);
  }, [phoneNumber]);

  const backButtonPress = useCallback(() => {
    navigation?.navigate(ROUTES.LOGIN_START_SCREEN);
  }, [navigation]);

  const countdown = useCountdown(
    RESEND_COUNTDOWN_START,
    RESEND_COUNTDOWN_INTERVAL,
    () => {
      setShowResendInfo(false);
      setResendButtonActive(true);
    },
  );

  useEffect(() => {
    sendOTP();
  }, [phoneNumber, sendOTP]);

  // render
  return (
    <KeyboardAvoidingViewWrapper>
      <SafeContainer>
        {isLoading && <Loading.ActiveIndicator />}
        <BackButton onPress={backButtonPress} />

        <View style={[styles.container, styles.maxWidth_otp]}>
          <Text style={styles.title}>Verification</Text>
          <Text style={[styles.paragraph, styles.paragraph_marginBottom_otp]}>
            We have sent a verification code to your mobile phone number
          </Text>
          <OTPField
            OTPLength={6}
            OTP={OTP}
            setOTP={setOTP}
            style={{marginBottom: 40}}
          />
          <Button.PrimaryButton
            onPress={sendOTP}
            style={{
              backgroundColor: resendButtonActive
                ? THEME_COLORS.primary
                : THEME_COLORS.tertiary,
            }}>
            Resend
          </Button.PrimaryButton>
          {showResendInfo && (
            <Text style={styles.resendInfo}>Resend in {countdown} seconds</Text>
          )}
          <Text style={[styles.error, {opacity: showError ? 1 : 0}]}>
            SMS verification was unsuccessful, please try again
          </Text>
        </View>
      </SafeContainer>
    </KeyboardAvoidingViewWrapper>
  );
};

export default LoginOTPScreen;
