import {View, Text, Image} from 'react-native';
import React from 'react';
import {styles} from './styles';
import {ButtonImage} from '../../../common/Button';
import {icons, images} from '../../../../assets';
import {THEME_COLORS, ROUTES, TYPES} from '../../../../constants';
import {useNavigation, NavigationProp} from '@react-navigation/native';

const HomeHeader = () => {
  const navigation = useNavigation<NavigationProp<TYPES.RootStackParamList>>();
  const handleProfilePress = async () => {
    navigation.navigate(ROUTES.PROFILE_NAVIGATOR, {
      screen: ROUTES.USER_PROFILE_SCREEN,
    });
  };

  return (
    <View style={styles.container}>
        <ButtonImage
          imgUrl={icons.sidebar}
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
        imgUrl={icons.magic}
        tintColor={THEME_COLORS.dark}
      />
    </View>
  );
};

export default HomeHeader;
