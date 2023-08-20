import {Text, View, ScrollView, StyleSheet, BackHandler, Image} from 'react-native';
import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {SafeContainer, Button, questionsList, EditProfileHeader, LoadingSpinner} from '../../components';
import {THEME_COLORS, TYPES, COMPONENT_COLORS, BORDER_RADIUS, themeText, PALETTE} from '../../constants';
import { useDispatch} from '../../utils/hooks';
import { verticalScale } from 'react-native-size-matters';
import { useSelector } from 'react-redux';
import { TextInput } from 'react-native-gesture-handler';
import { icons } from '../../assets';
import { EditProfileActions} from "../../redux"
import { useFocusEffect } from '@react-navigation/native';

const EditLanguageScreen = () => {
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const languages = useSelector((state: TYPES.AppState) => state.editUserReducer.languages);
  const [languagesTemp, setLanguagesTemp] = useState<string[]>(languages ? languages : []);
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 200); // adjust the time as per your requirement
  }, []);


  const languagesField = useMemo(() => {
    return questionsList.find(field => field.id === 14) as {question: string, id: number, answers: {code:string, name:string}[]}
  }, [questionsList]);

  const interestButtonHandlePress = useCallback((name: string) => {
    if (languagesTemp.includes(name)) {
        setLanguagesTemp(
            languagesTemp.filter((pref: string) => pref !== name),
        );
    } else if (languagesTemp.length < 5) {
        setLanguagesTemp([...languagesTemp, name]);
    }

    languagesTemp.length != 0 ? dispatch(EditProfileActions.updateUserProfile("languages", Array.from(languagesTemp))) : dispatch(EditProfileActions.updateUserProfile("languages", undefined)) 
}, [languagesTemp]);


  return (
    <SafeContainer>
      <EditProfileHeader leftIconText='Save'/>
      {loading ? <LoadingSpinner modalBackground={{backgroundColor:"white"}}/> :
      <View style={styles.container}>
        <Text style={styles.title}>{languagesField?.question}</Text>
        <Text style={styles.paragraph}>
        You can select up to 5 languages for your profile.
        </Text>
        <View style={styles.searchBar}>
          <Image  source={icons.search} style={styles.searchBar_icon} resizeMode='contain'/>
          <TextInput style={styles.searchBar_text} placeholderTextColor={PALETTE.DARK} value={filter} onChangeText={(text) => setFilter(text)} placeholder='Search...'/>
        </View>
       <ScrollView contentContainerStyle={styles.interestsContainer}>
       {languagesField.answers.filter(language => language.name.toLowerCase().includes(filter.toLowerCase())).map((language, index) => (
  <Button.interestsButton 
    key={index} 
    active={languagesTemp.includes(language.name)} 
    onPress={() => interestButtonHandlePress(language.name)} 
    style={styles.interestButton}
  >
    {language.name}
  </Button.interestsButton>
))}

       </ScrollView>
        <Text style={styles.extraInformation}>
        Your preferences are key in shaping your matches, and they are displayed publicly to enhance community interaction
        </Text>
      </View>
}
    </SafeContainer>
  );
};

export default EditLanguageScreen



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
      interestsContainer:{
        flexWrap: 'wrap',
        flexDirection:'row',
        flexGrow: 1
      },
      interestButton: {
        marginRight: 10,
        marginBottom: 10
      },
      searchBar: {
        width: "100%",
        backgroundColor: PALETTE.LIGHT100,
        height: 50,
        borderRadius: BORDER_RADIUS.medium,
        marginBottom: 20,
        flexDirection:'row',
        alignItems:'center'
      },
      searchBar_icon:{
        tintColor: PALETTE.DARK,
        width:20,
        height: 20,
        marginHorizontal: 15
      
      },
      searchBar_text:{
        color: PALETTE.DARK,
        ...themeText.bodyRegularFive,
        flex:1
      }
  });
  