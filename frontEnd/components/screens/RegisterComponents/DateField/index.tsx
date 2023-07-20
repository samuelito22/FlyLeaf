import React, {useState, useRef} from 'react';
import {Text, View, TextInput} from 'react-native';
import {styles} from './styles';
import {THEME_COLORS, TYPES} from '../../../../constants';

const DateField: React.FC<TYPES.DateFieldProps> = ({setDate, style}) => {
  const [text, setText] = useState('');
  const textInputRef = useRef<TextInput>(null);

  const onChange = (text: string) => {
    const regex = /^\d+$/;
    if (regex.test(text) || text === '') {
      setText(text);
      setDate(text);
    }
  };

  return (
    <View style={styles.dateField}>
      <View style={[styles.dateField__inputContainer, style]}>
        <Text
          style={[
            styles.dateField__input,
            {color: text[0] ? THEME_COLORS.dark : THEME_COLORS.tertiary},
          ]}>
          {text[0] ? text[0] : 'D'}
        </Text>
        <Text> </Text>
        <Text
          style={[
            styles.dateField__input,
            {color: text[1] ? THEME_COLORS.dark : THEME_COLORS.tertiary},
          ]}>
          {text[1] ? text[1] : 'D'}
        </Text>
        <Text
          style={[
            styles.dateField__input,
            {color: text[2] ? THEME_COLORS.dark : THEME_COLORS.tertiary},
          ]}>
          {' '}
          /{' '}
        </Text>
        <Text
          style={[
            styles.dateField__input,
            {color: text[2] ? THEME_COLORS.dark : THEME_COLORS.tertiary},
          ]}>
          {text[2] ? text[2] : 'M'}
        </Text>
        <Text> </Text>
        <Text
          style={[
            styles.dateField__input,
            {color: text[3] ? THEME_COLORS.dark : THEME_COLORS.tertiary},
          ]}>
          {text[3] ? text[3] : 'M'}
        </Text>
        <Text
          style={[
            styles.dateField__input,
            {color: text[4] ? THEME_COLORS.dark : THEME_COLORS.tertiary},
          ]}>
          {' '}
          /{' '}
        </Text>
        <Text
          style={[
            styles.dateField__input,
            {color: text[4] ? THEME_COLORS.dark : THEME_COLORS.tertiary},
          ]}>
          {text[4] ? text[4] : 'Y'}
        </Text>
        <Text> </Text>
        <Text
          style={[
            styles.dateField__input,
            {color: text[5] ? THEME_COLORS.dark : THEME_COLORS.tertiary},
          ]}>
          {text[5] ? text[5] : 'Y'}
        </Text>
        <Text> </Text>
        <Text
          style={[
            styles.dateField__input,
            {color: text[6] ? THEME_COLORS.dark : THEME_COLORS.tertiary},
          ]}>
          {text[6] ? text[6] : 'Y'}
        </Text>
        <Text> </Text>
        <Text
          style={[
            styles.dateField__input,
            {color: text[7] ? THEME_COLORS.dark : THEME_COLORS.tertiary},
          ]}>
          {text[7] ? text[7] : 'Y'}
        </Text>
      </View>
      <TextInput
        ref={textInputRef}
        style={styles.dateField__hiddenInput}
        value={text}
        onChangeText={onChange}
        keyboardType="numeric"
        maxLength={8}
      />
    </View>
  );
};

export default DateField;
