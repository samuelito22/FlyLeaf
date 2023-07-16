import React from 'react';
import {View, Text} from 'react-native';
import {styles} from './styles';
import {TYPES} from '../../../../constants';

const Separator = ({children, style}: TYPES.SeparatorProps) => {
  return (
    <View style={[styles.separator, style]}>
      <View style={styles.separator__line} />
      <Text style={styles.separator__text}>{children}</Text>
    </View>
  );
};

export default Separator;
