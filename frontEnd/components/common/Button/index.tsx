import React, {useState} from 'react';
import {Text, Image, View, Pressable} from 'react-native';
import {styles} from './styles';
import {PALETTE, TYPES} from '../../../constants';
import {images} from '../../../assets';
import {TouchableRipple} from 'react-native-paper';
import MaskedView from '@react-native-masked-view/masked-view';

export const PrimaryButton = ({
  onPress,
  style,
  children,
}: TYPES.PrimaryButtonProps) => {
  return (
    <View style={[styles.primaryButton, style]}>
      <TouchableRipple
        onPress={onPress}
        style={styles.fullCenterContainer}
        rippleColor={PALETTE.GRAY400}>
        <Text style={styles.primaryButtonTextLight}>{children}</Text>
      </TouchableRipple>
    </View>
  );
};

export const CustomizableButton = ({
  onPress,
  style,
  children,
}: TYPES.CustomizableButtonProps) => {
  return (
    <View style={[styles.customizableButton, style]}>
      <TouchableRipple
        onPress={onPress}
        style={styles.fullCenterContainer}
        rippleColor={PALETTE.GRAY400}>
        {children}
      </TouchableRipple>
    </View>
  );
};

export const ButtonImage = ({
  imgUrl,
  onPress,
  tintColor,
  style,
}: TYPES.ButtonImageProps) => {
  return (
    <View style={[styles.imageButtonContainer, style]}>
      <Image
        source={imgUrl}
        resizeMode="contain"
        style={[styles.imageButton, {tintColor}]}
      />
      <MaskedView
        style={styles.fullCenterContainer}
        maskElement={
          <Image
            source={imgUrl}
            resizeMode="contain"
            style={[styles.imageButton, {tintColor}]}
          />
        }>
        <TouchableRipple
          onPress={onPress}
          style={styles.fullCenterContainer}
          rippleColor={PALETTE.GRAY400}>
          <></>
        </TouchableRipple>
      </MaskedView>
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
