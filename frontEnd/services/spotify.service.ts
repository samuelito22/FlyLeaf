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


const authenticateAndFetchSpotify = async (
  _id: string,
  accessToken: string,
  refreshToken: string,
  signal?: AbortSignal,
) => {
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
      },
    );
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.log('Error message:', error.message);
  }
};

const disconnectFromSpotify = async (_id: string, signal?: AbortSignal) => {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.DISCONNECT_FROM_SPOTIFY}/${_id}`,
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

export const SpotifyService = () => {
  return {
    authenticateAndFetchSpotify,
    disconnectFromSpotify,
    spotifyAuth
  };
};
