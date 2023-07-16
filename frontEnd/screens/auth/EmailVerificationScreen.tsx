import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BackButton, Button, SafeContainer} from '../../components';
import {COLORS, ROUTES, TYPES, themeText} from '../../constants';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {icons} from '../../assets';
import {AuthService} from '../../services';

interface EmailVerificationProps {
  navigation?: NavigationProp<TYPES.RootStackParamList>;
  route?: RouteProp<TYPES.RootStackParamList, 'EMAIL_VERIFICATION_SCREEN'>;
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
    AuthService.handleDynamicLink;

    if (email) {
      AuthService.emailExist(email).then(result => {
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
  }, [email]);

  return (
    <SafeContainer>
   <BackButton onPress={() => {
          if (actionType === 'register') {
            navigation?.navigate(ROUTES.REGISTER_RECOVERY_EMAIL_SCREEN);
          } else {
            navigation?.navigate(ROUTES.LOGIN_START_SCREEN);
          }
        }}/>

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
    color: COLORS.dark,
    textAlign: 'center',
  },
  paragraph: {
    ...themeText.bodyRegularFour,
    color: COLORS.gray,
    textAlign: 'center',
  },
  paragraph__span: {
    ...themeText.bodyBoldFour,
    color: COLORS.gray,
    textAlign: 'center',
  },
  textContainer: {
    maxWidth: 396,
    paddingHorizontal: 10,
  },
});
