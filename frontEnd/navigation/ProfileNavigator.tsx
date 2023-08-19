import {createStackNavigator} from '@react-navigation/stack';
import {ROUTES} from '../constants';
import React from 'react';
import {UserProfileScreen, PublicProfileScreen, EditProfileScreen, EditGenderScreen, EditSexualOrientationScreen, EditLanguageScreen, EditJobTitleScreen, EditCompanyScreen, EditVaccineScreen, EditEthnicityScreen, } from '../screens';
import {cardSlideLeftAnimation} from '../utils/navigatorSlideAnimation';

const Stack = createStackNavigator();

const ProfileNavigator = () => {
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,

        cardStyleInterpolator: cardSlideLeftAnimation,
      }}>
      <Stack.Screen
        name={ROUTES.USER_PROFILE_SCREEN}
        component={UserProfileScreen}
      />
      <Stack.Screen
        name={ROUTES.PUBLIC_PROFILE_SCREEN}
        component={PublicProfileScreen}
      />
      <Stack.Screen
        name={ROUTES.EDIT_PROFILE_SCREEN}
        component={EditProfileScreen}
      />
      <Stack.Screen
        name={ROUTES.EDIT_GENDER_SCREEN}
        component={EditGenderScreen}/>
      <Stack.Screen 
        name={ROUTES.EDIT_SEXUAL_ORIENTATION_SCREEN}
        component={EditSexualOrientationScreen}
      />
      <Stack.Screen
      name={ROUTES.EDIT_LANGUAGE_SCREEN}
      component={EditLanguageScreen}
      />
      <Stack.Screen
      name={ROUTES.EDIT_JOB_TITLE_SCREEN}
      component={EditJobTitleScreen}
      />
      <Stack.Screen
      name={ROUTES.EDIT_COMPANY_SCREEN}
      component={EditCompanyScreen}
      />
       <Stack.Screen
      name={ROUTES.EDIT_VACCINE_SCREEN}
      component={EditVaccineScreen}
      />
       <Stack.Screen
      name={ROUTES.EDIT_ETHNICITY_SCREEN}
      component={EditEthnicityScreen}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
