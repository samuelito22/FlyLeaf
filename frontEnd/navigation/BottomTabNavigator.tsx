import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  HomeScreen,
  LikesScreen,
  ChatsScreen,
  NotificationScreen,
} from '../screens';
import {Image, ImageSourcePropType, View} from 'react-native';
import {icons, images} from '../assets';
import {THEME_COLORS, HEIGHT, COMPONENT_COLORS} from '../constants';
import {TouchableRipple} from 'react-native-paper';

const Tab = createBottomTabNavigator();

interface TabIconProps {
  focused: boolean;
  source: ImageSourcePropType;
}

const TabIcon: React.FC<TabIconProps> = ({focused, source}) => {
  return (
    <Image
      source={source}
      style={{
        tintColor: focused ? THEME_COLORS.dark : THEME_COLORS.tertiary,
        width: 24,
        height: 24,
      }}
    />
  );
};

const BORDER_RADIUS = 20;

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          height: HEIGHT.bottomTabBar,
          shadowColor: 'transparent',
          elevation: 0,
          borderColor: COMPONENT_COLORS.bottomTabsBorder,
        },
      }}
      initialRouteName="Home"
      backBehavior="initialRoute">
      <Tab.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon focused={focused} source={icons.explore} />
          ),
          tabBarButton: props => (
            <View
              style={{
                flex: 1,
                overflow: 'hidden',
              }}>
              <TouchableRipple
                {...props}
                rippleColor={COMPONENT_COLORS.tabBarIcon}
                onPress={props.onPress}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon focused={focused} source={images.logo} />
          ),
          tabBarButton: props => (
            <View
              style={{
                flex: 1,
                overflow: 'hidden',
              }}>
              <TouchableRipple
                {...props}
                rippleColor={COMPONENT_COLORS.tabBarIcon}
                onPress={props.onPress}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Likes"
        component={LikesScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon focused={focused} source={icons.heartBold} />
          ),
          tabBarButton: props => (
            <View
              style={{
                flex: 1,
                overflow: 'hidden',
              }}>
              <TouchableRipple
                {...props}
                rippleColor={COMPONENT_COLORS.tabBarIcon}
                onPress={props.onPress}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Chats"
        component={ChatsScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon focused={focused} source={icons.messageBold} />
          ),
          tabBarButton: props => (
            <View
              style={{
                flex: 1,
                overflow: 'hidden',
              }}>
              <TouchableRipple
                {...props}
                rippleColor={COMPONENT_COLORS.tabBarIcon}
                onPress={props.onPress}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
