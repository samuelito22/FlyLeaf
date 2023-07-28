import {Text, View, ScrollView, Pressable, Image, Modal} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeContainer, Button, LoadingSpinner, questionsList} from '../../../components';
import {styles} from './styles';
import {THEME_COLORS, ROUTES, TYPES, PALETTE} from '../../../constants';
import {
  setGender,
  setIsRegisterCompleted,
  setProgressBarValue,
} from '../../../redux';
import {NavigationProp} from '@react-navigation/native';
import {usePreventBackHandler, useDispatch} from '../../../utils/hooks';
import {icons} from '../../../assets';

const GenderSelectionScreen = ({
  navigation,
}: {
  navigation: NavigationProp<TYPES.RootStackParamList>;
}) => {
  // To prevent user from going back
  usePreventBackHandler();

  const [isLoading, setIsLoading] = useState(false);

  const [valid, setValid] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);

  const [genderTemp, setGenderTemp] = useState('');
  const [extraGenderTemp, setExtraGenderTemp] = useState<null | string>(null);

  const [moreSpecificPress, setMoreSpecificPress] = useState(false);

  const dispatch = useDispatch();

  interface IGender {
    gender: string;
    extra: string[];
    id: number
  }

  const genderListField = questionsList.find(question => question.id === 12) as { id: number,question: string, answers: IGender[] };

  const handlePress = async () => {
    if (valid) {
      setIsLoading(true);
      try {
        navigation.navigate(ROUTES.REGISTER_GENDER_PREFERENCE_SCREEN);
        dispatch(setGender({general: genderTemp, specific: extraGenderTemp}));
        dispatch(setProgressBarValue(42));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

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
    setExtraGenderTemp(null);
  };

  useEffect(() => {
    setValid(genderTemp ? true : false);
  }, [genderTemp]);

  useEffect(
    () =>
      dispatch(
        setIsRegisterCompleted({
          status: false,
          currentScreen: ROUTES.REGISTER_GENDER_SELECTION_SCREEN,
        }),
      ),
    [],
  );

  return (
    <SafeContainer>
      <View style={styles.container}>
        {isLoading && <LoadingSpinner />}
        <Text style={styles.requirement}>Required</Text>
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
                    {extraGenderTemp === null
                      ? 'More specific?'
                      : extraGenderTemp}
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
        <View style={styles.alignNextButtonContainer}>
          <Button.PrimaryButton
            onPress={handlePress}
            style={{
              ...styles.nextButtonContainer,
              backgroundColor: valid
                ? THEME_COLORS.primary
                : THEME_COLORS.tertiary,
            }}>
            CONTINUE
          </Button.PrimaryButton>
        </View>
        <Text style={styles.extraInformation}>
          Your gender identity will be used to personalize your experience on
          our platform. You can always change this in your profile settings
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
                  genderListField.answers.find(gender => gender.id === activeId)
                    ?.extra.map((extraGender, index) => (
                      <Pressable
                        style={styles.extraGenderModal_button}
                        key={index}
                        onPress={() => {
                          if (extraGenderTemp === extraGender)
                            setExtraGenderTemp(null);
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

export default GenderSelectionScreen;
