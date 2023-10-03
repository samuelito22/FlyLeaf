import React, {useEffect, useState, useCallback} from 'react';
import {Text, View, ScrollView, Image, StyleSheet} from 'react-native';
import {
  SafeContainer,
  Button,
  Loading,
  EditProfileHeader,
} from '../../components';
import {
  THEME_COLORS,
  ROUTES,
  TYPES,
  themeText,
  PALETTE,
} from '../../constants';
import {NavigationProp} from '@react-navigation/native';
import {usePreventBackHandler, useDispatch, useErrorAlert} from '../../utils/hooks';
import {useSelector} from 'react-redux';
import { EditProfileActions } from '../../redux';

const styles = StyleSheet.create({
  interest_title: {
    ...themeText.bodyBoldFour,
    color: THEME_COLORS.dark,
    paddingVertical: 10,
  },
  interest_buttonsContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  interest_button: {
    marginVertical: 10,
    marginRight: 10,
  },
  interest_section: {
    borderBottomColor: PALETTE.GHOSTWHITE,
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingBottom: 10,
  },
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
  paragraph: {
    ...themeText.bodyRegularFive,
    color: THEME_COLORS.dark,
    marginBottom: 17,
  },
});

const MAX_INTERESTS = 5;


type Props = {
  navigation: NavigationProp<TYPES.RootStackParamList>;
};

type Interest = {
  id: number;
  categoryId: number;
  category: {id: number, text: string};
  text: string;
};

type GroupedInterests = {
  [key: string]: Interest[];
};

const EditInterestScreen: React.FC<Props> = ({navigation}) => {
  usePreventBackHandler();
  const dispatch = useDispatch();


  const {interests} = useSelector(
    (state: TYPES.AppState) => state.usersReducer,
  );

  const groupedInterests = interests?.reduce<GroupedInterests>(
    (accumulator, interest) => {
      accumulator[interest.category.text] = accumulator[interest.category.text] || [];
      accumulator[interest.category.text].push(interest);
      return accumulator;
    },
    {},
  );

  // Local states
  const [userChoices, setUserChoices] = useState<Set<number>>(new Set(useSelector((state: TYPES.AppState) => state.editUserReducer.interestsIds)));


  // Handlers
  
  const handleInterestPress = useCallback((interestId: number) => {
    setUserChoices(prevState => {
      const newUserChoices = new Set(prevState);
      if (newUserChoices.has(interestId)) {
        newUserChoices.delete(interestId);
      } else {
        // If maximum interests haven't been reached, add the new interest.
        if (newUserChoices.size < MAX_INTERESTS) {
          newUserChoices.add(interestId);
        }
      }
      return newUserChoices;
    });
  }, []);



  // Effects
  useEffect(() => {
    if(userChoices.size === MAX_INTERESTS){
        dispatch(EditProfileActions.setInterestsIds(Array.from(userChoices)))
    }
  }, [userChoices]);

  return (
    <SafeContainer>
              <EditProfileHeader leftIconText="Save" />

      <View style={styles.container}>
        <Text style={styles.title}>What are your interests?</Text>
        <Text style={styles.paragraph}>Please select 5 interests</Text>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          overScrollMode={'never'}
          contentContainerStyle={{flexGrow: 1}}>
          {groupedInterests &&
            Object.entries(groupedInterests as GroupedInterests).map(
              ([categoryTitle, interests]: [string, Interest[]], index) => (
                <View
                  key={categoryTitle + index}
                  style={styles.interest_section}>
                  <Text style={styles.interest_title}>{categoryTitle}</Text>
                  <View style={styles.interest_buttonsContainer}>
                    {interests.map((interest) => {
                      return (
                        <Button.interestsButton
                          active={userChoices.has(interest.id)}
                          key={interest.id}
                          style={styles.interest_button}
                          onPress={() => handleInterestPress(interest.id)}>
                          {interest.text}
                        </Button.interestsButton>
                      );
                    })}
                  </View>
                </View>
              ),
            )}
        </ScrollView>
      </View>
    </SafeContainer>
  );
};

export default EditInterestScreen;
