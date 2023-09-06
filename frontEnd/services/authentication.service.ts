import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import {API_ENDPOINTS, TYPES} from '../constants';
import {GoogleSignin} from "../googleConfig"


const PhoneAuthService = () => {
  const sendVerificationCode = async (
    phoneNumber: string,
    signal?: AbortSignal,
  ): Promise<any> => {
    try {
      const response = await fetch(`${API_ENDPOINTS.SEND_OTP}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
        body: JSON.stringify({phoneNumber}),
      });
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.log('Error message:', error.message);
    }
  };

  const confirmVerificationCode = async (
    otp: string,
    phoneNumber: string,
    signal?: AbortSignal,
  ): Promise<any> => {
    try {
      const response = await fetch(`${API_ENDPOINTS.VERIFY_OTP}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
        body: JSON.stringify({otp, phoneNumber}),
      });
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.log('Error message:', error.message);
    }
  };

  return {
    sendVerificationCode,
    confirmVerificationCode,
  };
};

const EmailLinkAuthService = () => {
  const sendEmailVerificationLink = async (
    email: string,
    grantType: string,
    signal?: AbortSignal,
  ) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.REQUEST_LOGIN_LINK}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
        body: JSON.stringify({email, grantType}),
      });
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.log('Error message:', error.message);
    }
  };

  const verifyAuthCode = async (authCode: string, signal?: AbortSignal) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.VALIDATE_AUTH_CODE}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
        body: JSON.stringify({authCode}),
      });
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.log('Error message:', error.message);
    }
  };

  return {
    sendEmailVerificationLink,
    verifyAuthCode,
  };
};

const OAuthService = () => {
  const onFacebookButtonPress = async () => {
    try {
      const result = await LoginManager.logInWithPermissions(['email']);
      if (result.isCancelled) {
        throw new Error('User cancelled the login process');
      }
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw new Error('Something went wrong obtaining access token');
      }

      // Send token to your backend for validation and user management
      const response = await fetch(`${API_ENDPOINTS.FACEBOOK_SIGN_IN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.accessToken}`
        },
        body: JSON.stringify({
          grantType: "access_token",
        }),
      });

      return await response.json();
    } catch (error:any) {
      console.log(error)
    }
  };

  const onGoogleButtonPress = async () => {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const {idToken} = await GoogleSignin.signIn();
      // Send token to your backend for validation and user management
      const response = await fetch(`${API_ENDPOINTS.GOOGLE_SIGN_IN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          grantType: "access_token",
        }),
      });

      return await response.json();
    } catch (error:any) {
      console.log(error)
    }
  };

  return {
    onFacebookButtonPress,
    onGoogleButtonPress,
  };
};

const UserExistService = () => {
  const emailExist = async (email: string, signal?: AbortSignal) => {
    const formData = new URLSearchParams();
    formData.append('email', email.toLowerCase());

    try {
      const response = await fetch(API_ENDPOINTS.EMAIL_EXIST, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        signal,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const phoneNumberExist = async (
    phoneNumber: string,
    signal?: AbortSignal,
  ) => {
    const formData = new URLSearchParams();
    formData.append('phoneNumber', phoneNumber);

    try {
      const response = await fetch(API_ENDPOINTS.PHONE_NUMBER_EXIST, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        signal,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const userUidExist = async (uid: string, signal?: AbortSignal) => {
    const formData = new URLSearchParams();
    formData.append('uid', uid);

    try {
      const response = await fetch(API_ENDPOINTS.ID_EXIST, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        signal,
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

const userRegister = async (
  userData: TYPES.UserRegisterParams,
  coordinates: { longitude: number, latitude: number },
  signal?: AbortSignal,
) => {
  try {
    // Initialize a new FormData object
    const formData = new FormData();

    for (let key in userData) {
      if (userData.hasOwnProperty(key)) {
        const value = userData[key as keyof TYPES.UserRegisterParams];

        // Check if the value is an object or an array and needs stringifying
        if (key !== 'pictures' && value && typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else if (key !== 'pictures' && value) {
          formData.append(key, value.toString());
        }
      }
    }

    formData.append("coordinates", JSON.stringify(coordinates));

    if (userData.pictures) {
      for (const uri of userData.pictures) {
        const fileType = uri.slice(((uri.lastIndexOf('.') - 1) >>> 0) + 2); // Extracting file extension
        const formDataFile = {
          uri: uri,
          type: `image/${fileType}`,
          name: uri.split('/').pop()!,
        };
        formData.append('pictures', formDataFile as any);
      }
    }

    const response = await fetch(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: formData,
      signal,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const AuthService = {
  ...PhoneAuthService(),
  ...OAuthService(),
  ...UserExistService(),
  userRegister,
  ...EmailLinkAuthService(),
};
