import {useCallback} from 'react';

const useFormValidation = () => {
  const formatPhoneNumber = useCallback(
    (phoneNumber: string, dialingCode: string, mask: string | string[]) => {
      if (phoneNumber.startsWith('0')) {
        phoneNumber = phoneNumber.slice(1);
      }

      const apply = (mask: string) => {
        const tempPhoneNumber = phoneNumber.replace(/\D/g, '');
        const numberOfNines = mask
          .split('')
          .filter(char => char === '#').length;

        if (numberOfNines !== tempPhoneNumber.length) {
          return '';
        }

        let formattedNumber = `${dialingCode}`;

        let index = 0;
        for (let i = 0; i < mask.length; i++) {
          if (mask[i] === '#') {
            formattedNumber += tempPhoneNumber[index];
            index++;
          }
        }
        return formattedNumber;
      };

      let accept = false;
      let formattedNumber = '';
      if (Array.isArray(mask)) {
        for (let i = 0; i < mask.length; i++) {
          formattedNumber = apply(mask[i]);
          if (formattedNumber !== '') {
            accept = true;
            break;
          }
        }
      } else {
        formattedNumber = apply(mask);
        if (formattedNumber !== '') {
          accept = true;
        }
      }

      if (accept) {
        return formattedNumber;
      }
      return '';
    },
    [],
  );

  const validateEmail = useCallback((email: string): boolean => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
  }, []);

  const validatePhoneNumber = useCallback((phoneNumber: string): boolean => {
    const regex = /^\d+$/;
    return regex.test(phoneNumber);
  }, []);

  return {
    formatPhoneNumber,
    validateEmail,
    validatePhoneNumber,
  };
};

export default useFormValidation;
