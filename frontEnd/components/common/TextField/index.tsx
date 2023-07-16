import {TextInput} from 'react-native';
import React from 'react';
import {styles} from './styles';
import {COLORS, TYPES} from '../../../constants';

const TextField: React.FC<TYPES.TextFieldProps> = ({
  placeholder,
  text,
  setText,
  style,
  autoCapitalize,
  keyboardType,
  secureTextEntry,
}) => {
  return (
    <TextInput
      style={[style, styles.inputBox]}
      onChangeText={setText}
      value={text}
      placeholder={placeholder}
      placeholderTextColor={COLORS.gray}
      autoCapitalize={autoCapitalize}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
    />
  );
};

export default TextField;
