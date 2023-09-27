import {API_ENDPOINTS} from '../constants';

import { authorize } from 'react-native-app-auth';

const config = {
  clientId: '5f030af89dcf40e6a2f2cd3b5c8f09ef',
  redirectUrl: 'com.frontend:/callback',
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
  scopes: ['user-top-read'],
  issuer: 'https://accounts.spotify.com'
};

type SpotifyAuthResult = {
  accessToken: string;
  refreshToken: string;
} | null;

const spotifyAuth = async (): Promise<SpotifyAuthResult> => {
  try {
    const result = await authorize(config);
    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  } catch (error) {
    console.log('Auth Error', error);
    return null;
  }
};


const MAX_RETRIES = 3;

const authenticateAndFetchSpotify = async (
  _id: string,
  accessToken: string,
  refreshToken: string,
  signal?: AbortSignal,
  retryCount: number = 0
): Promise<any> => {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.AUTHENTICATE_AND_FETCH_SPOTIFY}/${_id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
        body: JSON.stringify({accessToken, refreshToken}),
      }
    );

    if (response.status >= 500 && retryCount < MAX_RETRIES) {
      console.log(`Attempt ${retryCount + 1} failed. Retrying...`);
      const retryInMilliseconds = Math.pow(2, retryCount) * 1000 + Math.random() * 1000;
      await new Promise(res => setTimeout(res, retryInMilliseconds));
      return authenticateAndFetchSpotify(_id, accessToken, refreshToken, signal, ++retryCount);
    }

    if (!response.ok) {
      throw new Error('Failed to authenticate and fetch Spotify');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.log('Error message:', error.message);
    if (error.message === 'Network request failed' && retryCount < MAX_RETRIES) {
      console.log(`Network error at attempt ${retryCount + 1}. Retrying...`);
      const retryInMilliseconds = Math.pow(2, retryCount) * 1000 + Math.random() * 1000; 
      await new Promise(res => setTimeout(res, retryInMilliseconds));
      return authenticateAndFetchSpotify(_id, accessToken, refreshToken, signal, ++retryCount);
    }
  }
};

const disconnectFromSpotify = async (
  _id: string,
  signal?: AbortSignal,
  retryCount: number = 0
): Promise<any> => {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.DISCONNECT_FROM_SPOTIFY}/${_id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
      }
    );

    if (response.status >= 500 && retryCount < MAX_RETRIES) {
      console.log(`Attempt ${retryCount + 1} failed. Retrying...`);
      const retryInMilliseconds = Math.pow(2, retryCount) * 1000 + Math.random() * 1000;
      await new Promise(res => setTimeout(res, retryInMilliseconds));
      return disconnectFromSpotify(_id, signal, ++retryCount);
    }

    if (!response.ok) {
      throw new Error('Failed to disconnect from Spotify');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.log('Error message:', error.message);
    if (error.message === 'Network request failed' && retryCount < MAX_RETRIES) {
      console.log(`Network error at attempt ${retryCount + 1}. Retrying...`);
      const retryInMilliseconds = Math.pow(2, retryCount) * 1000 + Math.random() * 1000; 
      await new Promise(res => setTimeout(res, retryInMilliseconds));
      return disconnectFromSpotify(_id, signal, ++retryCount);
    }
  }
};


export const SpotifyService = () => {
  return {
    authenticateAndFetchSpotify,
    disconnectFromSpotify,
    spotifyAuth
  };
};
