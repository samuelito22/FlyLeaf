import React, {useState, useEffect, useRef} from 'react';
import {Modal,Image, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import WebView from 'react-native-webview';
import {TYPES, themeText} from '../../constants';
import ThreeDotsLoader from './ThreeDotsLoader';
import {icons} from '../../assets';

function OAuth2WebView({
  isVisible,
  onCodeReceived,
  config,
  onClose,
}: TYPES.oAuth2WebViewType) {
  const {authorizationEndpoint, clientId, redirectUrl, scopes} = config;
  const [isLoading, setIsLoading] = useState(true);
  const webViewRef = useRef<WebView>(null);
  const [currentUrl, setCurrentUrl] = useState('');

  const encodedScopes = encodeURIComponent(scopes.join(','));

  const authUrl = `${authorizationEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUrl,
  )}&response_type=code&scope=${encodedScopes}`;

  return (
    <Modal visible={isVisible} animationType="slide">
      <View style={styles.navigationBar}>
        <TouchableOpacity onPress={onClose}>
          <Image source={icons.normalCross} style={styles.navBarButton}/>
        </TouchableOpacity>
        <Text style={styles.navBarUrl} numberOfLines={1}>
          {currentUrl}
        </Text>
      </View>
      <WebView
        onLoad={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        ref={webViewRef}
        source={{uri: authUrl}}
        incognito={true}
        onNavigationStateChange={navState => {
          setCurrentUrl(navState.url);

          if (navState.url.startsWith(redirectUrl)) {
            const code = navState.url.match(/code=([\s\S]+?)(&|$)/);
            if (code && code[1]) {
              onCodeReceived(code[1]);
            }
          }
        }}
      />
      {isLoading && (
        <ThreeDotsLoader modalBackground={{backgroundColor: 'white'}} />
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  navigationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 20,
  },
  navBarButton: {
    tintColor: 'white',
    width: 15,
    height: 15,
    resizeMode:'contain',
    marginRight: 20,
    alignSelf:'center'
  },
  navBarUrl: {
    color: 'white',
    ...themeText.bodyRegularSix,
    overflow: 'hidden',
  },
});

export default OAuth2WebView;
