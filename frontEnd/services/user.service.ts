import {API_ENDPOINTS} from '../constants';
import {TYPES} from '../constants';
import { storeTokensInKeychain } from '../utils/keychain';



const profileService = () => {
  const getNewRefreshAndAccessToken = async (refreshToken: string, signal?: AbortSignal) => {
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
        
        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        return await response.json();
    } catch (error: any) {
        console.log('Error message:', error.message);
        throw error; // propagate the error
    }
};

const getMyProfile = async (coordinates: { longitude: number, latitude: number }, accessToken: string, refreshToken: string, signal?: AbortSignal) => {
    try {
        const fetchProfile = async (token: string) => {
            return await fetch(`${API_ENDPOINTS.GET_MY_PROFILE}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ coordinates, grantType: "access_token" }),
                signal,
            });
        };

        let response = await fetchProfile(accessToken);
        const statusCode = response.status;

        if (statusCode === 401) {
            const tokenResult = await getNewRefreshAndAccessToken(refreshToken);
            if (tokenResult.type === "success") {
                await storeTokensInKeychain(
                    tokenResult.accessToken,
                    tokenResult.refreshToken,
                );
                response = await fetchProfile(tokenResult.accessToken);
            }
        }

        return await response.json();
    } catch (error: any) {
        console.log('Error message:', error.message);
        throw error; // propagate the error
    }
};


  const updateProfile = async (
    uid: string,
    data: TYPES.InitialStateEditUserType,
    signal?: AbortSignal,
  ) => {
    const {
      height,
      jobTitle,
      company,
      bio,
      sexualOrientation,
      languages,
      additionalInformation,
      covidVaccination,
      ethnicity,
      interests,
      gender,
      pictures,
    } = data;
    try {
      const response = await fetch(`${API_ENDPOINTS.UPDATE_PROFILE}/${uid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
        body: JSON.stringify({
          height,
          jobTitle,
          company,
          bio,
          sexualOrientation,
          languages,
          additionalInformation,
          covidVaccination,
          ethnicity,
          interests,
          gender,
          pictures,
        }),
      });
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.log('Error message:', error.message);
    }
  };

  const initUserProfile = async (
    uid: string,
    locationData: TYPES.PositionType,
    signal?: AbortSignal,
  ) => {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.INIT_USER_PROFILE}/${uid}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          signal,
          body: JSON.stringify({locationData: {coordinates: locationData}}),
        },
      );
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.log('Error message:', error.message);
    }
  };

  return {getMyProfile, initUserProfile, updateProfile};
};

const getOverviewEn = async (signal?: AbortSignal) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.GET_OVERVIEW_EN}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal,
    });

    const data = await response.json();

    return data;
  } catch (error: any) {
    console.log('Error message:', error.message);
  }
};

export const UserService = {
  ...profileService(),
  getOverviewEn,
};
