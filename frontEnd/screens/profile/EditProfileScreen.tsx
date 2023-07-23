import { StyleSheet, Text, View, TextInput, Image, Modal, Pressable} from 'react-native'
import React, {useEffect, useReducer, useState} from 'react'
import { Button, EditProfileHeader, KeyboardAvoidingViewWrapper, Ripple, SafeContainer, questionsList } from '../../components'
import { BORDER_RADIUS, COMPONENT_COLORS, PALETTE, THEME_COLORS, TYPES, themeText } from '../../constants'
import { useSelector } from 'react-redux'
import { icons } from '../../assets'
import { ScrollView } from 'react-native-gesture-handler'
import { TouchableRipple } from 'react-native-paper'

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
    ...themeText.bodyRegularSix,
  },
  section_subHeader:{
    ...themeText.bodyRegularSix,
    color: THEME_COLORS.dark,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  section_height:{
    width: "50%",
    maxWidth: 200,
    marginTop: 10,
    paddingRight:10,
    paddingHorizontal: 20,
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
    paddingHorizontal: 10
  },
  section_height_error:{
    ...themeText.bodyRegularSeven,
    color: PALETTE.RED500,
    marginTop: 5
  },
  section_additionalInformation: {
    borderTopWidth: 1,
    borderColor: PALETTE.GHOSTWHITE,
    paddingTop: 15,
    paddingBottom:10,
    paddingHorizontal:20
  },
  section_additionalInformation_header: {
    ...themeText.bodyMediumSix,
    color: THEME_COLORS.dark,
    flex:1
  },
  section_additionalInformation_paragraph: {
    ...themeText.bodyRegularSix,
    color: THEME_COLORS.tertiary,
    paddingTop: 5,
  },
  section_additionalInformation_icon: {
    tintColor: THEME_COLORS.dark,
    width:20,
    height: 20,
    marginRight: 10,
    transform:[
      {translateY: -5}
    ]
  }
})

interface State {
  bio: string;
  height: {feet: number, inches: number} | null;
  save: boolean;
  additionalInformation: {question: string, answer: string, icon: string}[];
  modalVisible: boolean
}

interface SectionProps {
  state: State;
  dispatch: React.Dispatch<Action>;
}

interface ModalSelectionProps extends SectionProps {
  data: any;
}

type Action =  { type: 'SET_BIO'; payload: string } 
  | { type: 'SET_HEIGHT'; payload: {feet: number, inches: number} | null } 
  | { type: 'SET_ADDITIONAL_INFORMATION'; payload: {question: string, answer: string, icon: string}[]}
  | {type: 'SET_SAVE'; payload: boolean}
  | {type: 'SET_MODAL_VISIBLE'; payload: boolean}
  ;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_BIO':
      return { ...state, bio: action.payload };
    case 'SET_HEIGHT':
        return { ...state, height: action.payload };
    case 'SET_SAVE':
        return { ...state, save: action.payload };
    case 'SET_ADDITIONAL_INFORMATION':
      return {...state, additionalInformation: action.payload}
    case 'SET_MODAL_VISIBLE':
      return {...state, modalVisible:action.payload}
    default:
      throw new Error();
  }
};


const EditProfileScreen = () => {
  
const {userProfile} = useSelector(
  (state: TYPES.AppState) => state.userReducer,
);

const initialState = { 
  bio: userProfile?.profile.bio, 
  height: userProfile?.profile.height, 
  additionalInformation: userProfile?.interests.additionalInformation,
  save: false, 
  modalVisible: false
};

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
   
      <KeyboardAvoidingViewWrapper>
         <SafeContainer>
      <EditProfileHeader/>
      <BiographySection state={state} dispatch={dispatch}/>
      <HeightSection state={state} dispatch={dispatch}/>
      <AdditionalInformation state={state} dispatch={dispatch}/>   
      </SafeContainer>
      </KeyboardAvoidingViewWrapper>
  )
}

const AdditionalInformation = ({state, dispatch}: SectionProps) => {
  const [result, setResult] = useState<any>(null)
  const onPress = (text:string) => {
    let result = questionsList.find(item => item.question.includes(text))
    setResult(result)
    dispatch({type: 'SET_MODAL_VISIBLE', payload: true})
  }

  return(
    <View style={styles.section}>
        <Text style={styles.section_header}>Additional information</Text>
        <Text style={styles.section_subHeader}>Make your adjustments here, and let others know more about youself</Text>
        {state.additionalInformation.map((field, index) => (
          <TouchableRipple key={index} style={styles.section_additionalInformation} onPress={() => onPress(field.question)} rippleColor={PALETTE.GRAY400}>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Image source={icons[field.icon]} style={styles.section_additionalInformation_icon} resizeMode='contain'/>
              <View><Text style={styles.section_additionalInformation_header}>{field.question}</Text><Text style={styles.section_additionalInformation_paragraph}>{field.answer}</Text></View>
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
  
  useEffect(() =>{ if(state.save) handleSave()}, [state.save])

  const handleSave = () => {
    if(!showFeetError && !showInchesError){
      dispatch({ type: 'SET_HEIGHT', payload: {feet: Number(feet), inches:Number(inches)} })
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
const BiographySection = ({state, dispatch} : SectionProps) =>{

  return (
    <View style={styles.section}>
        <Text style={styles.section_header}>About</Text>
        <Text style={styles.section_subHeader}>Write a coincised and interesting biography to impress your viewers</Text>
        <TextInput
        style={styles.section_textInput}
        onChangeText={text => dispatch({ type: 'SET_BIO', payload: text })}
        value={state.bio}
        placeholder="About me"
        placeholderTextColor={THEME_COLORS.tertiary}
        multiline={true}
        />
      </View>
  )
}

const ModalSelection = ({state, dispatch, data} : ModalSelectionProps) => {
  const field = state.additionalInformation.find(field => field.question.includes(data.question))
  const [selectedAnswer, setSelectedAnswer] = useState<null | undefined |string>(field?.answer)

  const onPress = () => {
    const question = state.additionalInformation.find(field => field.question.includes(data.question));
  
    if (question && selectedAnswer) {
      question.answer = selectedAnswer;
    }

    dispatch({type:'SET_MODAL_VISIBLE',payload:false})
  }

  return(
    
  <Modal
    transparent={true}
    visible={state.modalVisible}
    onRequestClose={() => dispatch({type: 'SET_MODAL_VISIBLE', payload: false})}>
    <Pressable
      style={{flex: 1}}
      onPress={() => dispatch({type: 'SET_MODAL_VISIBLE', payload: false})}>
      <View style={modalSelectionStyles.flexEnd}>
        <Pressable
          style={modalSelectionStyles.container}
          onPress={e => e.stopPropagation()}>
            <View style={modalSelectionStyles.iconsContainer}>
            <View onStartShouldSetResponder={() => true} onResponderRelease={() => dispatch({type: 'SET_MODAL_VISIBLE', payload: false})} style={modalSelectionStyles.iconContainer}><Image source={icons.normalCross} resizeMode='contain' style={[modalSelectionStyles.icon, {tintColor: PALETTE.DARK}]}/></View>
            <View onStartShouldSetResponder={() => true} onResponderRelease={() => onPress()} style={modalSelectionStyles.iconContainer}><Image source={icons.normalTick} resizeMode='contain' style={[modalSelectionStyles.icon , {tintColor: PALETTE.GREEN300}]}/></View>
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
  },
  icon:{
    width: "100%",
    height:"100%"
  }
})

export default EditProfileScreen
