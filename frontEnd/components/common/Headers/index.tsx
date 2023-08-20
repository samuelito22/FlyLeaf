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
    });
  };

  return (
    <View style={styles.container}>
        <ButtonImage
          imgUrl={icons.menu}
          width={30}
          height={30}
          contentContainerStyle={styles.iconContainer}
          iconHeaderLeft={true}
          tintColor={THEME_COLORS.dark}
          onPress={handleProfilePress}
        />
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={images.logo} />
      </View>
      <ButtonImage
      width={30}
      height={30}
      contentContainerStyle={styles.iconContainer}
      iconHeaderRight={true}
        imgUrl={icons.nature}
        tintColor={THEME_COLORS.dark}
      />
    </View>
  );
};

export const ProfilePrivateHeader = () => {
  const navigation = useNavigation<NavigationProp<TYPES.RootStackParamList>>();
  const handleBackPress = async () => {
    navigation.goBack()
  };

  return (
    <View style={styles.container}>
        <ButtonImage
          imgUrl={icons.arrowLeft}
          width={30}
          height={30}
          tintColor={THEME_COLORS.dark}
          onPress={handleBackPress}
          contentContainerStyle={styles.iconContainer}
          iconHeaderLeft={true}
        />
  
    </View>
  );
};

export const EditProfileHeader = ({ onBackPress, leftIconText } : {onBackPress?: () => void, leftIconText?: string}) => {
  const navigation = useNavigation<NavigationProp<TYPES.RootStackParamList>>();
  const handleBackPress = async () => {
    if(onBackPress) onBackPress()
    navigation.goBack()
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection:'row', height:'100%', alignItems:'center'}}>
        <ButtonImage
          imgUrl={icons.arrowLeft}
          tintColor={THEME_COLORS.dark}
          onPress={handleBackPress}
          width={30}
          height={30}
          contentContainerStyle={styles.iconContainer}
          iconHeaderLeft={true}
        />
        <Text style={styles.iconText}>{leftIconText}</Text>
        </View>
    </View>
  );
};
