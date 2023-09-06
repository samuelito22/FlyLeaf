import React, {useEffect, useMemo, useCallback, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BackButton, SafeContainer} from '../../components';
import {ROUTES, THEME_COLORS, TYPES, themeText} from '../../constants';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {AuthService} from '../../services';
import {storeTokensInKeychain} from '../../utils/keychain';
import {useDispatch} from '../../utils/hooks';
import {AppStatusActions, RegisterActions} from '../../redux';
import {getData, removeData, storeData} from '../../utils/storage';
import { useNavigationState } from '@react-navigation/native';

interface EmailVerificationProps {
  navigation?: NavigationProp<TYPES.RootStackParamList>;
  route?: RouteProp<
    TYPES.RootStackParamList,
    typeof ROUTES.EMAIL_VERIFICATION_SCREEN
  > & {
    params: {
      authCode: string;
      emailVerified: boolean;
    };
  };
}

interface RouteState {
  routes: {
    params: {
      authCode?: string;
      [key: string]: any; // for any other params you might have
    };
  }[];
  index: number;
}

const EmailVerificationScreen: React.FC<EmailVerificationProps> = ({
  navigation,
  route,
}) => {
  const [storedActionType, setStoredActionType] = useState<null | string>(null);
  const [storedEmail, setStoredEmail] = useState<null | string>(null);

  const actionType = route?.params?.actionType || storedActionType;
  const email = route?.params?.email || storedEmail;
  const [authCode, setAuthCode] = useState<string | null>(null);
  const [emailVerified, setEmailVerified] = useState<boolean | null>(null);


  const currentState: RouteState = useNavigationState(state => state as RouteState);

  useEffect(() => {
    const currentRoute = currentState.routes[currentState.index];
    if (currentRoute.params?.authCode) {
      setAuthCode(currentRoute.params.authCode);
    }

    if (currentRoute.params?.emailVerified) {
      setEmailVerified(currentRoute.params.emailVerified);
    }

  }, [currentState]);

  useEffect(() => {
    const fetchDataFromStorage = async () => {
      const retrievedActionType = await getData('actionType');
      const retrievedEmail = await getData('email');

      if (typeof retrievedActionType === 'string') {
        setStoredActionType(retrievedActionType);
      }
      if (typeof retrievedEmail === 'string') {
        setStoredEmail(retrievedEmail);
      }
    };

    fetchDataFromStorage();
  }, []);

  useEffect(() => {
    if (email && email !== storedEmail) {
      storeData('email', email);
    }

    if (actionType && actionType !== storedActionType) {
      storeData('actionType', actionType);
    }
  }, [email, actionType]);

  const dispatch = useDispatch();

  const renderParagraphText = () => {
    if (actionType === 'register') {
      return `If ${email} is not associated with an existing account, you will receive a verification email shortly. Please check your inbox.`;
    }

    return `If an account with ${email} was found, you will receive an email. Please check your email.`;
  };

  const sendEmailVerificationLink = useMemo(() => {
    if (email && actionType === 'login' && !authCode) {
      return AuthService.sendEmailVerificationLink(email, 'login');
    } else if (
      email &&
      actionType === 'register' &&
      emailVerified === undefined
    ) {
      return AuthService.sendEmailVerificationLink(email, 'register');
    }
    return null;
  }, [email, actionType, authCode, emailVerified]);

  useEffect(() => {
    async function completeVerification() {
        if (authCode && actionType === 'login') {
            const result = await AuthService.verifyAuthCode(authCode);
            if (result && result.accessToken && result.refreshToken) {
                await storeTokensInKeychain(result.accessToken, result.refreshToken);
                await removeData('email');
                await removeData('actionType');
                dispatch(AppStatusActions.setCurrentScreen(ROUTES.BOTTOM_TAB_NAVIGATOR))
                navigation?.navigate(ROUTES.BOTTOM_TAB_NAVIGATOR);
            }
        } else if (emailVerified && actionType === 'register' && email) {
            dispatch(RegisterActions.setEmail(email));
            await removeData('email');
            await removeData('actionType');
            navigation?.navigate(ROUTES.REGISTER_MULTIPLE_QUESTIONS_SCREEN);
        }
    }

    completeVerification();
}, [authCode, emailVerified, actionType, email, navigation, dispatch]);


  useEffect(() => {
    const controller = new AbortController();

    if (sendEmailVerificationLink) {
      sendEmailVerificationLink.catch(e => console.error(e));
    }



    return () => {
      controller.abort();
    };
  }, [sendEmailVerificationLink]);

  return (
    <SafeContainer>
      <BackButton
        onPress={() => {
          if (actionType === 'register') {
            navigation?.navigate(ROUTES.REGISTER_RECOVERY_EMAIL_SCREEN);
          } else {
            navigation?.navigate(ROUTES.LOGIN_START_SCREEN);
          }
        }}
      />

      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.header}>Check your email!</Text>
          <Text style={styles.paragraph}>{renderParagraphText()}</Text>
        </View>
      </View>
    </SafeContainer>
  );
};

export default EmailVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    ...themeText.headingOne,
    color: THEME_COLORS.dark,
    textAlign: 'center',
  },
  paragraph: {
    ...themeText.bodyRegularFour,
    color: THEME_COLORS.tertiary,
    textAlign: 'center',
  },
  paragraph__span: {
    ...themeText.bodyBoldFour,
    color: THEME_COLORS.tertiary,
    textAlign: 'center',
  },
  textContainer: {
    maxWidth: 396,
    paddingHorizontal: 10,
  },
});
