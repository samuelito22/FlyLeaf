import {StyleSheet} from 'react-native';
import React from 'react';
import {ButtonImage} from './Button';
import {icons} from '../../assets';
import {THEME_COLORS} from '../../constants';

interface BackButtonProps {
  onPress: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({onPress}) => {
  return (
    <ButtonImage
      style={styles.backIcon}
      imgUrl={icons.arrowLeft}
      tintColor={THEME_COLORS.dark}
      onPress={onPress}
    />
  );
};

export default BackButton;

const styles = StyleSheet.create({
  backIcon: {
    position: 'absolute',
    top: 30,
    left: 20,
    width: 25,
    height: 25,
    zIndex: 9999,
  },
});
