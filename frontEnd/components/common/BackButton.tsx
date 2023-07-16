import { StyleSheet } from 'react-native'
import React from 'react'
import { ButtonImage } from './Button'
import { icons } from '../../assets'
import { COLORS } from '../../constants'

interface BackButtonProps {
  onPress: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({onPress}) => {
  return (
    <ButtonImage
          style={styles.backIcon}
          imgUrl={icons.arrowLeft}
          tintColor={COLORS.dark}
          onPress={onPress}
    />
  )
}

export default BackButton

const styles = StyleSheet.create({
    backIcon: {
        position: 'absolute',
        top: 30,
        left: 20,
        width: 30,
        height: 30,
    },
})
