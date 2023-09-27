import {API_ENDPOINTS} from '../constants';
import {TYPES} from '../constants';
import { storeTokensInKeychain } from '../utils/keychain';

const MAX_RETRIES = 3

const profileService = () => {
  const getNewRefreshAndAccessToken = async (refreshToken: string, signal?: AbortSignal, retryCount: number = 0):Promise<{accessToken:string, refreshToken:string, type:'success' | 'error'}> => {
    try {
        const response = await fetch(`${API_ENDPOINTS.REFRESH_TOKEN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${refreshToken}`
            },
            body: JSON.stringify({ grantType: "refresh_token" }),
            signal,
        });

        if (response.status >= 500 && retryCount < MAX_RETRIES) { // Check for server errors and retry count
            console.log(`Attempt ${retryCount + 1} failed. Retrying...`);
            const retryInMilliseconds = Math.pow(2, retryCount) * 1000 + Math.random() * 1000; // Exponential backoff with jitter
            await new Promise(res => setTimeout(res, retryInMilliseconds));
            return getNewRefreshAndAccessToken(refreshToken, signal, ++retryCount);
        }
        
        if (!response.ok) {
          return await response.json();
        }

        return await response.json();
    } catch (error: any) {
        console.log('Error message:', error.message);
        if (error.message === 'Network request failed' && retryCount < MAX_RETRIES) {
          console.log(`Network error at attempt ${retryCount + 1}. Retrying...`);
          const retryInMilliseconds = Math.pow(2, retryCount) * 1000 + Math.random() * 1000; 
          await new Promise(res => setTimeout(res, retryInMilliseconds));
          return getNewRefreshAndAccessToken(refreshToken, signal, retryCount + 1);
        }
        throw error; // propagate the error
    }
};

const getMyProfile = async (
  accessToken: string,
  refreshToken: string,
  longitude: number, latitude: number,
  signal?: AbortSignal,
  retryCount: number = 0
): Promise<{ type: 'success' | 'error', user: any }> => {
    try {
        const makeProfileRequest = async (token: string) => {
            return await fetch(`${API_ENDPOINTS.GET_MY_PROFILE}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ longitude, latitude, grantType: "access_token" }),
                signal,
            });
        };

        let response = await makeProfileRequest(accessToken);

        if (response.status === 401) {
            const tokenResult = await getNewRefreshAndAccessToken(refreshToken);
            if (tokenResult.type === "success") {
                await storeTokensInKeychain(
                    tokenResult.accessToken,
                    tokenResult.refreshToken,
                );
                return getMyProfile( tokenResult.accessToken, tokenResult.refreshToken,longitude, latitude,  signal, ++retryCount);
            }
        }

        if (response.status >= 500 && retryCount < MAX_RETRIES) {
          console.log(`Attempt ${retryCount + 1} failed. Retrying...`);
          const retryInMilliseconds = Math.pow(2, retryCount) * 1000 + Math.random() * 1000; 
          await new Promise(res => setTimeout(res, retryInMilliseconds));
          return getMyProfile( accessToken, refreshToken,longitude, latitude, signal, ++retryCount);
        }

        if (!response.ok) {
          return await response.json();
        }

        return await response.json();
    } catch (error: any) {
        //console.log('Error message:', error.message);
        if (error.message === 'Network request failed' && retryCount < MAX_RETRIES) {
          console.log(`Network error at attempt ${retryCount + 1}. Retrying...`);
          const retryInMilliseconds = Math.pow(2, retryCount) * 1000 + Math.random() * 1000; 
          await new Promise(res => setTimeout(res, retryInMilliseconds));
          return getMyProfile( accessToken, refreshToken,longitude, latitude, signal, ++retryCount);
      }
        throw error; // propagate the error
    }
};




  return {getMyProfile};
};

const getOverviewEn = async (signal?: AbortSignal, retryCount: number = 0): Promise<{questions: any, interests: any, languages: any, genders: any, relationshipGoals: any, answers: any ,type: 'success' | 'error'}> => {
  try {
    const response = await fetch(`${API_ENDPOINTS.GET_OVERVIEW_EN}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal,
    });

    if (response.status >= 500 && retryCount < MAX_RETRIES) {
      console.log(`Attempt ${retryCount + 1} failed. Retrying...`);
      const retryInMilliseconds = Math.pow(2, retryCount) * 1000 + Math.random() * 1000; // Exponential backoff with jitter
      await new Promise(res => setTimeout(res, retryInMilliseconds));
      return getOverviewEn(signal, ++retryCount);
    }

    if (!response.ok) {
      return await response.json();
    }

    const data = await response.json();
    return data

  } catch (error: any) {
    console.log('Error message:', error.message);
    if (error.message === 'Network request failed' && retryCount < MAX_RETRIES) {
      console.log(`Network error at attempt ${retryCount + 1}. Retrying...`);
      const retryInMilliseconds = Math.pow(2, retryCount) * 1000 + Math.random() * 1000; 
      await new Promise(res => setTimeout(res, retryInMilliseconds));
      return getOverviewEn(signal, ++retryCount);
  }
    throw error
  }
};

export const UserService = {
  ...profileService(),
  getOverviewEn,
};
