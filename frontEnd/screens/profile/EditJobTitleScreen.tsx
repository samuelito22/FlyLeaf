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

const EditJobTitleScreen = () => {
  const [activeBorder, setActiveBorder] = useState(false);
  // Dispatch function from Redux to update the firstName value
  const dispatch = useDispatch();
  const jobTitle = useSelector(
    (state: TYPES.AppState) => state.editUserReducer.jobTitle,
  )

  return (
    <KeyboardAvoidingViewWrapper>
      <SafeContainer>
        <EditProfileHeader leftIconText="Save" />

        <View style={styles.container}>
          <Text style={styles.title}>What’s your job title?</Text>
          <Text style={styles.paragraph}>
            Please enter your job title in the field below
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
            value={jobTitle ? jobTitle : ''}
            placeholder="Marketing Manager, etc."
            placeholderTextColor={THEME_COLORS.tertiary}
            onChangeText={text =>
              dispatch(
                EditProfileActions.setJobTitle(text),
              )
            }
            numberOfLines={1}
          />
        </View>
      </SafeContainer>
    </KeyboardAvoidingViewWrapper>
  );
};

export default EditJobTitleScreen;

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
