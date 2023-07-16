import {View, Text, Image} from 'react-native';
import React from 'react';
import {styles} from './styles';
import {ButtonImage} from '../../../common/Button';
import {icons, images} from '../../../../assets';
import {COLORS} from '../../../../constants';

const HomeHeader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <ButtonImage
          imgUrl={icons.profileDark}
          style={styles.profile}
          tintColor={COLORS.secondary}
        />
      </View>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={images.logo} />
      </View>
      <ButtonImage
        imgUrl={icons.magicWand}
        style={styles.category}
        tintColor={COLORS.primary}
      />
    </View>
  );
};

export default HomeHeader;
