import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { SafeContainer } from '../../components'
import { images } from '../../assets'
import { THEME_COLORS, themeText } from '../../constants'

const BlockedScreen = () => {
  return (
    <SafeContainer>
        <View style={styles.container}>
            <Image source={images.logo} style={styles.image} resizeMode='contain'/>
            <Text style={styles.header}>Age Restricted</Text>
            <Text style={styles.paragraph}>Ops... We have found out that you are under 18, and you will therefore not be granted access to FlyLeaf. Please come back once you are of age.</Text>
        </View>
    </SafeContainer>
  )
}

export default BlockedScreen

const styles = StyleSheet.create({
    container: {
        maxWidth: 400,
        width: "100%",
        height:"100%",
        paddingHorizontal: 20,
        justifyContent:'center',
        alignItems:'center'
    },
    image: {
        width: 80,
        height: 80,
        tintColor: THEME_COLORS.primary
    },
    header:{
        ...themeText.headingTwo,
        color: THEME_COLORS.dark,
        textAlign:'center',
        marginVertical:10
    },
    paragraph: {
        ...themeText.bodyRegularFive,
        color:THEME_COLORS.tertiary,
        textAlign:'center',
    }
})