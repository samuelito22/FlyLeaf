import {API_ENDPOINTS} from '../constants';

const MAX_RETRIES = 0

const authenticateAndFetchInstagram = async (
  _id: string,
  code: string,
  signal?: AbortSignal,
  retryCount: number = 0
): Promise<any> => {
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
      }
    );

    if (response.status >= 500 && retryCount < MAX_RETRIES) {
      console.log(`Attempt ${retryCount + 1} failed. Retrying...`);
      const retryInMilliseconds = Math.pow(2, retryCount) * 1000 + Math.random() * 1000;
      await new Promise(res => setTimeout(res, retryInMilliseconds));
      return authenticateAndFetchInstagram(_id, code, signal, ++retryCount);
    }

    if (!response.ok) {
      throw new Error('Failed to authenticate and fetch Instagram');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.log('Error message:', error.message);
    if (error.message === 'Network request failed' && retryCount < MAX_RETRIES) {
      console.log(`Network error at attempt ${retryCount + 1}. Retrying...`);
      const retryInMilliseconds = Math.pow(2, retryCount) * 1000 + Math.random() * 1000; 
      await new Promise(res => setTimeout(res, retryInMilliseconds));
      return authenticateAndFetchInstagram(_id, code, signal, ++retryCount);
    }
  }
};

const disconnectFromInstagram = async (
  _id: string,
  signal?: AbortSignal,
  retryCount: number = 0
): Promise<any> => {
  try {
    const response = await fetch(
      `${API_ENDPOINTS.DISCONNECT_FROM_INSTAGRAM}/${_id}`,
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
      return disconnectFromInstagram(_id, signal, ++retryCount);
    }

    if (!response.ok) {
      throw new Error('Failed to disconnect from Instagram');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.log('Error message:', error.message);
    if (error.message === 'Network request failed' && retryCount < MAX_RETRIES) {
      console.log(`Network error at attempt ${retryCount + 1}. Retrying...`);
      const retryInMilliseconds = Math.pow(2, retryCount) * 1000 + Math.random() * 1000; 
      await new Promise(res => setTimeout(res, retryInMilliseconds));
      return disconnectFromInstagram(_id, signal, ++retryCount);
    }
  }
};

export const InstagramService = () => {
  return {
    authenticateAndFetchInstagram,
    disconnectFromInstagram,
  };
};
