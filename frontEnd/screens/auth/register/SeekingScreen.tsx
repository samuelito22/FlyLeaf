import {Text, View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeContainer, Button, LoadingSpinner} from '../../../components';
import {styles} from './styles';
import {THEME_COLORS, ROUTES, TYPES} from '../../../constants';
import {RegisterActions} from '../../../redux';
import {NavigationProp} from '@react-navigation/native';
import {usePreventBackHandler, useDispatch} from '../../../utils/hooks';
import {useSelector} from 'react-redux';
import {ObjectId} from 'mongodb';

const SeekingScreen = ({
  navigation,
}: {
  navigation: NavigationProp<TYPES.RootStackParamList>;
}) => {
  // To prevent user from going back
  usePreventBackHandler();

  const [isLoading, setIsLoading] = useState(false);

  const [valid, setValid] = useState(false);

  const [seekingTemp, setSeekingTemp] = useState<ObjectId[]>([]);

  const dispatch = useDispatch();

  const {gendersList} = useSelector(
    (state: TYPES.AppState) => state.usersReducer,
  );

  const handlePress = async () => {
    if (valid) {
      setIsLoading(true);
      try {
        navigation.navigate(ROUTES.REGISTER_RELATIONSHIP_GOAL_SCREEN);
        dispatch(RegisterActions.setProgressBarValue(56));
        dispatch(RegisterActions.setSeeking(seekingTemp));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const ClickableIndicatorPrimaryButtonHandlePress = (_id: ObjectId) => {
    if (seekingTemp.includes(_id)) {
      setSeekingTemp(seekingTemp.filter((pref: ObjectId) => pref !== _id));
    } else {
      setSeekingTemp([...seekingTemp, _id]);
    }
  };

  useEffect(() => {
    setValid(seekingTemp.length > 0 ? true : false);
  }, [seekingTemp]);

  useEffect(
    () =>
      dispatch(
        RegisterActions.setIsRegisterCompleted({
          status: false,
          currentScreen: ROUTES.REGISTER_SEEKING_SCREEN,
        }),
      ),
    [],
  );

  return (
    <SafeContainer>
      <View style={styles.container}>
        {isLoading && <LoadingSpinner />}
        <Text style={styles.requirement}>Required</Text>
        <Text style={styles.title}>Which gender are you seeking to meet?</Text>
        <Text style={styles.paragraph}>
          Multiple selections and future changes are allowed
        </Text>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          overScrollMode={'never'}
          contentContainerStyle={{flexGrow: 1}}>
          {gendersList?.map((gender, index) => (
            <View key={index} style={styles.clickableIndicatorPrimaryButton}>
              <Button.ClickableIndicatorPrimaryButton
                onPress={() =>
                  ClickableIndicatorPrimaryButtonHandlePress(gender._id)
                }
                isActive={seekingTemp.includes(gender._id)}>
                {gender.primary}
              </Button.ClickableIndicatorPrimaryButton>
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
          Your preferences are used to tailor your matches. Your selections
          aren't shared publicly.
        </Text>
      </View>
    </SafeContainer>
  );
};

export default SeekingScreen;
