import {useEffect} from 'react';
import {BackHandler} from 'react-native';

const usePreventBackHandler = () => {
  useEffect(() => {
    const backAction = () => {
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
};

export default usePreventBackHandler;
