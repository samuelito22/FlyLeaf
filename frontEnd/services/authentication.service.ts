import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {API_ENDPOINTS, TYPES} from '../constants';
import {BASE_URL} from '@env';

interface ConfirmationResult {
  success: boolean;
  userCredential?: FirebaseAuthTypes.UserCredential | null;
  error?: string;
}

const PhoneAuthService = () => {
  const sendVerificationCode = async (
    phoneNumber: string,
  ): Promise<FirebaseAuthTypes.ConfirmationResult> => {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    return confirmation;
  };

  const confirmVerificationCode = async (
    confirmation: FirebaseAuthTypes.ConfirmationResult,
    code: string,
  ): Promise<ConfirmationResult> => {
    try {
      const result = await confirmation.confirm(code);
      if (result) {
        return {success: true, userCredential: result};
      }
    } catch (error) {
      if (error instanceof Error) {
        return {success: false, error: error.message};
      }
    }
    return {success: false, error: 'Unexpected error during confirmation.'};
  };

  return {
    sendVerificationCode,
    confirmVerificationCode,
  };
};

const EmailLinkAuthService = () => {
  const sendSignInLinkToEmail = async (email: string, dynamicLink: string) => {
    const actionCodeSettings = {
      url: dynamicLink,
      handleCodeInApp: true,
      android: {
        packageName: 'com.flyleaf.frontend',
        installApp: true,
        minimumVersion: '12',
      },
      dynamicLinkDomain: 'flyleaf.page.link',
    };

    try {
      await auth().sendSignInLinkToEmail(email, actionCodeSettings);
      await AsyncStorage.setItem('emailForSignIn', email);
    } catch (error) {
      console.log('Error sending sign in link', error);
    }
  };

  const signInWithEmailLink = async (emailLink: string) => {
    const email = await AsyncStorage.getItem('emailForSignIn');
    if (email === null) {
      return {success: false, error: 'No email found for sign in.'};
    }

    if (auth().isSignInWithEmailLink(emailLink)) {
      return auth()
        .signInWithEmailLink(email, emailLink)
        .then(result => {
          AsyncStorage.removeItem('emailForSignIn');
          return {success: true, user: result.user};
        })
        .catch(error => {
          return {success: false, error: error.message};
        });
    }

    return {success: false, error: 'Invalid email link.'};
  };

  const handleDynamicLink = async () => {
    const unsubscribe = dynamicLinks().onLink(async link => {
      if (auth().isSignInWithEmailLink(link.url)) {
        const email = await AsyncStorage.getItem('emailForSignIn');
        if (email !== null) {
          const result = await signInWithEmailLink(link.url);
          if ('user' in result) {
            console.log('User signed in with email link!');
            // We assume that a signed-in user exists before this line
            const currentUser = auth().currentUser;

            // If we have a current user and the sign in with the email link was successful,
            // we link the current user with the new email credential
            if (currentUser) {
              const emailCredential = auth.EmailAuthProvider.credentialWithLink(
                email,
                link.url,
              );
              await currentUser.linkWithCredential(emailCredential);
            }
          } else if ('error' in result) {
            console.log('Error signing in with email link', result.error);
          }
        }
      }
    });

    unsubscribe();
  };

  const createDynamicLink = async () => {
    const link = await dynamicLinks().buildLink({
      link: 'https://flyleaf.page.link/verifyEmail', // Your dynamic link URL
      // domainUriPrefix is created in your Firebase console (Dynamic Links section)
      domainUriPrefix: 'https://flyleaf.page.link',
      android: {
        packageName: 'com.flyleaf.frontend',
        fallbackUrl:
          'https://play.google.com/store/apps/details?id=com.flyleaf.frontend',
      },
      ios: {
        bundleId: 'com.example.ios',
        fallbackUrl: 'https://apps.apple.com/app/id123456789',
      },
    });

    return link;
  };

  return {
    sendSignInLinkToEmail,
    handleDynamicLink,
    signInWithEmailLink,
    createDynamicLink,
  };
};

const OAuthService = () => {
  const onFacebookButtonPress = async () => {
    const result = await LoginManager.logInWithPermissions(['email']);
    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      throw 'Something went wrong obtaining access token';
    }
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );
    return auth().signInWithCredential(facebookCredential);
  };

  const onGoogleButtonPress = async () => {
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    const {idToken} = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    return auth().signInWithCredential(googleCredential);
  };

  return {
    onFacebookButtonPress,
    onGoogleButtonPress,
  };
};

const UserExistService = () => {
  const emailExist = async (email: string) => {
    const formData = new URLSearchParams();
    formData.append('email', email.toLowerCase());

    try {
      const response = await fetch(API_ENDPOINTS.EMAIL_EXIST, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const phoneNumberExist = async (phoneNumber: string) => {
    const formData = new URLSearchParams();
    formData.append('phoneNumber', phoneNumber);

    try {
      const response = await fetch(API_ENDPOINTS.PHONE_NUMBER_EXIST, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const userUidExist = async (uid: string) => {
    const formData = new URLSearchParams();
    formData.append('uid', uid);

    try {
      const response = await fetch(API_ENDPOINTS.UID_EXIST, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  return {
    emailExist,
    phoneNumberExist,
    userUidExist,
  };
};

const userRegister = async (userData: TYPES.UserRegisterParams) => {
  const formData = new URLSearchParams();

  Object.keys(userData).forEach(key => {
    let value = userData[key];
    if (Array.isArray(value)) {
      value = JSON.stringify(value);
    } else if (value instanceof Date) {
      value = value.toISOString();
    }
    formData.append(key, String(value));
  });

  try {
    const response = await fetch(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const AuthService = {
  ...PhoneAuthService(),
  ...EmailLinkAuthService(),
  ...OAuthService(),
  ...UserExistService(),
  userRegister,
};
