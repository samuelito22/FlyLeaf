import {Text, View, ScrollView, Pressable, Image, Modal} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  SafeContainer,
  Button,
  LoadingSpinner,
} from '../../../components';
import {styles} from './styles';
import {THEME_COLORS, ROUTES, TYPES, PALETTE} from '../../../constants';
import {RegisterActions} from '../../../redux';
import {NavigationProp} from '@react-navigation/native';
import {usePreventBackHandler, useDispatch} from '../../../utils/hooks';
import {icons} from '../../../assets';
import {useSelector} from 'react-redux';

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

  const [genderTemp, setGenderTemp] = useState<null | number>(null);
  const [extraGenderTemp, setExtraGenderTemp] = useState<
    null | number
  >(null);

  const [moreSpecificPress, setMoreSpecificPress] = useState(false);

  const dispatch = useDispatch();

  const {genders} = useSelector(
    (state: TYPES.AppState) => state.usersReducer,
  );

  const handlePress = async () => {
    if (valid) {
      setIsLoading(true);
      try {
        navigation.navigate(ROUTES.REGISTER_SEEKING_SCREEN);
        dispatch(RegisterActions.setPrimaryGenderId(genderTemp as number))
        extraGenderTemp && dispatch(RegisterActions.setSecondaryGenderId(extraGenderTemp))
        dispatch(RegisterActions.setProgressBarValue(42));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const ClickableIndicatorPrimaryButtonHandlePress = (
    id: number,
  ) => {
    if (id === activeId) {
      // check if the current id is the activeId
      setActiveId(null);
      setGenderTemp(null);
    } else {
      setActiveId(id); // set the clicked id as the activeId
      setGenderTemp(id);
    }
    setExtraGenderTemp(null);
  };

  useEffect(() => {
    setValid(genderTemp ? true : false);
  }, [genderTemp]);

  useEffect(
    () =>
      dispatch(
        RegisterActions.setIsRegisterCompleted({
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
        <Text style={styles.title}>What's your gender identity?</Text>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          overScrollMode={'never'}
          contentContainerStyle={{flexGrow: 1}}>
          {genders?.primaryGenders?.map((gender) => (
            <View key={gender.id} style={styles.clickableIndicatorPrimaryButton}>
              <Button.ClickableIndicatorPrimaryButton
                onPress={() =>
                  ClickableIndicatorPrimaryButtonHandlePress(
                    gender.id,
                  )
                }
                isActive={gender.id === activeId}>
                {gender.text}
              </Button.ClickableIndicatorPrimaryButton>
              {gender.id === activeId && (
                <Pressable
                  onPress={() => setMoreSpecificPress(true)}
                  style={
                    styles.clickableIndicatorPrimaryButton__extraContainer
                  }>
                  <Text
                    style={
                      styles.clickableIndicatorPrimaryButton__extraContainer_text
                    }>
                    {!extraGenderTemp ? 'More specific?' : genders.secondaryGenders.find(item => item.id === extraGenderTemp)?.text}
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
                {activeId !== null &&
                  genders?.secondaryGenders.filter(item => item.primaryGenderId === genderTemp).map((extraGender)  => (
                    <Pressable
                      style={styles.extraGenderModal_button}
                      key={extraGender.id}
                      onPress={() => {
                        if (extraGenderTemp === extraGender.id)
                          setExtraGenderTemp(null);
                        else
                          setExtraGenderTemp(
                            extraGender.id,
                          );
                        setMoreSpecificPress(false);
                      }}>
                      <View style={styles.extraGenderModal_content}>
                        <Image
                          style={[
                            styles.extraGenderModal_button__icon,
                            {
                              tintColor:
                                extraGenderTemp === extraGender.id
                                  ? THEME_COLORS.primary
                                  : PALETTE.LIGHT400,
                            },
                          ]}
                          source={icons.activeTickSquare}
                          resizeMode="contain"
                        />
                        <Text style={styles.extraGenderModal_button__text}>
                          {extraGender.text}
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
