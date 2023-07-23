import React, {useState} from 'react';
import {Text, Image, View, Pressable} from 'react-native';
import {styles} from './styles';
import {BORDER_RADIUS, PALETTE, THEME_COLORS, TYPES} from '../../../constants';
import {images} from '../../../assets';
import {TouchableRipple} from 'react-native-paper';

export const PrimaryButton = ({
  onPress,
  style,
  children,
  height,
  width,
  textStyle
}: TYPES.ButtonProps) => {
  return (
    <View style={[styles.primaryButton, {backgroundColor: THEME_COLORS.primary, height, width,}, style]}>
      <TouchableRipple
        onPress={onPress}
        style={styles.fullCenterContainer}
        rippleColor={PALETTE.GRAY400}>
        <Text style={textStyle ? textStyle : styles.buttonTextLight}>{children}</Text>
      </TouchableRipple>
    </View>
  );
};

export const DarkButton = ({
  onPress,
  style,
  children,
  height,
  width,
  textStyle
}: TYPES.ButtonProps) => {
  return (
    <View style={[styles.primaryButton, style, {backgroundColor: THEME_COLORS.dark, height, width,}]}>
      <TouchableRipple
        onPress={onPress}
        style={styles.fullCenterContainer}
        rippleColor={PALETTE.GRAY400}>
        <Text style={textStyle ? textStyle : styles.buttonTextLight}>{children}</Text>
      </TouchableRipple>
    </View>
  );
};

export const LightButton = ({
  onPress,
  style,
  children,
  height,
  width,
  textStyle
}: TYPES.ButtonProps) => {
  return (
    <View style={[styles.primaryButton, style, {backgroundColor: PALETTE.WHITE, height, width,}]}>
      <TouchableRipple
        onPress={onPress}
        style={styles.fullCenterContainer}
        rippleColor={PALETTE.GRAY400}>
        <Text style={textStyle ? textStyle : styles.buttonTextDark}>{children}</Text>
      </TouchableRipple>
    </View>
  );
};

export const ButtonImage = ({
  imgUrl,
  onPress,
  tintColor,
  width,
  height,
  contentContainerStyle,
  style,
  iconHeaderLeft,
  iconHeaderRight
}: TYPES.ButtonImageProps) => {
  const borderRight = {
    borderTopLeftRadius: BORDER_RADIUS.medium,
    borderBottomLeftRadius: BORDER_RADIUS.medium 
  }

  const borderLeft = {
    borderTopRightRadius: BORDER_RADIUS.medium,
    borderBottomRightRadius: BORDER_RADIUS.medium 
  }

  return (
    <View style={[styles.imageButtonContainer, contentContainerStyle, iconHeaderLeft && borderLeft, iconHeaderRight && borderRight ]}>
      <Image
        source={imgUrl}
        resizeMode="contain"
        style={[styles.imageButton, {tintColor, width, height}]}
      />
        <TouchableRipple
          onPress={onPress}
          style={styles.fullCenterContainer}
          rippleColor={PALETTE.GRAY400}>
          <></>
        </TouchableRipple>
    </View>
  );
};


export const ClickableIndicatorPrimaryButton = ({
  onPress,
  children,
  style,
  isActive,
}: TYPES.ClickableIndicatorPrimaryButton) => {
  return (
    <Pressable onPress={onPress}>
      <View style={[styles.clickableButtonContainer, style]}>
        <View style={styles.textContainer}>
          <Text style={styles.clickableButtonText}>{children}</Text>
        </View>
        <View style={{height: "100%", justifyContent: 'flex-start', padding:5}}>
        <View
          style={[
            styles.clickableButtonIndicator,
            isActive ? styles.indicatorActive : styles.indicatorInactive,
          ]}>
          {isActive && (
            <Image
              source={images.successIllustration}
              resizeMode="contain"
              style={styles.clickableButtonIndicatorImage}
            />
          )}
        </View>
        </View>
      </View>
    </Pressable>
  );
};

export const interestsButton = ({
  onPress,
  style,
  children,
  active
}: TYPES.InterestsButtonProps) => {

  return (
    <View
      style={[
        styles.interestButton,
        style,
        active ? styles.activeInterestButton : styles.inactiveInterestButton,
      ]}>
      <TouchableRipple
        onPress={() => {
          if (onPress) onPress();
        }}
        style={styles.fullCenterContainer}
        rippleColor={PALETTE.GRAY400}>
        <></>
      </TouchableRipple>
      <Text
        style={[
          styles.interestButtonText,
          active
            ? styles.activeInterestButtonText
            : styles.inactiveInterestButtonText,
        ]}>
        {children}
      </Text>
    </View>
  );
};
