import {
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
  SafeContainer,
} from '../../components';
import {ScrollView} from 'react-native-gesture-handler';
import {icons} from '../../assets';
import {
  BORDER_RADIUS,
  COMPONENT_COLORS,
  PALETTE,
  THEME_COLORS,
  TYPES,
  themeText,
} from '../../constants';
import {verticalScale} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import {useDispatch} from '../../utils/hooks';
import {EditProfileActions} from '../../redux';

const EditGenderScreen = () => {
  const state = useSelector(
    (state: TYPES.AppState) => state.editUserReducer,
  )
  const [activeId, setActiveId] = useState<number | null>(state.primaryGenderId);

  const [genderTemp, setGenderTemp] = useState<null | number>(state.primaryGenderId);
  const [extraGenderTemp, setExtraGenderTemp] = useState<
    undefined | number
  >(state.secondaryGenderId);

  const [moreSpecificPress, setMoreSpecificPress] = useState(false);

  const dispatch = useDispatch();

  const {genders} = useSelector(
    (state: TYPES.AppState) => state.usersReducer,
  );


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
    setExtraGenderTemp(undefined);
  };

  useEffect(() => {
    if(genderTemp) dispatch(EditProfileActions.setPrimaryGenderId(genderTemp))
    dispatch(EditProfileActions.setSecondaryGenderId(extraGenderTemp))
  }, [genderTemp, extraGenderTemp]);


  return (
    <SafeContainer>
                  <EditProfileHeader leftIconText="Save" />

      <View style={styles.container}>
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
                          setExtraGenderTemp(undefined);
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

export default EditGenderScreen


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
