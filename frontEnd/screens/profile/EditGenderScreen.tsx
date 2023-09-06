import {
  BackHandler,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Button,
  EditProfileHeader,
  LoadingSpinner,
  SafeContainer,
  questionsList,
} from '../../components';
import {ScrollView} from 'react-native-gesture-handler';
import {icons} from '../../assets';
import {
  BORDER_RADIUS,
  COMPONENT_COLORS,
  PALETTE,
  ROUTES,
  THEME_COLORS,
  TYPES,
  themeText,
} from '../../constants';
import {verticalScale} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import {useDispatch} from '../../utils/hooks';
import {EditProfileActions} from '../../redux';

const EditGenderScreen = () => {
  const dispatch = useDispatch();

  type Answer = {
    id: number;
    gender: string;
    extra: string[];
  };

  type Field = {
    id: number;
    question: string;
    answers: Answer[];
  };

  const state = useSelector((state: TYPES.AppState) => state.editUserReducer);
  const genderInformation = state.gender;

  const foundFieldId = (questionsList as Field[])
    .find(field => field.id === 12)
    ?.answers.find(
      (answer: Answer) => answer.gender === genderInformation?.general,
    )?.id;

  const [activeId, setActiveId] = useState<number | null>(
    foundFieldId ? foundFieldId : null,
  );

  const [genderTemp, setGenderTemp] = useState(genderInformation?.general);
  const [extraGenderTemp, setExtraGenderTemp] = useState<undefined | string>(
    genderInformation?.specific,
  );

  const [moreSpecificPress, setMoreSpecificPress] = useState(false);

  interface IGender {
    gender: string;
    extra: string[];
    id: number;
  }

  const genderListField = questionsList.find(
    question => question.id === 12,
  ) as {id: number; question: string; answers: IGender[]};

  const ClickableIndicatorPrimaryButtonHandlePress = (
    id: number,
    text: string,
  ) => {
    if (id === activeId) {
      // check if the current id is the activeId
      setActiveId(null);
      setGenderTemp('');
    } else {
      setActiveId(id); // set the clicked id as the activeId
      setGenderTemp(text);
    }
    setExtraGenderTemp(undefined);
  };

  useEffect(() => {
    genderTemp &&
      dispatch(
        EditProfileActions.updateUserProfile('gender', {
          general: genderTemp,
          specific: extraGenderTemp,
        }),
      );
  }, [genderTemp]);

  return (
    <SafeContainer>
      <EditProfileHeader leftIconText="Save" />
      <View style={styles.container}>
        <Text style={styles.title}>{genderListField?.question}</Text>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          overScrollMode={'never'}
          contentContainerStyle={{flexGrow: 1}}>
          {genderListField?.answers.map(genderField => (
            <View
              key={genderField.id}
              style={styles.clickableIndicatorPrimaryButton}>
              <Button.ClickableIndicatorPrimaryButton
                onPress={() =>
                  ClickableIndicatorPrimaryButtonHandlePress(
                    genderField.id,
                    genderField.gender,
                  )
                }
                isActive={genderField.id === activeId}>
                {genderField.gender}
              </Button.ClickableIndicatorPrimaryButton>
              {genderField.id === activeId && (
                <Pressable
                  onPress={() => setMoreSpecificPress(true)}
                  style={
                    styles.clickableIndicatorPrimaryButton__extraContainer
                  }>
                  <Text
                    style={
                      styles.clickableIndicatorPrimaryButton__extraContainer_text
                    }>
                    {!extraGenderTemp ? 'More specific?' : extraGenderTemp}
                  </Text>
                  <Image
                    source={icons.arrowDown}
                    style={
                      styles.clickableIndicatorPrimaryButton__extraContainer_image
                    }
                  />
                </Pressable>
              )}
            </View>
          ))}
        </ScrollView>
        <Text style={styles.extraInformation}>
          Your preferences are key in shaping your matches, and they are
          displayed publicly to enhance community interaction
        </Text>
      </View>
      <Modal
        transparent={true}
        visible={moreSpecificPress}
        onRequestClose={() => setMoreSpecificPress(false)}>
        <Pressable
          style={{flex: 1}}
          onPress={() => setMoreSpecificPress(false)}>
          <View style={styles.extraGenderModal_flexEnd}>
            <Pressable
              style={styles.extraGenderModal_container}
              onPress={e => e.stopPropagation()}>
              <Image
                source={icons.extra}
                style={styles.extraIcon}
                resizeMode="contain"
              />
              <Text style={styles.extraGenderModal_header}>
                Select what best describes you
              </Text>
              <ScrollView
                contentContainerStyle={styles.extraScrollViewContainer}>
                {activeId &&
                  genderListField.answers
                    .find(gender => gender.id === activeId)
                    ?.extra.map((extraGender, index) => (
                      <Pressable
                        style={styles.extraGenderModal_button}
                        key={index}
                        onPress={() => {
                          if (extraGenderTemp === extraGender)
                            setExtraGenderTemp(undefined);
                          else setExtraGenderTemp(extraGender);
                          setMoreSpecificPress(false);
                        }}>
                        <View style={styles.extraGenderModal_content}>
                          <Image
                            style={[
                              styles.extraGenderModal_button__icon,
                              {
                                tintColor:
                                  extraGenderTemp === extraGender
                                    ? THEME_COLORS.primary
                                    : PALETTE.LIGHT400,
                              },
                            ]}
                            source={icons.activeTickSquare}
                            resizeMode="contain"
                          />
                          <Text style={styles.extraGenderModal_button__text}>
                            {extraGender}
                          </Text>
                        </View>
                      </Pressable>
                    ))}
              </ScrollView>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </SafeContainer>
  );
};

export default EditGenderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: verticalScale(20),
    maxWidth: 325,
    width: '100%',
  },
  title: {
    ...themeText.headingTwo,
    color: THEME_COLORS.dark,
    marginBottom: verticalScale(12),
  },
  extraInformation: {
    ...themeText.bodyRegularSeven,
    color: THEME_COLORS.tertiary,
    textAlign: 'center',
    marginBottom: 15,
  },
  clickableIndicatorPrimaryButton: {
    marginBottom: 28,
    backgroundColor: COMPONENT_COLORS.primaryIndicatorBackground,
    borderRadius: BORDER_RADIUS.medium,
  },
  clickableIndicatorPrimaryButton__extraContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
  },
  clickableIndicatorPrimaryButton__extraContainer_text: {
    ...themeText.bodyRegularSix,
    color: PALETTE.INDIGO300,
  },
  clickableIndicatorPrimaryButton__extraContainer_image: {
    width: 20,
    height: 20,
    tintColor: PALETTE.INDIGO300,
  },
  extraGenderModal_flexEnd: {
    flex: 1,
    backgroundColor: COMPONENT_COLORS.modalBackground,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  extraGenderModal_container: {
    maxWidth: 500,
    width: '100%',
    backgroundColor: 'white',
    maxHeight: 600,
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    alignItems: 'center',
  },
  extraGenderModal_content: {
    flexDirection: 'row',
  },
  extraGenderModal_button: {
    height: 60,
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
  },
  extraGenderModal_button__text: {
    ...themeText.bodyRegularFour,
    color: THEME_COLORS.dark,
  },
  extraGenderModal_header: {
    ...themeText.bodyBoldTwo,
    color: THEME_COLORS.dark,
  },
  extraIcon: {
    height: 100,
    marginVertical: 20,
  },
  extraGenderModal_button__icon: {
    height: 20,
    width: 20,
    marginRight: 20,
    transform: [
      {
        translateY: 5,
      },
    ],
  },
  extraScrollViewContainer: {
    width: 500,
    alignItems: 'center',
  },
});
