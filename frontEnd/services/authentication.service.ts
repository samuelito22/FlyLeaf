import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import {API_ENDPOINTS, TYPES} from '../constants';
import {GoogleSignin} from "../googleConfig"


const MAX_RETRIES = 3;

const PhoneAuthService = () => {
  const sendVerificationCode = async (
    phoneNumber: string,
    signal?: AbortSignal,
    retryCount: number = 0
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

      if (response.status >= 500 && retryCount < MAX_RETRIES) {
        console.log(`Attempt ${retryCount + 1} failed. Retrying...`);
        const retryInMilliseconds = Math.pow(2, retryCount) * 1000 + Math.random() * 1000;
        await new Promise(res => setTimeout(res, retryInMilliseconds));
        return sendVerificationCode(phoneNumber, signal, ++retryCount);
      }

      if (!response.ok) {
        return await response.json();
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.log('Error message:', error.message);
      if (error.message === 'Network request failed' && retryCount < MAX_RETRIES) {
        console.log(`Network error at attempt ${retryCount + 1}. Retrying...`);
        const retryInMilliseconds = Math.pow(2, retryCount) * 1000 + Math.random() * 1000; 
        await new Promise(res => setTimeout(res, retryInMilliseconds));
        return sendVerificationCode(phoneNumber, signal, ++retryCount);
      }

      throw  error
    }
  };

  const confirmVerificationCode = async (
    otp: string,
    phoneNumber: string,
    signal?: AbortSignal,
    retryCount: number = 0
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

      if (response.status >= 500 && retryCount < MAX_RETRIES) {
        console.log(`Attempt ${retryCount + 1} failed. Retrying...`);
        const retryInMilliseconds = Math.pow(2, retryCount) * 1000 + Math.random() * 1000;
        await new Promise(res => setTimeout(res, retryInMilliseconds));
        return confirmVerificationCode(otp, phoneNumber, signal, ++retryCount);
      }

      if (!response.ok) {
        return await response.json();
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.log('Error message:', error.message);
      if (error.message === 'Network request failed' && retryCount < MAX_RETRIES) {
        console.log(`Network error at attempt ${retryCount + 1}. Retrying...`);
        const retryInMilliseconds = Math.pow(2, retryCount) * 1000 + Math.random() * 1000; 
        await new Promise(res => setTimeout(res, retryInMilliseconds));
        return confirmVerificationCode(otp, phoneNumber, signal, ++retryCount);
      }

      throw error
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
    retryCount: number = 0
  ):Promise<any> => {
    try {
      const response = await fetch(`${API_ENDPOINTS.REQUEST_LOGIN_LINK}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
        body: JSON.stringify({email, grantType}),
      });

      if (response.status >= 500 && retryCount < MAX_RETRIES) {
        console.log(`Attempt ${retryCount + 1} failed. Retrying...`);
        const retryInMilliseconds = Math.pow(2, retryCount) * 1000 + Math.random() * 1000;
        await new Promise(res => setTimeout(res, retryInMilliseconds));
        return sendEmailVerificationLink(email, grantType, signal, ++retryCount);
      }

      if (!response.ok) {
        return await response.json();
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.log('Error message:', error.message);
      if (error.message === 'Network request failed' && retryCount < MAX_RETRIES) {
        console.log(`Network error at attempt ${retryCount + 1}. Retrying...`);
        const retryInMilliseconds = Math.pow(2, retryCount) * 1000 + Math.random() * 1000; 
        await new Promise(res => setTimeout(res, retryInMilliseconds));
        return sendEmailVerificationLink(email, grantType, signal, ++retryCount);
      }

      throw error
    }
  };

  const verifyAuthCode = async (
    authCode: string,
    signal?: AbortSignal,
    retryCount: number = 0
  ):Promise<any> => {
    try {
      const response = await fetch(`${API_ENDPOINTS.VALIDATE_AUTH_CODE}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
        body: JSON.stringify({authCode}),
      });

      if (response.status >= 500 && retryCount < MAX_RETRIES) {
        console.log(`Attempt ${retryCount + 1} failed. Retrying...`);
        const retryInMilliseconds = Math.pow(2, retryCount) * 1000 + Math.random() * 1000;
        await new Promise(res => setTimeout(res, retryInMilliseconds));
        return verifyAuthCode(authCode, signal, ++retryCount);
      }

      if (!response.ok) {
        return await response.json();      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.log('Error message:', error.message);
      if (error.message === 'Network request failed' && retryCount < MAX_RETRIES) {
        console.log(`Network error at attempt ${retryCount + 1}. Retrying...`);
        const retryInMilliseconds = Math.pow(2, retryCount) * 1000 + Math.random() * 1000; 
        await new Promise(res => setTimeout(res, retryInMilliseconds));
        return verifyAuthCode(authCode, signal, ++retryCount);
      }

      throw error
    }
  };

  return {
    sendEmailVerificationLink,
    verifyAuthCode,
  };
};

const OAuthService = () => {
  const fetchWithRetry = async (endpoint: string, token: string, retryCount: number = 0):Promise<any> => {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          grantType: "access_token",
        }),
      });

      if (response.status >= 500 && retryCount < MAX_RETRIES) {
        console.log(`Attempt ${retryCount + 1} failed. Retrying...`);
        const retryInMilliseconds = Math.pow(2, retryCount) * 1000 + Math.random() * 1000;
        await new Promise(res => setTimeout(res, retryInMilliseconds));
        return fetchWithRetry(endpoint, token, ++retryCount);
      }

      return await response.json();
    } catch (error) {
      console.log(error);
      return null;
    }
  };

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
      return await fetchWithRetry(`${API_ENDPOINTS.FACEBOOK_SIGN_IN}`, data.accessToken);
    } catch (error: any) {
      console.log(error);
    }
  };

  const onGoogleButtonPress = async () => {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const {idToken} = await GoogleSignin.signIn();

      if(!idToken ) throw new Error('Failed to fetch idToken')
      // Send token to your backend for validation and user management
      return await fetchWithRetry(`${API_ENDPOINTS.GOOGLE_SIGN_IN}`, idToken);
    } catch (error: any) {
      console.log(error);
    }
  };

  return {
    onFacebookButtonPress,
    onGoogleButtonPress,
  };
};

const UserExistService = () => {
  const emailExist = async (email: string, signal?: AbortSignal, retryCount: number = 0):Promise<any> => {
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

      if (response.status >= 500 && retryCount < MAX_RETRIES) {
        console.log(`Attempt ${retryCount + 1} failed. Retrying...`);
        const retryInMilliseconds = Math.pow(2, retryCount) * 1000 + Math.random() * 1000;
        await new Promise(res => setTimeout(res, retryInMilliseconds));
        return emailExist(email, signal, ++retryCount);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      throw error
    }
  };

  const phoneNumberExist = async (
    phoneNumber: string,
    signal?: AbortSignal,
    retryCount: number = 0
  ):Promise<any> => {
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

      if (response.status >= 500 && retryCount < MAX_RETRIES) {
        console.log(`Attempt ${retryCount + 1} failed. Retrying...`);
        const retryInMilliseconds = Math.pow(2, retryCount) * 1000 + Math.random() * 1000;
        await new Promise(res => setTimeout(res, retryInMilliseconds));
        return phoneNumberExist(phoneNumber, signal, ++retryCount);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      throw error
    }
  };

  return {
    emailExist,
    phoneNumberExist,
  };
};

const userRegister = async (
  userData: TYPES.UserRegisterParams,
  signal?: AbortSignal,
  retryCount: number = 0
):Promise<any> => {

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

    if (response.status >= 500 && retryCount < MAX_RETRIES) {
      console.log(`Attempt ${retryCount + 1} failed. Retrying...`);
      const retryInMilliseconds = Math.pow(2, retryCount) * 1000 + Math.random() * 1000;
      await new Promise(res => setTimeout(res, retryInMilliseconds));
      return userRegister(userData, signal, retryCount + 1);
    }

    const data = await response.json();
    return data;
  } catch (error:any) {
    console.error(error);
    if (error.message === 'Network request failed' && retryCount < MAX_RETRIES) {
      console.log(`Network error at attempt ${retryCount + 1}. Retrying...`);
      const retryInMilliseconds = Math.pow(2, retryCount) * 1000 + Math.random() * 1000; 
      await new Promise(res => setTimeout(res, retryInMilliseconds));
      return userRegister(userData, signal, retryCount + 1);
    }

    throw error
  }
};

export const AuthService = {
  ...PhoneAuthService(),
  ...OAuthService(),
  ...UserExistService(),
  userRegister,
  ...EmailLinkAuthService(),
};
