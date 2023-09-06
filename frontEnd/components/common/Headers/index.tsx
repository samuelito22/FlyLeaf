import {View, Text, Image} from 'react-native';
import React from 'react';
import {styles} from './styles';
import {ButtonImage} from '../Button';
import {icons, images} from '../../../assets';
import {THEME_COLORS, ROUTES, TYPES, PALETTE} from '../../../constants';
import {useNavigation, NavigationProp} from '@react-navigation/native';

export const HomeHeader = () => {
  const navigation = useNavigation<NavigationProp<TYPES.RootStackParamList>>();
  const handleProfilePress = async () => {
    navigation.navigate(ROUTES.PROFILE_NAVIGATOR, {
      screen: ROUTES.USER_PROFILE_SCREEN,
    } as any);
  };

  return (
    <View style={styles.container}>
      <ButtonImage
        imgUrl={icons.menu}
        width={24}
        height={24}
        contentContainerStyle={styles.iconContainer}
        tintColor={THEME_COLORS.dark}
        onPress={handleProfilePress}
      />
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={images.logo} />
      </View>
      <ButtonImage
        width={24}
        height={24}
        contentContainerStyle={styles.iconContainer}
        imgUrl={icons.bell}
        tintColor={THEME_COLORS.dark}
      />
    </View>
  );
};

export const ProfilePrivateHeader = () => {
  const navigation = useNavigation<NavigationProp<TYPES.RootStackParamList>>();
  const handleBackPress = async () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ButtonImage
        imgUrl={icons.arrowLeft}
        width={24}
        height={24}
        tintColor={THEME_COLORS.dark}
        onPress={handleBackPress}
        contentContainerStyle={styles.iconContainer}
      />
      <ButtonImage
        width={24}
        height={24}
        imgUrl={icons.settings}
        tintColor={THEME_COLORS.dark}
        contentContainerStyle={styles.iconContainer}
        iconHeaderRight={true}
      />
    </View>
  );
};

export const EditProfileHeader = ({
  onBackPress,
  leftIconText,
}: {
  onBackPress?: () => void;
  leftIconText?: string;
}) => {
  const navigation = useNavigation<NavigationProp<TYPES.RootStackParamList>>();
  const handleBackPress = async () => {
    if (onBackPress) onBackPress();
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View
        style={{flexDirection: 'row', height: '100%', alignItems: 'center'}}>
        <ButtonImage
          imgUrl={icons.arrowLeft}
          tintColor={THEME_COLORS.dark}
          onPress={handleBackPress}
          width={24}
          height={24}
          contentContainerStyle={styles.iconContainer}
        />
        <Text style={styles.iconText}>{leftIconText}</Text>
      </View>
    </View>
  );
};
