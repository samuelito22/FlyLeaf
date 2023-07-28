import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Button, SafeContainer} from '../../../components';
import {THEME_COLORS, ROUTES, TYPES, themeText} from '../../../constants';
import {icons} from '../../../assets';
import {usePreventBackHandler, useDispatch} from '../../../utils/hooks';
import {useSelector} from 'react-redux';
import auth from '@react-native-firebase/auth';
import {AuthService} from '../../../services';
import {resetRegister, setIsRegisterCompleted} from '../../../redux';
import {NavigationProp} from '@react-navigation/native';

const TermsAndConditionsScreen = ({
  navigation,
}: {
  navigation: NavigationProp<TYPES.RootStackParamList>;
}) => {
  const [checkBoxClicked, setCheckBoxClicked] = useState(false);

  const dispatch = useDispatch();

  const {
    email,
    firstName,
    dateOfBirth,
    genderPreferences,
    gender,
    pictures,
    relationshipGoal,
    phoneNumber,
    additionalInformation,
    interests,
  } = useSelector((state: TYPES.AppState) => state.registerReducer);


  usePreventBackHandler();

  const onPress = async () => {
    if (checkBoxClicked) {
      const currentUser = auth().currentUser;
      if (currentUser) {
        const uid = currentUser.uid;
        let userRegisterParams: TYPES.UserRegisterParams = {
          uid,
          profile: {
            firstName,
            dateOfBirth,
            gender,
          },
          preferences: {
            genderPreferences,
            relationshipGoal,
          },
          contact: {
            phoneNumber,
          },
          interests: {
            interests,
            additionalInformation
          },
        };       
  
        if (email) {
          userRegisterParams.contact.email = email;
        }
  
        if (pictures.length > 0) {
          userRegisterParams.profile.pictures = pictures;
        }
  
        const controller = new AbortController(); 
        try {
          await AuthService.userRegister(userRegisterParams, controller.signal).then(result => {
            if (result.type === 'error') {
              console.log(result.message);
            } else {
              dispatch(resetRegister());
              navigation.navigate(ROUTES.BOTTOM_TAB_NAVIGATOR);
            }
          });
        } catch (error) {
          console.error('Error during registration', error);
        }
  
        return () => controller.abort(); 
      }
    }
  };
  

  useEffect(
    () =>
      dispatch(
        setIsRegisterCompleted({
          status: false,
          currentScreen: ROUTES.REGISTER_TERMS_AND_CONDITIONS_SCREEN,
        }),
      ),
    [],
  );

  return (
    <SafeContainer>
      <View style={styles.headerContainer}>
        <Text style={styles.headerContainer_title}>Terms And Conditions</Text>
        <Text style={styles.headerContainer_subTitle}>
          Last updated on July 2023
        </Text>
      </View>
      <ScrollView
        overScrollMode="never"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.bodyContainer}>
        <View style={styles.section}>
          <Text style={styles.bodyContainer_title}>1. Lorem ipsum dolor</Text>
          <Text style={styles.bodyContainer_paragraph}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,Lorem ipsum
            dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit
            amet, consectetur adipiscing elitLorem ipsum dolor sit amet,
            consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur
            adipiscing elit
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.bodyContainer_title}>2. Lorem ipsum dolor</Text>
          <Text style={styles.bodyContainer_paragraph}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, Lorem ipsum
            dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit
            amet, consectetur adipiscing elitLorem ipsum dolor sit amet,
            consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur
            adipiscing elit
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.bodyContainer_title}>3. Lorem ipsum dolor</Text>
          <Text style={styles.bodyContainer_paragraph}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, Lorem ipsum
            dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit
            amet, consectetur adipiscing elitLorem ipsum dolor sit amet,
            consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur
            adipiscing elit
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.bodyContainer_title}>4. Lorem ipsum dolor</Text>
          <Text style={styles.bodyContainer_paragraph}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, Lorem ipsum
            dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit
            amet, consectetur adipiscing elitLorem ipsum dolor sit amet,
            consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur
            adipiscing elit
          </Text>
        </View>
        <View style={styles.checkBoxContainer}>
          <Button.ButtonImage
            imgUrl={
              checkBoxClicked
                ? icons.activeTickSquare
                : icons.inactiveTickSquare
            }
            contentContainerStyle={styles.checkBox_image}
            height={20}
            width={20}
            tintColor={
              checkBoxClicked ? THEME_COLORS.primary : THEME_COLORS.tertiary
            }
            onPress={() => setCheckBoxClicked(!checkBoxClicked)}
          />
          <Text style={styles.checkBox_text}>
            I have read and agreed to the Terms and Conditions
          </Text>
        </View>
        <Button.PrimaryButton
          style={{
            backgroundColor: checkBoxClicked
              ? THEME_COLORS.primary
              : THEME_COLORS.tertiary,
          }}
          onPress={onPress}>
          CONTINUE
        </Button.PrimaryButton>
      </ScrollView>
    </SafeContainer>
  );
};

export default TermsAndConditionsScreen;

const styles = StyleSheet.create({
  headerContainer: {
    padding: 30,
    borderBottomWidth: 0.5,
    borderBottomColor: THEME_COLORS.tertiary,
    width: '100%',
  },
  headerContainer_title: {
    color: THEME_COLORS.dark,
    ...themeText.headingTwo,
  },
  headerContainer_subTitle: {
    color: THEME_COLORS.tertiary,
    ...themeText.bodyRegularSix,
    marginTop: 5,
  },
  bodyContainer: {
    flexGrow: 1,
    padding: 30,
  },
  bodyContainer_title: {
    color: THEME_COLORS.dark,
    ...themeText.bodyBoldFive,
    marginBottom: 10,
  },
  bodyContainer_paragraph: {
    color: THEME_COLORS.tertiary,
    ...themeText.bodyRegularSix,
  },
  section: {
    marginBottom: 30,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    paddingBottom: 30,
  },
  checkBox_image: {
    height: 20,
    width: 20,
    transform: [
      {
        translateY: 5,
      },
    ],
  },
  checkBox_text: {
    color: THEME_COLORS.dark,
    ...themeText.bodyRegularSix,
    paddingLeft: 20,
  },
});
