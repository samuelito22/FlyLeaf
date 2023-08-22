import {
  View,
  ScrollView,
  Image,
  Text,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';
import React from 'react';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {
  BORDER_RADIUS,
  PALETTE,
  ROUTES,
  THEME_COLORS,
  TYPES,
  themeText,
} from '../../constants';
import {useSelector} from 'react-redux';
import {
  Button,
  ProfilePrivateHeader,
  Ripple,
  SafeContainer,
  UserProfileCard,
} from '../../components';
import {style as GeneralStyles} from './styles';
import {icons, images} from '../../assets';
import {useDispatch} from '../../utils/hooks';
import {EditProfileActions} from '../../redux';
import {TouchableRipple} from 'react-native-paper';
import {useState} from "react"

const UserProfileScreen = () => {
  const dispatch = useDispatch();

  const currentUserId = useSelector(
    (state: TYPES.AppState) => state.usersReducer.currentUserId,
  );
  const userProfile: TYPES.userProfileDataStructure = currentUserId
    ? useSelector(
        (state: TYPES.AppState) => state.usersReducer.byId[currentUserId],
      )
    : null;

  const navigation = useNavigation<NavigationProp<TYPES.RootStackParamList>>();

  const [premiumPressed, setPremiumPressed] = useState(false)

  const dateObj = new Date(userProfile.user.profile.dateOfBirth);

  

  const onEditPress = () => {
    if (userProfile) {
      dispatch(EditProfileActions.initUserProfile(userProfile));

      navigation.navigate(ROUTES.EDIT_PROFILE_SCREEN);
    }
  };

  const featuresList = [
    { feature: 'Profile Creation', free: true, pro: true },
    { feature: 'Unlimited Matches', free: true, pro: true },
    { feature: 'Blurred Image Engagement', free: true, pro: true },
    { feature: 'Standard Search', free: true, pro: true },
    { feature: 'Unlimited Chat', free: true, pro: true },
    { feature: 'Notifications', free: true, pro: true },
    { feature: 'Advanced Search', free: false, pro: true },
    { feature: 'See Who Liked You', free: false, pro: true },
    { feature: 'Priority Profile', free: false, pro: true },
    { feature: 'Engagement Insights', free: false, pro: true },
    { feature: 'Faster Image Reveal', free: false, pro: true },
    { feature: 'Ad-Free Experience', free: false, pro: true },
    { feature: 'Offline Events or Webinars', free: false, pro: true },
    { feature: 'Icebreakers & Conversation Starters', free: false, pro: true },
  ]

  const FieldOfTable = ({feature, free, pro}: {feature:string, free: boolean, pro: boolean}) => {
    return (
      <View style={{flexDirection: 'row', minHeight: 60,alignItems:'center'}}>
      <View style={styles.plansContainer_firstColumn}>
        <Text style={styles.plansContainer_feature}>{feature}</Text>
      </View>
      <View style={styles.plansContainer_restOfColumn}>
        <Image source={free ? images.successIllustration : icons.dash} resizeMode='contain' style={[!free && {tintColor: THEME_COLORS.tertiary}, {width: 20, height: 20}]}/>
      </View>
      <View style={styles.plansContainer_restOfColumn}>
      <Image source={pro ? images.successIllustration : icons.dash} resizeMode='contain' style={[!pro && {tintColor: THEME_COLORS.tertiary}, {width: 20, height: 20}]}/>

      </View>
      </View>
    )
  }

  


  return (
    <SafeContainer>
      <ProfilePrivateHeader />
      <View style={GeneralStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
         
      <View style={styles.plansContainer}> 
      <View style={styles.planCard}>
        <Image source={icons.coinsColoured} style={styles.planCard_icon} resizeMode='contain' />
        <View  style={styles.planCard_textContainer}><Text style={styles.planCard_text}>Recharge connects</Text><Text style={styles.planCard_paragraph}><Text style={{...themeText.bodyBoldSix, color: THEME_COLORS.tertiary}}>{userProfile?.user.appActivity.connects ? userProfile.user.appActivity.connects : 0}</Text> Connects</Text></View>
    <Button.ButtonImage imgUrl={icons.plus} contentContainerStyle={{position:'absolute', top: -8, right: -8, borderWidth: 0.2, borderRadius: 500, borderColor: THEME_COLORS.tertiary}} width={30} height={30} tintColor={THEME_COLORS.tertiary}/>
      </View> 
      <View style={styles.planCard}>
        <Image source={images.logo} style={styles.planCard_icon} resizeMode='contain' tintColor={THEME_COLORS.primary}/>
        <View  style={styles.planCard_textContainer}><Text style={styles.planCard_text}>Pro membership</Text><Text style={styles.planCard_paragraph}>Enjoy the additional features that pro membership offers to you</Text></View>
    <Button.ButtonImage imgUrl={icons.plus} contentContainerStyle={{position:'absolute', top: -8, right: -8, borderWidth: 0.2, borderRadius: 500, borderColor: THEME_COLORS.tertiary}} width={30} height={30} tintColor={THEME_COLORS.tertiary}/>
      </View>
      <View style={{flexDirection: 'row', minHeight: 50,alignItems:'center'}}>
      <View style={styles.plansContainer_firstColumn}>
        <Text style={styles.plansContainer_title}>Features</Text>
      </View>
      <View style={styles.plansContainer_restOfColumn}>
      <Text style={[styles.plansContainer_title, {textAlign:'center'}]}>Free</Text>

      </View>
      <View style={styles.plansContainer_restOfColumn}>
      <Text style={[styles.plansContainer_title, {textAlign:'center'}]}>Pro</Text>
      </View>
      </View>
      {featuresList.map((item, index) => (
                <FieldOfTable 
                  key={index}
                  feature={item.feature}
                  free={item.free}
                  pro={item.pro}
                />
              ))}
      </View>  
        </ScrollView>
      </View>
    </SafeContainer>
  );
};

export default UserProfileScreen;

export const styles = StyleSheet.create({
  scrollViewContainer: {
    width: '100%',
    paddingVertical: 15
  },
 
  plansContainer: {
    backgroundColor: "white", 
    paddingHorizontal: 20,
    paddingVertical: 10

  },
  header: {
    ...themeText.bodyMediumThree,
    color:THEME_COLORS.dark,
    paddingHorizontal: 20,
    paddingBottom: 10
  },
  plansContainer_firstColumn:{
    flex:  0.5,
  },
  plansContainer_title:{
    ...themeText.bodyMediumSix,
    color:THEME_COLORS.dark,
  },
  plansContainer_restOfColumn:{
    flex:  0.25,
    alignItems:'center'
  },
  plansContainer_feature:{
    ...themeText.bodyRegularSix,
    color:THEME_COLORS.dark,
  },
  planCard: {
    flexDirection: 'row',
    justifyContent:'space-evenly',
    alignItems:'center',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: PALETTE.GHOSTWHITE,
    padding: 20,
    marginVertical: 10
  },
  planCard_icon: {
    flex: 0.2,
    aspectRatio: 1
  } ,
  planCard_text: {
    color: THEME_COLORS.dark,
    ...themeText.bodyMediumFive,
  } ,
  planCard_textContainer: {
    flex: 0.6,



  } ,
  planCard_paragraph: {
    color: THEME_COLORS.tertiary,
    ...themeText.bodyRegularSix,
  } ,
});
