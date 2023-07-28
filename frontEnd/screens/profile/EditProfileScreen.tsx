import { StyleSheet, Text, View, TextInput, Image, Modal, Pressable, BackHandler} from 'react-native'
import React, {useEffect, useMemo, useReducer, useState} from 'react'
import { Button, EditProfileHeader, KeyboardAvoidingViewWrapper, LoadingSpinner, Ripple, SafeContainer, questionsList } from '../../components'
import { BORDER_RADIUS, COMPONENT_COLORS, PALETTE, ROUTES, THEME_COLORS, TYPES, themeText } from '../../constants'
import { useSelector } from 'react-redux'
import { icons } from '../../assets'
import { ScrollView } from 'react-native-gesture-handler'
import { TouchableRipple } from 'react-native-paper'
import {useNavigation, NavigationProp} from '@react-navigation/native';
import { useDispatch } from '../../utils/hooks'
import { editSetBio, editSetCompany, editSetHeight, editSetJobTitle, editSetModalVisible } from '../../redux'

const styles = StyleSheet.create({
  section:{
    flexDirection: 'column',
    height: 'auto',
    maxWidth: 450,
    width: "100%",
    paddingVertical: 20
  },
  section_header:{
    ...themeText.bodyBoldFour,
    color:THEME_COLORS.dark,
    paddingHorizontal: 20,
    
  },
  section_textInput: {
    backgroundColor: "white",
    color:"black",
    borderWidth: 1,
    borderColor: PALETTE.GHOSTWHITE,
    borderRadius: BORDER_RADIUS.medium,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 10,
    ...themeText.bodyRegularSix,
  },
  section_subHeader:{
    ...themeText.bodyRegularSix,
    color: THEME_COLORS.dark,
    paddingHorizontal: 20,
  },
  section_height:{
    width: "50%",
    maxWidth: 200,
    marginTop: 10,
    paddingLeft: 20,
  },
  section_height_header:{
    ...themeText.bodyRegularFive,
    color: THEME_COLORS.dark,
    marginBottom: 5,
  },
  section_height_boxInput:{
    ...themeText.bodyRegularSix,
    color: THEME_COLORS.dark,
    borderWidth: 1,
    borderColor: PALETTE.GHOSTWHITE,
    paddingHorizontal: 10,
    borderRadius: BORDER_RADIUS.medium,

  },
  section_height_error:{
    ...themeText.bodyRegularSeven,
    color: PALETTE.RED500,
    marginTop: 5
  },
  section_withBorder: {
    borderColor: PALETTE.GHOSTWHITE,
    paddingVertical: 15,
    paddingHorizontal:20
  },
  section_withBorder_header: {
    ...themeText.bodyMediumSix,
    color: THEME_COLORS.dark,
    flex:1
  },
  section_withBorder_paragraph: {
    ...themeText.bodyRegularSix,
    color: THEME_COLORS.tertiary,
    paddingTop: 5,
  },
  section_withBorder_icon: {
    tintColor: THEME_COLORS.dark,
    width:20,
    height: 20,
    marginRight: 10,
    transform:[
      {translateY: -5}
    ]
  }
})

interface SectionProps {
    state: TYPES.InitialStateEditUserType;
    dispatch: React.Dispatch<TYPES.AppAction>;  
}

interface ModalSelectionProps extends SectionProps {
  data: any;
}

const EditProfileScreen = () => {
  const state = useSelector(
    (state: TYPES.AppState) => state.editUserReducer,
  );
  const dispatch = useDispatch()

  useEffect(() => {
    // Add event listener for hardware back button
    const backAction = () => {
      return false;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => {
      // Remove event listener when the component is unmounted
      backHandler.remove();
    };
  }, []);

  const handleBackPress = async () => {
    console.log("Updating database")
  }
  
  return (
   
      <KeyboardAvoidingViewWrapper>
         <SafeContainer>
      <EditProfileHeader onBackPress={handleBackPress} leftIconText='Edit Profile'/>
      <PicturesSection state={state} dispatch={dispatch}/>
      <BiographySection state={state} dispatch={dispatch}/>
      <HeightSection state={state} dispatch={dispatch}/>  
      <GenderSection state={state} dispatch={dispatch}/>  
      <SexualOrientationSection state={state} dispatch={dispatch}/>
      <LanguagesSection state={state} dispatch={dispatch}/>
      <AdditionalInformation state={state} dispatch={dispatch}/>   
      <JobSection state={state} dispatch={dispatch}/>   
      <CompanySection state={state} dispatch={dispatch}/> 
      </SafeContainer>
      </KeyboardAvoidingViewWrapper>
  )
}

const JobSection = ({state, dispatch} : SectionProps) =>{

  return (
    <View style={styles.section}>
        <Text style={styles.section_header}>Job title</Text>
        <TextInput
        style={styles.section_textInput}
        onChangeText={text => dispatch(editSetJobTitle(text))}
        value={state.jobTitle ?? ''}
        placeholder="Add job title"
        placeholderTextColor={THEME_COLORS.tertiary}
        />
      </View>
  )
}

const CompanySection = ({state, dispatch} : SectionProps) =>{

  return (
    <View style={styles.section}>
        <Text style={styles.section_header}>Company</Text>
        <TextInput
        style={styles.section_textInput}
        onChangeText={text => dispatch(editSetCompany(text))}
        value={state.company ?? ''}
        placeholder="Add company"
        placeholderTextColor={THEME_COLORS.tertiary}
        />
      </View>
  )
}

const GenderSection = ({state, dispatch}: SectionProps) => {
  const navigation = useNavigation<NavigationProp<TYPES.RootStackParamList>>();
  const onPress = () => {
    navigation.navigate(ROUTES.EDIT_GENDER_SCREEN)
  }

  return(
    <View style={styles.section}>
        <Text style={[styles.section_header, {marginBottom: 0}]}>Gender</Text>
          <TouchableRipple style={[styles.section_withBorder, {paddingVertical: 20}]} onPress={() => onPress()} rippleColor={PALETTE.LIGHT100}>
              <Text style={[styles.section_withBorder_paragraph, {paddingTop: 0}]}>{state.genderInformation?.specific ? state.genderInformation.specific : state.genderInformation?.general}</Text>
          </TouchableRipple>
      </View>
  )
}

const LanguagesSection = ({state, dispatch}: SectionProps) => {
  const navigation = useNavigation<NavigationProp<TYPES.RootStackParamList>>();
  const [loading, setLoading] = useState(false)
  const onPress = () => {
    setLoading(true)
    navigation.navigate(ROUTES.EDIT_LANGUAGE_SCREEN)
    setLoading(false)
  }

  return(
    <View style={styles.section}>
      {loading && <LoadingSpinner/>}
        <Text style={[styles.section_header, {marginBottom: 10}]}>Languages that I know</Text>
          <TouchableRipple style={[styles.section_withBorder, { paddingVertical: 20}]} onPress={() => onPress()} rippleColor={PALETTE.LIGHT100}>
              <Text style={[styles.section_withBorder_paragraph, {paddingTop: 0}]}>{(state.languages && state.languages.length != 0 )? state.languages.join(', ') : 'Add'}</Text>
          </TouchableRipple>
      </View>
  )
}

const SexualOrientationSection = ({state, dispatch}: SectionProps) => {
  const navigation = useNavigation<NavigationProp<TYPES.RootStackParamList>>();
  const onPress = () => {
    navigation.navigate(ROUTES.EDIT_SEXUAL_ORIENTATION_SCREEN)
  }

  return(
    <View style={styles.section}>
        <Text style={[styles.section_header, {marginBottom: 0}]}>Sexual Orientation</Text>
          <TouchableRipple style={[styles.section_withBorder, { paddingVertical: 20}]} onPress={() => onPress()} rippleColor={PALETTE.LIGHT100}>
          <Text 
  style={[
    styles.section_withBorder_paragraph, 
    {paddingTop: 0}
  ]}
>
  {(state.sexualOrientation && state.sexualOrientation.length !== 0) 
    ? state.sexualOrientation.join(', ')
    : 'Add'
  }
</Text>
          </TouchableRipple>
      </View>
  )
}

const AdditionalInformation = ({state, dispatch}: SectionProps) => {
  const [result, setResult] = useState<any>(null)
  const onPress = (text:string) => {
    let result = questionsList.find(item => item.question.includes(text))
    setResult(result)
    dispatch(editSetModalVisible(true))
  }

  return(
    <View style={styles.section}>
        <Text style={styles.section_header}>Additional information</Text>
        <Text style={[styles.section_subHeader, {paddingBottom: 10}]}>Make your adjustments here, and let others know more about youself</Text>
        {state.additionalInformation?.map((field, index) => (
          <TouchableRipple key={index} style={styles.section_withBorder} onPress={() => onPress(field.question)} rippleColor={PALETTE.LIGHT100}>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Image source={icons[field.icon]} style={styles.section_withBorder_icon} resizeMode='contain'/>
              <View><Text style={styles.section_withBorder_header}>{field.question}</Text><Text style={styles.section_withBorder_paragraph}>{field.answer}</Text></View>
            </View>
            
          </TouchableRipple>
        ))}
        {result && <ModalSelection state={state} dispatch={dispatch} data={result} />}
      </View>
  )
}

const HeightSection = ({state, dispatch}: SectionProps) => {
  const [feet, setFeet] = useState(state?.height?.feet ? state?.height?.feet.toString : '')
  const [inches, setInches] = useState(state?.height?.inches ? state?.height?.inches.toString : '')

  const [showFeetError , setShowFeetError] = useState(false)
  const [showInchesError , setShowInchesError] = useState(false)

  const onFeetBlur = () => {
    try{
      if(!feet) return
      const feetToInt = parseInt(feet)
      if(feetToInt < 3 || feetToInt > 7 || !feetToInt){
        setShowFeetError(true)
      }
    }catch{
      setShowFeetError(true)
    }
  }

  const onInchesBlur = () => {
    try{
      if(!inches) return
      const inchesToInt = parseInt(inches)
      if(inchesToInt < 3 || inchesToInt > 11 || !inchesToInt){
        setShowInchesError(true)
      }
    }catch{
      setShowInchesError(true)
    }
  }

  useEffect(() => setShowFeetError(false),[feet])
  useEffect(() => setShowInchesError(false),[inches])
  
  const handleSave = () => {
    if(!showFeetError && !showInchesError){
      dispatch(editSetHeight({feet: Number(feet), inches:Number(inches)}))
    }
  }

  return(
    <View style={styles.section}>
        <Text style={styles.section_header}>Height</Text>
        <View style={{flexDirection:'row'}}>
          <View style={styles.section_height}>
            <Text style={styles.section_height_header}>Feet</Text>
            <TextInput onBlur={onFeetBlur}  style={styles.section_height_boxInput} value={feet} onChangeText={text => setFeet(text)} placeholder='ft' placeholderTextColor={THEME_COLORS.tertiary}  keyboardType='number-pad'/>
            {showFeetError && <Text style={styles.section_height_error}>Please enter a number between 3 and 7</Text>}
          </View>
          <View style={styles.section_height}>
            <Text style={styles.section_height_header}>Inches</Text>
            <TextInput onBlur={onInchesBlur} style={styles.section_height_boxInput} value={inches} onChangeText={text => setInches(text)} placeholder='in' placeholderTextColor={THEME_COLORS.tertiary} keyboardType='number-pad'/>
            {showInchesError && <Text style={styles.section_height_error}>Please enter a number between 0 and 11</Text>}
          </View>
        </View>
      </View>
  )
}

const PicturesSection = ({state, dispatch} : SectionProps) =>{

  return (
    <View style={styles.section}>
        <Text style={styles.section_header}>Pictures</Text>
        <Text style={styles.section_subHeader}>Pick the best pictures of yourself</Text>
      </View>
  )
}

const BiographySection = ({state, dispatch} : SectionProps) =>{

  return (
    <View style={styles.section}>
        <Text style={styles.section_header}>About</Text>
        <Text style={styles.section_subHeader}>Write a coincised and interesting biography to impress your viewers</Text>
        <TextInput
        style={styles.section_textInput}
        onChangeText={text => dispatch(editSetBio(text))}
        value={state.bio ?? ''}
        placeholder="About me"
        placeholderTextColor={THEME_COLORS.tertiary}
        multiline={true}
        />
      </View>
  )
}

const ModalSelection = ({state, dispatch, data} : ModalSelectionProps) => {
  const field = useMemo(() => {
    return state.additionalInformation?.find(field => field.question.includes(data.question))
  }, [data.question, state.additionalInformation]);
  
  const [selectedAnswer, setSelectedAnswer] = useState<null | undefined |string>(null)

  const onPress = () => {
    const question = state.additionalInformation?.find(field => field.question.includes(data.question));
  
    if (question && selectedAnswer) {
      question.answer = selectedAnswer;
    }

    dispatch(editSetModalVisible(false))
  }

  useEffect(() => {
    if (state.modalVisible) {
      setSelectedAnswer(field?.answer); 
    } else {
      
      setSelectedAnswer(null); 
    }
  }, [field, state.modalVisible]);

  return(
    
  <Modal
    transparent={true}
    visible={state.modalVisible}
    onRequestClose={() => dispatch(editSetModalVisible(false))}>
    <Pressable
      style={{flex: 1}}
      onPress={() => dispatch(editSetModalVisible(false))}>
      <View style={modalSelectionStyles.flexEnd}>
        <Pressable
          style={modalSelectionStyles.container}
          onPress={e => e.stopPropagation()}>
            <View style={modalSelectionStyles.iconsContainer}>
            <View onStartShouldSetResponder={() => true} onResponderRelease={() => dispatch(editSetModalVisible(false))} style={modalSelectionStyles.iconContainer}><Image source={icons.normalCross} resizeMode='contain' style={modalSelectionStyles.crossIcon}/></View>
            <View onStartShouldSetResponder={() => true} onResponderRelease={() => onPress()} style={modalSelectionStyles.iconContainer}><Image source={icons.normalTick} resizeMode='contain' style={modalSelectionStyles.tickIcon}/></View>
            </View>
          <Text style={modalSelectionStyles.header}>
            {data.question}
          </Text>
          <ScrollView
            contentContainerStyle={modalSelectionStyles.ScrollViewContainer}>
              <View style={modalSelectionStyles.answersContainer}>
                {data.answers.map((answer:string, index:number) => (
                  <Button.interestsButton  onPress={() => setSelectedAnswer(answer)} active={selectedAnswer === answer} key={index} style={modalSelectionStyles.interestButtons}>{answer}</Button.interestsButton>
                ))}
              </View>
          </ScrollView>
          
        </Pressable>
      </View>
    </Pressable>
  </Modal>
  )
}

const modalSelectionStyles = StyleSheet.create({
  container: {
    maxWidth: 500,
    width: '100%',
    backgroundColor: 'white',
    maxHeight: 600,
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    paddingVertical: 20,
  },
  header: {
    ...themeText.bodyBoldTwo,
    color: THEME_COLORS.dark,
    textAlign:'center',
    marginHorizontal:20
  },
  flexEnd: {
    flex: 1,
    backgroundColor: COMPONENT_COLORS.modalBackground,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  ScrollViewContainer: {
    width: "100%",
    alignItems: 'center',
  },
  answersContainer:{
    flex:1,
    flexWrap:'wrap',
    flexDirection:'row',
    padding: 10,
    justifyContent:"center"
  },
  interestButtons:{
    margin: 5,
  },
  done: {
    ...themeText.bodyBoldFive,
    color: THEME_COLORS.dark
  },
  iconsContainer:{
    flexDirection: 'row',
    justifyContent:'space-between',
    paddingHorizontal:20,
    paddingVertical: 15,

  },
  iconContainer:{
    width: 30,
    height: 30,
    justifyContent:"center",
    alignItems: "center"
  },
  crossIcon:{
    width: "40%",
    height:"40%",
    tintColor: PALETTE.DARK
  },
  tickIcon:{
    width: "100%",
    height:"100%",
    tintColor: THEME_COLORS.primary
  }
})

export default EditProfileScreen
