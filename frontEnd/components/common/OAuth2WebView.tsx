import React, { useState, useEffect, useRef } from 'react';
import { Modal, BackHandler } from 'react-native';
import WebView from 'react-native-webview';
import { TYPES } from '../../constants';
import ThreeDotsLoader from './ThreeDotsLoader';
import { ButtonImage } from './Button';
import { icons } from '../../assets';

function OAuth2WebView({ isVisible, onCodeReceived, config, onClose }:TYPES.oAuth2WebViewType) {
  const { authorizationEndpoint, clientId, redirectUrl, scopes } = config;
  const [isLoading, setIsLoading] = useState(true)
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  
  const encodedScopes = encodeURIComponent(scopes.join(','));
  
  const authUrl = `${authorizationEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUrl)}&response_type=code&scope=${encodedScopes}`;

  return (
    <Modal visible={isVisible} animationType="slide">
      <WebView
        onLoad={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        ref={webViewRef}
        source={{ uri: authUrl }}
        incognito={true}
        onNavigationStateChange={(navState) => {
          setCanGoBack(navState.canGoBack);

          if (navState.url.startsWith(redirectUrl)) {
            const code = navState.url.match(/code=([\s\S]+?)(&|$)/);
            if (code && code[1]) {
              onCodeReceived(code[1]);
            }
          }
        }}
      />
      {isLoading && <ThreeDotsLoader modalBackground={{backgroundColor:"white"}}/>}
    </Modal>
  );
}

export default OAuth2WebView;
