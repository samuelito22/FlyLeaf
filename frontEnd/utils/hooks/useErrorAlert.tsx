import React, { useRef, useEffect, useState } from 'react';
import { Animated } from 'react-native';
import { ErrorAlert } from '../../components';

const FadeInFadeOutError = ({message, isVisible, duration = 3000}:{message:string, isVisible:boolean, duration?: number}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(duration),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  return <ErrorAlert message={message} opacityValue={fadeAnim} />;
};

const useErrorAlert = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
  
    const notify = (msg:string) => {
      setMessage(msg);
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 4000);  // duration + animation timings
    };
  
    return { notify, ErrorAlert: <FadeInFadeOutError message={message} isVisible={isVisible} /> };
  };

  export default useErrorAlert