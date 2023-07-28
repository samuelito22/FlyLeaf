import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { Button, KeyboardAvoidingViewWrapper, SafeContainer } from '../../../components'
import { icons, images } from '../../../assets'
import { BORDER_RADIUS, ROUTES, THEME_COLORS, TYPES, themeText } from '../../../constants'
import { NavigationProp } from "@react-navigation/native"

const WelcomeScreen = ({
    navigation,
  }: {
    navigation: NavigationProp<TYPES.RootStackParamList>;
  }) => {
    const handleExit = () => {
        navigation.navigate(ROUTES.LOGIN_NAVIGATOR)
    }

    const handleContinue = () => {
        navigation.navigate(ROUTES.REGISTER_FIRST_NAME_SCREEN)
    }

  return (
    <KeyboardAvoidingViewWrapper>
    <SafeContainer>
        <Button.ButtonImage imgUrl={icons.normalCross} width={20} height={20} contentContainerStyle={styles.crossIconContainer} onPress={handleExit}/>
        <View style={styles.container}>
            <Image source={images.logo} style={styles.image} resizeMode='contain'/>
            <Text style={styles.header}>Welcome to FlyLeaf</Text>
            <Text style={styles.paragraph}>Join our unique dating community emphasizing personality over appearance.</Text>
            <View style={styles.section}>
            <Text style={styles.section_header}>Your Story</Text>
            <Text style={styles.section_paragraph}>Build a profile reflecting your interests and values.</Text>
            </View>
            <View style={styles.section}>
            <Text style={styles.section_header}>Your Match</Text>
            <Text style={styles.section_paragraph}>Experience deep connections with our unique matching algorithm.</Text>
            </View>
            <View style={styles.section}>
            <Text style={styles.section_header}>Your Connections</Text>
            <Text style={styles.section_paragraph}>Forge lasting relationships in a community valuing respect and shared perspectives.</Text>
            </View>
            <Text style={styles.agreementText}>By clicking "CONTINUE", you acknowledge and agree that you have read and understood our terms and privacy policy, and consent to the collection and use of your information as described therein.</Text>
            <Button.PrimaryButton onPress={handleContinue}>CONTINUE</Button.PrimaryButton>
        </View>
    </SafeContainer>
    </KeyboardAvoidingViewWrapper>
  )
}

export default WelcomeScreen

const styles = StyleSheet.create({
    container: {
        maxWidth: 400,
        width: "100%",
        height:"100%",
        paddingHorizontal: 20,
        justifyContent:'center',
    },
    image: {
        width: 80,
        height: 80,
        tintColor: THEME_COLORS.primary
    },
    header:{
        ...themeText.headingTwo,
        color: THEME_COLORS.dark,
        marginVertical:10
    },
    paragraph: {
        ...themeText.bodyRegularSix,
        color:THEME_COLORS.tertiary,
        marginBottom: 18
    },
    section:{
        flexDirection:'column',
        marginBottom: 18
    },
    section_header:{
        ...themeText.bodyBoldFive,
        color: THEME_COLORS.dark,
    },
    section_paragraph: {
        ...themeText.bodyRegularSix,
        color:THEME_COLORS.tertiary,
    },
    agreementText: {
        ...themeText.bodyRegularSeven,
        color:THEME_COLORS.tertiary,
        marginVertical: 15
    },
    crossIconContainer: {
        width: 50,
        height: 50,
        borderRadius: BORDER_RADIUS.circle,
        position:'absolute',
        top: 30,
        right: 20
    }
    
})