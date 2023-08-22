import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

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

import { AppStatusActions, RegisterActions} from '../../../redux';

import {styles} from './styles';
import {useCountdown, useDispatch} from '../../../utils/hooks';

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
  const [confirmation, setConfirmation] =
    useState<null | FirebaseAuthTypes.ConfirmationResult>(null);
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendButtonActive, setResendButtonActive] = useState(false);
  const [showResendInfo, setShowResendInfo] = useState(false);
  const dispatch = useDispatch();

  // effect - OTP
  useEffect(() => {
    if (OTP.length === OTP_LENGTH) {
      confirmOTPCode();
    } else {
      setShowError(false);
    }
  }, [OTP]);

  // effect - on mount
  useEffect(() => {
    let isMounted = true;

    const sendOTP = async () => {
      if (!phoneNumber || !isMounted) return;
      setIsLoading(true);

      try {
        const confirmation = await AuthService.sendVerificationCode(
          phoneNumber,
        );
        if (isMounted) {
          setConfirmation(confirmation);
          setShowResendInfo(true);
        }
      } catch (error) {
        console.error(error);
        setShowError(true);
        setConfirmation(null); // set confirmation to null in case of an error
      }

      setIsLoading(false);
    };

    sendOTP();

    // Cleanup function:
    return () => {
      isMounted = false;
    };
  }, [phoneNumber]);

  const confirmOTPCode = async () => {
    try {
      setIsLoading(true);
      const controller = new AbortController(); 
  
      if (!confirmation) {
        setIsLoading(false);
        return;
      }
  
      const result = await AuthService.confirmVerificationCode(confirmation, OTP);
  
      setIsLoading(false);
  
      if (result?.success) {
        if (
          result.userCredential &&
          result.userCredential.user.uid &&
          phoneNumber
        ) {
          try {
            const userUidExistResult = await AuthService.userUidExist(
              result.userCredential.user.uid,
              controller.signal
            );
            
            if (userUidExistResult.type === 'success') {
              dispatch(AppStatusActions.setIsLoggedIn(true));
              navigation?.navigate(ROUTES.BOTTOM_TAB_NAVIGATOR);
            } else if (userUidExistResult.type === 'error') {
              navigation?.navigate(ROUTES.REGISTER_NAVIGATOR);
              dispatch(RegisterActions.setPhoneNumber(phoneNumber));
            }
          } catch (error) {
            console.error(error);
            // Handle error here
          }
        }
      } else {
        setShowError(true);
      }
    } catch (error) {
      console.error(error);
      // Handle error here
    }
  };
  
  const sendOTP = async () => {
    if (!phoneNumber) return;

    const confirmation = await AuthService.sendVerificationCode(phoneNumber);

    setConfirmation(confirmation);
    setShowResendInfo(true);
  };

  const countdown = useCountdown(
    RESEND_COUNTDOWN_START,
    RESEND_COUNTDOWN_INTERVAL,
    () => {
      setShowResendInfo(false);
      setResendButtonActive(true);
    },
  );

  // render
  return (
    <KeyboardAvoidingViewWrapper>
      <SafeContainer>
        {isLoading && <Loading.ActiveIndicator modalBackground={{backgroundColor:"white"}} />}
        <BackButton
          onPress={() => navigation?.navigate(ROUTES.LOGIN_START_SCREEN)}
        />
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
