import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BackButton, SafeContainer} from '../../components';
import {ROUTES, THEME_COLORS, TYPES, themeText} from '../../constants';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {AuthService} from '../../services';

interface EmailVerificationProps {
  navigation?: NavigationProp<TYPES.RootStackParamList>;
  route?: RouteProp<
    TYPES.RootStackParamList,
    typeof ROUTES.EMAIL_VERIFICATION_SCREEN
  >;
}

const EmailVerificationScreen: React.FC<EmailVerificationProps> = ({
  navigation,
  route,
}) => {
  const actionType = route?.params?.actionType;
  const email = route?.params?.email;

  const renderParagraphText = () => {
    if (actionType === 'register') {
      return `An email has been sent to ${email}, please check your email.`;
    }

    return `If an account with ${email} was found, you will receive an email. Please check your email.`;
  };

  useEffect(() => {
    const controller = new AbortController(); 
    AuthService.handleDynamicLink;

    if (email) {
      AuthService.emailExist(email, controller.signal).then(result => {
        if (result && result.type === 'success' && actionType === 'login') {
          AuthService.createDynamicLink().then(dynamicLink => {
            AuthService.sendSignInLinkToEmail(email, dynamicLink)
              .then(() => {
                console.log('Email with sign-in link sent.');
              })
              .catch(error => {
                console.log('Error sending sign in link', error);
              });
          });
        } else if (result && actionType === 'register') {
          // The existence of email is gonna be checked anyways in EmailVerificationScren.tsx
          AuthService.createDynamicLink().then(dynamicLink => {
            AuthService.sendSignInLinkToEmail(email, dynamicLink)
              .then(() => {
                console.log('Email with sign-in link sent.');
              })
              .catch(error => {
                console.log('Error sending sign in link', error);
              });
          });
        }
      });
    }

    return () => {controller.abort()}
  }, [email]);

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
