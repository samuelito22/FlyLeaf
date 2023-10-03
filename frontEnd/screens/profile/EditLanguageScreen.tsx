import {
  Text,
  View,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import React, {useEffect, useState, useCallback, useMemo,} from 'react';
import {
  SafeContainer,
  Button,
  EditProfileHeader,
  LoadingSpinner,
} from '../../components';
import {
  THEME_COLORS,
  TYPES,
  COMPONENT_COLORS,
  BORDER_RADIUS,
  themeText,
  PALETTE,
} from '../../constants';
import {useDispatch} from '../../utils/hooks';
import {verticalScale} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import {icons} from '../../assets';
import {EditProfileActions} from '../../redux';

type Language = {
  id: number;
  text: string;
};

interface LanguageItemProps {
  language: Language;
  active: boolean;
  onPress: () => void;
}

const LanguageItem: React.FC<LanguageItemProps> = React.memo(({ language, active, onPress }) => (
  <Button.interestsButton active={active} onPress={onPress} style={styles.interestButton}>
    {language.text}
  </Button.interestsButton>
));

const EditLanguageScreen: React.FC = () => {
  const [filter, setFilter] = useState<string>('');
  const languages = useSelector((state: TYPES.AppState) => state.usersReducer.languages) as Language[];
  const dispatch = useDispatch();

  const initialLanguages = useSelector((state: TYPES.AppState) => state.editUserReducer.languagesIds) || [];
  const [languagesTemp, setLanguagesTemp] = useState<Set<number>>(new Set(initialLanguages));

  const filteredLanguages = useMemo(() => 
    languages?.filter(language => language.text.toLowerCase().includes(filter.toLowerCase())),
  [languages, filter]
  );

  const interestButtonHandlePress = useCallback((id: number) => {
    setLanguagesTemp(prevSet => {
      const newSet = new Set(prevSet);
      if (newSet.has(id)) newSet.delete(id);
      else if (newSet.size < 5) newSet.add(id);
      dispatch(EditProfileActions.setLanguagesIds(Array.from(newSet)));
      return newSet;
    });
  }, [dispatch]);

  const renderItem = useCallback(({ item }: { item: Language }) => (
    <LanguageItem 
      language={item} 
      active={languagesTemp.has(item.id)} 
      onPress={() => interestButtonHandlePress(item.id)} 
    />
  ), [languagesTemp, interestButtonHandlePress]);

  return (
    <SafeContainer>
      <EditProfileHeader leftIconText="Save" />
        <View style={styles.container}>
          <Text style={styles.title}>What languages do you know?</Text>
          <Text style={styles.paragraph}>
            You can select up to 5 languages for your profile.
          </Text>
          <View style={styles.searchBar}>
            <Image
              source={icons.search}
              style={styles.searchBar_icon}
              resizeMode="contain"
            />
            <TextInput
              style={styles.searchBar_text}
              placeholderTextColor={PALETTE.DARK}
              value={filter}
              onChangeText={text => setFilter(text)}
              placeholder="Search..."
            />
          </View>
          <FlatList
    contentContainerStyle={styles.interestsContainer}
    data={filteredLanguages}  // use unique IDs if available
    renderItem={renderItem}
    initialNumToRender={40} // Render 10 items initially
    windowSize={21} // Render the visible content + 10 screens up and 10 screens down
    maxToRenderPerBatch={40} 
    numColumns={3}

    
  />
          <Text style={styles.extraInformation}>
            Your preferences are key in shaping your matches, and they are
            displayed publicly to enhance community interaction.
          </Text>
        </View>
    </SafeContainer>
  );
};

export default EditLanguageScreen;

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
  clickableIndicatorPrimaryButton: {
    marginBottom: 28,
    backgroundColor: COMPONENT_COLORS.primaryIndicatorBackground,
    borderRadius: BORDER_RADIUS.medium,
  },
  paragraph: {
    ...themeText.bodyRegularFive,
    color: THEME_COLORS.dark,
    marginBottom: verticalScale(17),
  },
  extraInformation: {
    ...themeText.bodyRegularSeven,
    color: THEME_COLORS.tertiary,
    textAlign: 'center',
    marginBottom: 15,
  },
  interestsContainer: {
   flexDirection: 'column',
    flexGrow: 1,
  },
  interestButton: {
    marginRight: 10,
    marginBottom: 10,
  },
  searchBar: {
    width: '100%',
    backgroundColor: PALETTE.LIGHT100,
    height: 50,
    borderRadius: BORDER_RADIUS.medium,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar_icon: {
    tintColor: PALETTE.DARK,
    width: 20,
    height: 20,
    marginHorizontal: 15,
  },
  searchBar_text: {
    color: PALETTE.DARK,
    ...themeText.bodyRegularFive,
    flex: 1,
  },
});
