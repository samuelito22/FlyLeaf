import {TextInput} from 'react-native';
import React from 'react';
import {styles} from './styles';
import {THEME_COLORS, TYPES} from '../../../constants';

const TextField: React.FC<TYPES.TextFieldProps> = ({
  placeholder,
  text,
  setText,
  style,
  autoCapitalize,
  keyboardType,
  secureTextEntry,
  multiLine
}) => {
  return (
    <TextInput
      style={[styles.inputBox, style]}
      onChangeText={setText}
      value={text}
      placeholder={placeholder}
      placeholderTextColor={THEME_COLORS.tertiary}
      autoCapitalize={autoCapitalize}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      multiline={multiLine}
    />
  );
};

export default TextField;
