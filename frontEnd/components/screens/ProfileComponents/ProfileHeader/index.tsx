import {View, Text, Image} from 'react-native';
import React from 'react';
import {styles} from './styles';
import {ButtonImage} from '../../../common/Button';
import {icons, images} from '../../../../assets';
import {THEME_COLORS, ROUTES, TYPES} from '../../../../constants';
import {useNavigation, NavigationProp} from '@react-navigation/native';

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

      <ButtonImage
       width={30}
       height={30}
        imgUrl={icons.settings}
        tintColor={THEME_COLORS.dark}
        contentContainerStyle={styles.iconContainer}
        iconHeaderRight={true}
      />
    </View>
  );
};

export const EditProfileHeader = () => {
  const navigation = useNavigation<NavigationProp<TYPES.RootStackParamList>>();
  const handleBackPress = async () => {
    navigation.goBack()
  };

  return (
    <View style={styles.container}>
        <ButtonImage
          imgUrl={icons.arrowLeft}
          tintColor={THEME_COLORS.dark}
          onPress={handleBackPress}
          width={30}
          height={30}
          contentContainerStyle={styles.iconContainer}
          iconHeaderLeft={true}
        />
    </View>
  );
};
