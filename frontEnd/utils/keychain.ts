import * as Keychain from 'react-native-keychain';

export const storeTokensInKeychain = async (
  accessToken: string,
  refreshToken: string,
): Promise<void> => {
  try {
    const tokens = JSON.stringify({accessToken, refreshToken});
    await Keychain.setGenericPassword('userTokens', tokens);
  } catch (error) {
    console.error('Error storing the tokens:', error);
    // Handle the error based on your UX requirements.
  }
};

export const retrieveTokensFromKeychain = async (): Promise<{
  accessToken: string;
  refreshToken: string;
} | null> => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      return JSON.parse(credentials.password);
    }
  } catch (error) {
    console.error('Error retrieving the tokens:', error);
    // Handle the error based on your UX requirements.
  }
  return null;
};

export const removeTokensFromKeychain = async (): Promise<boolean> => {
  try {
    const result = await Keychain.resetGenericPassword();
    if (result) {
      return true;
    } else {
      console.error('Failed to remove tokens from keychain');
      return false;
    }
  } catch (error) {
    console.error('Error removing the tokens:', error);
    return false;
  }
};
