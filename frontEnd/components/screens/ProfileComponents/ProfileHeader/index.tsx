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
          style={styles.icon}
          tintColor={THEME_COLORS.dark}
          onPress={handleBackPress}
        />
      <View>

      <ButtonImage
        imgUrl={icons.settings}
        style={styles.icon}
        tintColor={THEME_COLORS.dark}
      />
      </View>
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
          style={styles.icon}
          tintColor={THEME_COLORS.dark}
          onPress={handleBackPress}
        />
    </View>
  );
};
