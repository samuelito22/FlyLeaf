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
      contentContainerStyle={styles.backIcon}
      width={25}
      height={25}
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
    width: 60,
    height: 60,
    borderRadius: 120,
    top: 10,
    left: 10,
    zIndex: 9999,
  },
});
