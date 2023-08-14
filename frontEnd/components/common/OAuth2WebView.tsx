import React, { useState, useEffect, useRef } from 'react';
import { Modal, BackHandler } from 'react-native';
import WebView from 'react-native-webview';
import { TYPES } from '../../constants';

function OAuth2WebView({ onCodeReceived, config, onLoadStart, onLoadEnd}:TYPES.oAuth2WebViewType) {
  const { authorizationEndpoint, clientId, redirectUrl, scopes } = config;

  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  
  const encodedScopes = encodeURIComponent(scopes.join(' '));

  
  const authUrl = `${authorizationEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUrl)}&response_type=code&scope=${encodedScopes}`;
  useEffect(() => {
    const backAction = () => {
      if (canGoBack) {
        webViewRef.current?.goBack();
      } 

      return true; 
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [canGoBack]);

  return (
      <WebView
        onLoadEnd={onLoadEnd}
        onLoadStart={onLoadStart}
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
  );
}

export default OAuth2WebView;
