import {useState, useEffect} from 'react';

type UseCountdown = (
  initialCountdown: number,
  interval: number,
  callback: () => void,
) => number;

const useCountdown: UseCountdown = (initialCountdown, interval, callback) => {
  const [countdown, setCountdown] = useState(initialCountdown);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, interval);
      return () => clearInterval(timer);
    } else {
      callback();
    }
  }, [countdown, callback, interval]);

  return countdown;
};

export default useCountdown;
