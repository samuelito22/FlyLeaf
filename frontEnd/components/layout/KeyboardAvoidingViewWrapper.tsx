import {
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import React from 'react';
import {StyleSheet} from 'react-native';
import {TYPES} from '../../constants';

const KeyboardAvoidingViewWrapper: React.FC<
  TYPES.KeyboardAvoidingViewWrapperProps
> = ({children}) => {
  return (
    <KeyboardAvoidingView
      style={styles.KeyboardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.select({ios: 0, android: 500})}
      enabled>
      <ScrollView
        contentContainerStyle={styles.ScrollView}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        overScrollMode={'never'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {children}
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  KeyboardAvoidingView: {
    flex: 1,
  },
  ScrollView: {
    flexGrow: 1,
  },
});

export default KeyboardAvoidingViewWrapper;
