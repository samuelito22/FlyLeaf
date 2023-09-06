import {Text, View, TextInput} from 'react-native';
import React, {useState, ReactElement, useRef} from 'react';
import {styles} from './styles';
import {PALETTE, THEME_COLORS, TYPES} from '../../../constants/';

const OTPField: React.FC<TYPES.OTPFieldProps> = ({
  OTPLength,
  OTP,
  setOTP,
  style,
}): ReactElement => {
  const [text, setText] = useState(''); // Define text and setText here
  const textInputRef = useRef<TextInput>(null);

  const inputs = Array.from({length: OTPLength}, (_, i) => {
    return (
      <View
        style={[
          styles.OTPField__box,
          {
            ...style,
            borderColor: OTP[i] ? THEME_COLORS.primary : PALETTE.GHOSTWHITE,
          },
        ]}
        key={i}>
        <Text style={styles.OTPField__box__input}>{OTP[i]}</Text>
      </View>
    );
  });

  const onChange = (text: string) => {
    const regex = /^\d+$/;
    if (regex.test(text) || text === '') {
      setText(text);
      setOTP(text);
    }
  };

  return (
    <View style={styles.OTPField}>
      <View style={styles.OTPField__container}>{inputs}</View>
      <TextInput
        ref={textInputRef}
        style={styles.OTPField__hiddenBox}
        value={text}
        onChangeText={onChange}
        keyboardType="numeric"
        maxLength={OTPLength}
      />
    </View>
  );
};

export default OTPField;
