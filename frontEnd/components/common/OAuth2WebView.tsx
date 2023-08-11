import React, { useState, useEffect, useRef } from 'react';
import { Modal, BackHandler } from 'react-native';
import WebView from 'react-native-webview';

function OAuth2WebView({ isVisible, onCodeReceived, config, onClose }:{
  isVisible: boolean, 
  onCodeReceived: (code: string) => void, 
  config: {
    authorizationEndpoint: string, 
    clientId: string, 
    redirectUrl: string
  }, 
  onClose: () => void
}) {
  const authorizationEndpoint = config.authorizationEndpoint;
  const clientId = config.clientId;
  const redirectUrl = config.redirectUrl;
  
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  const authUrl = `${authorizationEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUrl)}&response_type=code`;

  useEffect(() => {
    const backAction = () => {
      if (canGoBack) {
        webViewRef.current?.goBack();
      } else {
        onClose();
      }
      return true; 
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [canGoBack]);

  return (
    <Modal visible={isVisible} animationType="slide">
      <WebView
        ref={webViewRef}
        source={{ uri: authUrl }}
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
    </Modal>
  );
}

export default OAuth2WebView;
