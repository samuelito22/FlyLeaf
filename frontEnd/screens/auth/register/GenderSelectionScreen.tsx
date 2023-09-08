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
import {ObjectId} from 'mongodb';

const GenderSelectionScreen = ({
  navigation,
}: {
  navigation: NavigationProp<TYPES.RootStackParamList>;
}) => {
  // To prevent user from going back
  usePreventBackHandler();

  const [isLoading, setIsLoading] = useState(false);

  const [valid, setValid] = useState(false);
  const [activeId, setActiveId] = useState<ObjectId | null>(null);

  const [genderTemp, setGenderTemp] = useState<null | {
    _id: ObjectId;
    text: string;
  }>();
  const [extraGenderTemp, setExtraGenderTemp] = useState<
    undefined | {_id: ObjectId; text: string}
  >();

  const [moreSpecificPress, setMoreSpecificPress] = useState(false);

  const dispatch = useDispatch();

  const {gendersList} = useSelector(
    (state: TYPES.AppState) => state.usersReducer,
  );

  const handlePress = async () => {
    if (valid) {
      setIsLoading(true);
      try {
        navigation.navigate(ROUTES.REGISTER_SEEKING_SCREEN);
        dispatch(
          RegisterActions.setGender({
            primary: genderTemp?._id as ObjectId,
            secondary: extraGenderTemp?._id,
          }),
        );
        dispatch(RegisterActions.setProgressBarValue(42));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const ClickableIndicatorPrimaryButtonHandlePress = (
    _id: ObjectId,
    text: string,
  ) => {
    if (_id === activeId) {
      // check if the current id is the activeId
      setActiveId(null);
      setGenderTemp(null);
    } else {
      setActiveId(_id); // set the clicked id as the activeId
      setGenderTemp({_id, text});
    }
    setExtraGenderTemp(undefined);
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
          {gendersList?.map((genderField, index) => (
            <View key={index} style={styles.clickableIndicatorPrimaryButton}>
              <Button.ClickableIndicatorPrimaryButton
                onPress={() =>
                  ClickableIndicatorPrimaryButtonHandlePress(
                    genderField._id,
                    genderField.primary,
                  )
                }
                isActive={genderField._id === activeId}>
                {genderField.primary}
              </Button.ClickableIndicatorPrimaryButton>
              {genderField._id === activeId && (
                <Pressable
                  onPress={() => setMoreSpecificPress(true)}
                  style={
                    styles.clickableIndicatorPrimaryButton__extraContainer
                  }>
                  <Text
                    style={
                      styles.clickableIndicatorPrimaryButton__extraContainer_text
                    }>
                    {!extraGenderTemp ? 'More specific?' : extraGenderTemp.text}
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
                  gendersList &&
                  gendersList[
                    gendersList.findIndex(item => item._id === activeId)
                  ].secondary.map((extraGender, index) => (
                    <Pressable
                      style={styles.extraGenderModal_button}
                      key={index}
                      onPress={() => {
                        if (extraGenderTemp?._id === extraGender._id)
                          setExtraGenderTemp(undefined);
                        else
                          setExtraGenderTemp({
                            text: extraGender.text,
                            _id: extraGender._id,
                          });
                        setMoreSpecificPress(false);
                      }}>
                      <View style={styles.extraGenderModal_content}>
                        <Image
                          style={[
                            styles.extraGenderModal_button__icon,
                            {
                              tintColor:
                                extraGenderTemp?._id === extraGender._id
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
