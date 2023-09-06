import {API_ENDPOINTS} from '../constants';

const authenticateAndFetchSpotify = async (
  uid: string,
  code: string,
  signal?: AbortSignal,
) => {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.AUTHENTICATE_AND_FETCH_SPOTIFY}/${uid}`,
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

const disconnectFromSpotify = async (uid: string, signal?: AbortSignal) => {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.DISCONNECT_FROM_SPOTIFY}/${uid}`,
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

const refetchSpotify = async (uid: string, signal?: AbortSignal) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.REFETCH_SPOTIFY}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      signal,
      body: JSON.stringify({uid}),
    });

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error: any) {
    console.log('Error message:', error.message);
  }
};

export const SpotifyService = () => {
  return {
    authenticateAndFetchSpotify,
    disconnectFromSpotify,
    refetchSpotify,
  };
};
