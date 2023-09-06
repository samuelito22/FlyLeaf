import {View, Text, StyleSheet, TextInput} from 'react-native';
import {useState} from 'react';
import {PALETTE, THEME_COLORS, TYPES, themeText} from '../../constants';
import {useDispatch} from '../../utils/hooks';
import {
  EditProfileHeader,
  KeyboardAvoidingViewWrapper,
  SafeContainer,
} from '../../components';
import {useSelector} from 'react-redux';
import {EditProfileActions} from '../../redux';

const EditCompanyScreen = () => {
  const [activeBorder, setActiveBorder] = useState(false);
  // Dispatch function from Redux to update the firstName value
  const dispatch = useDispatch();
  const company = useSelector(
    (state: TYPES.AppState) => state.editUserReducer.company,
  );

  return (
    <KeyboardAvoidingViewWrapper>
      <SafeContainer>
        <EditProfileHeader leftIconText="Save" />

        <View style={styles.container}>
          <Text style={styles.title}>What’s your company's name?</Text>
          <Text style={styles.paragraph}>
            Please enter your company's name in the field below
          </Text>
          <TextInput
            onFocus={() => setActiveBorder(true)}
            onBlur={() => setActiveBorder(false)}
            style={[
              styles.boxInput,
              {
                borderColor: activeBorder
                  ? THEME_COLORS.primary
                  : THEME_COLORS.tertiary,
              },
            ]}
            value={company ? company : ''}
            placeholder="Tech Innovators, Inc., etc."
            placeholderTextColor={THEME_COLORS.tertiary}
            onChangeText={text =>
              text != ''
                ? dispatch(
                    EditProfileActions.updateUserProfile('company', text),
                  )
                : dispatch(
                    EditProfileActions.updateUserProfile('company', undefined),
                  )
            }
          />
        </View>
      </SafeContainer>
    </KeyboardAvoidingViewWrapper>
  );
};

export default EditCompanyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 20,
    maxWidth: 325,
    width: '100%',
  },
  title: {
    ...themeText.headingTwo,
    color: THEME_COLORS.dark,
    marginBottom: 12,
  },

  paragraph: {
    ...themeText.bodyRegularFive,
    color: THEME_COLORS.dark,
    marginBottom: 17,
  },
  extraInformation: {
    ...themeText.bodyRegularSeven,
    color: THEME_COLORS.tertiary,
    textAlign: 'center',
    marginBottom: 15,
  },
  requirement: {
    ...themeText.bodyMediumSix,
    color: PALETTE.GRAY300,
  },
  boxInput: {
    backgroundColor: 'white',
    color: 'black',
    borderBottomWidth: 1,
    marginTop: 10,
    ...themeText.bodyRegularSix,
  },
});
