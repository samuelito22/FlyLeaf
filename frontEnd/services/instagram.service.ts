import {API_ENDPOINTS} from '../constants';
import { authorize } from 'react-native-app-auth';

const config = {
  clientId: '614409710852626',
  redirectUrl: 'https://91db-90-242-236-229.ngrok-free.app/instagram/oauth/', // This should be set in your Instagram App's settings
  authorizationEndpoint: 'https://api.instagram.com/oauth/authorize',
  tokenEndpoint: 'https://api.instagram.com/oauth/access_token',
  scopes: ['user_profile', 'user_media'], // Permissions for accessing user's media and profile
  issuer: 'https://api.instagram.com'
};

type InstagramAuthResult = {
  accessToken: string;
} | null;

const instagramAuth = async (): Promise<InstagramAuthResult> => {
  try {
    const result = await authorize(config);
    console.log(result)
    return {
      accessToken: result.accessToken,
    };
  } catch (error) {
    console.log('Auth Error', error);
    return null;
  }
};


const authenticateAndFetchInstagram = async (
  _id: string,
  code: string,
  signal?: AbortSignal,
) => {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.AUTHENTICATE_AND_FETCH_INSTAGRAM}/${_id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
        body: JSON.stringify({code}),
      },
    );
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.log('Error message:', error.message);
  }
};

const disconnectFromInstagram = async (_id: string, signal?: AbortSignal) => {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.DISCONNECT_FROM_INSTAGRAM}/${_id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
      },
    );
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.log('Error message:', error.message);
  }
};

export const InstagramService = () => {
  return {
    authenticateAndFetchInstagram,
    disconnectFromInstagram,

    instagramAuth
  };
};
