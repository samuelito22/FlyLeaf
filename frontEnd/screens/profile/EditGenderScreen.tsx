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
  const genderFromRedux = useSelector((state: TYPES.AppState) => state.editUserReducer.userProfile?.gender)
  const {gendersList} = useSelector(
    (state: TYPES.AppState) => state.usersReducer,
  );

  const matchingGender = gendersList?.find(item => item.primary === genderFromRedux?.primary);
  const [activeId, setActiveId] = useState<string | null>(matchingGender?._id || null);


// Now, use the matchingGender to initialize your state.
const [genderTemp, setGenderTemp] = useState<{ _id: string; text: string; } | undefined>(
  matchingGender ? { _id: matchingGender._id, text: matchingGender.primary } : undefined
);
const [extraGenderTemp, setExtraGenderTemp] = useState<
    undefined | {_id: string; text: string}
  >(matchingGender?.secondary.find(item => item.text == genderFromRedux?.secondary));

  const [moreSpecificPress, setMoreSpecificPress] = useState(false);

  const dispatch = useDispatch();

  const ClickableIndicatorPrimaryButtonHandlePress = (
    _id: string,
    text: string,
  ) => {
    if (_id === activeId) {
      // check if the current id is the activeId
      setActiveId(null);
      setGenderTemp(undefined);
    } else {
      setActiveId(_id); // set the clicked id as the activeId
      setGenderTemp({_id, text});
    }
    setExtraGenderTemp(undefined);
  };

  useEffect(() => {
    if(genderTemp ? true : false){
      dispatch(EditProfileActions.updateUserProfile('gender', {primary: genderTemp?.text,
        secondary: extraGenderTemp?.text,}))
        dispatch(EditProfileActions.updateFormat('gender', {primary: genderTemp?._id,
          secondary: extraGenderTemp?._id,}))
    }
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
   
        <Text style={styles.extraInformation}>
          Your gender identity will be used to personalize your experience on
          our platform.
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
