import {Text, View, ScrollView, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeContainer, Button, EditProfileHeader} from '../../components';
import {THEME_COLORS, TYPES, themeText, COMPONENT_COLORS, BORDER_RADIUS} from '../../constants';
import {EditProfileActions} from '../../redux';
import { useDispatch} from '../../utils/hooks';
import {useSelector} from 'react-redux';

const EditSeekingScreen = () => {

  const [seekingTemp, setSeekingTemp] = useState<number[]>(useSelector((state: TYPES.AppState) => state.editUserReducer.seekingIds));

  const dispatch = useDispatch();

  const {genders} = useSelector(
    (state: TYPES.AppState) => state.usersReducer,
  );

  const ClickableIndicatorPrimaryButtonHandlePress = (id: number) => {
    if (seekingTemp.includes(id)) {
      setSeekingTemp(seekingTemp.filter((pref: number) => pref !== id));
    } else {
      setSeekingTemp([...seekingTemp, id]);
    }
  };

  useEffect(() => {
    if(seekingTemp.length > 0 ? true : false){
        dispatch(EditProfileActions.setSeekingIds(seekingTemp))
    }
  }, [seekingTemp]);


  return (
    <SafeContainer>
                <EditProfileHeader leftIconText="Save" />

      <View style={styles.container}>
        <Text style={styles.title}>Which gender are you seeking to meet?</Text>
        <Text style={styles.paragraph}>
          Multiple selections and future changes are allowed
        </Text>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          overScrollMode={'never'}
          contentContainerStyle={{flexGrow: 1}}>
          {genders?.primaryGenders?.map((gender, index) => (
            <View key={index} style={styles.clickableIndicatorPrimaryButton}>
              <Button.ClickableIndicatorPrimaryButton
                onPress={() =>
                  ClickableIndicatorPrimaryButtonHandlePress(gender.id)
                }
                isActive={seekingTemp.includes(gender.id)}>
                {gender.text}
              </Button.ClickableIndicatorPrimaryButton>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeContainer>
  );
};

export default EditSeekingScreen;

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
    clickableIndicatorPrimaryButton: {
        marginBottom: 28,
        backgroundColor: COMPONENT_COLORS.primaryIndicatorBackground,
        borderRadius: BORDER_RADIUS.medium,
      },
      paragraph: {
        ...themeText.bodyRegularFive,
        color: THEME_COLORS.dark,
        marginBottom: 17,
      },
})