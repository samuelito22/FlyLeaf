import {Text, View, ScrollView, Pressable, Image, Modal} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeContainer, Button, LoadingSpinner} from '../../../components';
import {styles} from './styles';
import {COLORS, ROUTES, TYPES} from '../../../constants';
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
  const [moreSpecificPress, setMoreSpecificPress] = useState(false);

  const dispatch = useDispatch();

  const genderList = [
    {
      id: 1,
      name: 'Male',
      extra: [
        'Intersex man',
        'Trans man',
        'Transmasculine',
        'Man and Nonbinary',
        'Cis man',
      ].map((name, index) => ({id: index + 1, name})),
    },
    {
      id: 2,
      name: 'Female',
      extra: [
        'Intersex woman',
        'Trans woman',
        'Transfeminine',
        'Woman and Nonbinary',
        'Cis woman',
      ].map((name, index) => ({id: index + 1, name})),
    },
    {
      id: 3,
      name: 'Non-Binary',
      extra: [
        'Agender',
        'Bigender',
        'Genderfluid',
        'Genderqueer',
        'Gender nonconforming',
        'Gender questioning',
        'Gendervariant',
        'Intersex',
        'Neutrois',
        'Nonbinary man',
        'Nonbinary woman',
        'Pangender',
        'Polygender',
        'Transgender',
        'Two-spirit',
      ].map((name, index) => ({id: index + 1, name})),
    },
  ];

  const handlePress = async () => {
    if (valid) {
      setIsLoading(true);
      try {
        navigation.navigate(ROUTES.REGISTER_GENDER_PREFERENCE_SCREEN);
        dispatch(setGender(genderTemp));
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
  };

  useEffect(() => {
    setValid(genderTemp ? true : false);
  }, [genderTemp]);

  useEffect(
    () => dispatch(setIsRegisterCompleted({status: false, currentScreen: ROUTES.REGISTER_GENDER_SELECTION_SCREEN})),
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
          {genderList.map(gender => (
            <View
              key={gender.id}
              style={styles.clickableIndicatorPrimaryButton}>
              <Button.ClickableIndicatorPrimaryButton
                onPress={() =>
                  ClickableIndicatorPrimaryButtonHandlePress(
                    gender.id,
                    gender.name,
                  )
                }
                isActive={gender.id === activeId}>
                {gender.name}
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
                    {genderTemp === gender.name ? 'More specific?' : genderTemp}
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
              backgroundColor: valid ? COLORS.primary : COLORS.gray,
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
                  genderList
                    .find(gender => gender.id === activeId)
                    ?.extra.map(extraGender => (
                      <Pressable
                        style={styles.extraGenderModal_button}
                        key={extraGender.id}
                        onPress={() => {
                          setGenderTemp(extraGender.name);
                          setMoreSpecificPress(false);
                        }}>
                        <View style={styles.extraGenderModal_content}>
                          <Image
                            style={[
                              styles.extraGenderModal_button__icon,
                              {
                                tintColor:
                                  genderTemp === extraGender.name
                                    ? COLORS.primary
                                    : COLORS.lightGray,
                              },
                            ]}
                            source={icons.activeTickSquare}
                            resizeMode="contain"
                          />
                          <Text style={styles.extraGenderModal_button__text}>
                            {extraGender.name}
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
