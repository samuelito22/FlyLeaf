import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { WEB_CLIENT_ID } from '@env';

GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
    scopes: ['email'],
});

export { GoogleSignin };
