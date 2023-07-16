import React from 'react';
import {TouchableHighlight, Text, Image, View} from 'react-native';
import {styles} from './styles';
import {COLORS, TYPES, themeText} from '../../../constants';
import {images} from '../../../assets';

export const PrimaryButton = ({
  onPress,
  style,
  children,
}: TYPES.PrimaryButtonProps) => {
  return (
    <TouchableHighlight
      style={[styles.primaryButton, {...style}]}
      onPress={onPress}
      underlayColor="none">
      <Text style={styles.primaryButtonTextLight}>{children}</Text>
    </TouchableHighlight>
  );
};

export const ButtonImage = ({
  imgUrl,
  onPress,
  tintColor,
  style,
}: TYPES.ButtonImageProps) => {
  return (
    <TouchableHighlight
      underlayColor="none"
      style={{...styles.imageButtonContainer, ...style}}
      onPress={onPress}>
      <Image
        source={imgUrl}
        resizeMode="contain"
        style={{...styles.imageButton, tintColor: tintColor}}
      />
    </TouchableHighlight>
  );
};

export const ClickableIndicatorPrimaryButton = ({
  onPress,
  children,
  style,
  isActive,
}: TYPES.ClickableIndicatorPrimaryButton) => {
  return (
    <TouchableHighlight underlayColor="none" onPress={onPress}>
      <View style={{...styles.clickableButtonContainer, ...style}}>
        <View style={styles.textContainer}>
          <Text style={styles.clickableButtonText}>
            {children}
          </Text>
        </View>
        <View
          style={{
            ...styles.clickableButtonIndicator,
            borderColor: isActive ? 'none' : COLORS.primaryIndicatorBorder,
            borderWidth: isActive ? 0 : 1,
          }}>
          {isActive && (
            <Image
              source={images.successIllustration}
              resizeMode="cover"
              style={styles.clickableButtonIndicatorImage}
            />
          )}
        </View>
      </View>
    </TouchableHighlight>
  );
};

export const interestsButton = ({
  onPress,
  style,
  children,
  borderColor
}: TYPES.InterestsButtonPress) => {

  return (
    <TouchableHighlight
      style={[styles.interestButton, {...style, borderColor: borderColor}]}
      onPress={onPress}
      underlayColor="none">
      <Text style={[styles.interestButtonText, {...themeText.bodyMediumSix}]}>{children}</Text>
    </TouchableHighlight>
  );
};
