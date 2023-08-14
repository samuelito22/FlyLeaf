import React, { useRef, useState } from 'react'; // You need to import useRef
import { View, Text } from 'react-native';
import { OAuth2WebView, ThreeDotsLoader } from '../../components';
import { ROUTES, TYPES } from '../../constants';
import {NavigationProp, RouteProp} from '@react-navigation/native';

interface OAuthScreenProps {
    navigation?: NavigationProp<TYPES.RootStackParamList>;
  route?: RouteProp<
    TYPES.RootStackParamList,
    typeof ROUTES.OAUTH_SCREEN
  >;
}

const OAuthScreen = ({ navigation, route }: OAuthScreenProps) => {
    const config = route?.params?.config;
    const authCodeRef = route?.params?.authCodeRef

    const [loading, setLoading] = useState(true);

    const handleAuth = (code: string) => {
        if (authCodeRef) authCodeRef.current = code;
        navigation?.goBack();
    }

    if (!config) {
        return <Text>Error: Configuration not provided.</Text>;
    }

    return (
        <View style={{ flex: 1 }}> 
            {loading && <ThreeDotsLoader modalBackground={{backgroundColor:"white"}}/>}
            <OAuth2WebView
                onCodeReceived={(code) => handleAuth(code)}
                config={config}
                onLoadStart={() => setLoading(true)}
                onLoadEnd={() => setLoading(false)}
            />
        </View>
    );
}


export default OAuthScreen
