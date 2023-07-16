import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  HomeScreen,
  LikesScreen,
  ChatsScreen,
  NotificationScreen,
} from '../screens';
import {Image, ImageSourcePropType, View} from 'react-native';
import {icons} from '../assets';
import {COLORS, HEIGHT} from '../constants';
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
        tintColor: focused ? COLORS.dark : COLORS.gray,
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
          borderColor: COLORS.bottomTabsBorder,
        },
      }}
      initialRouteName="Home"
      backBehavior="initialRoute">
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
              focused={focused}
              source={focused ? icons.homeBold : icons.homeLight}
            />
          ),
          tabBarButton: props => (
            <View
              style={{
                flex: 1,
                borderRadius: BORDER_RADIUS,
                overflow: 'hidden',
              }}>
              <TouchableRipple
                {...props}
                rippleColor={COLORS.TabBarIcon}
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
            <TabIcon
              focused={focused}
              source={focused ? icons.heartBold : icons.heartLight}
            />
          ),
          tabBarButton: props => (
            <View
              style={{
                flex: 1,
                borderRadius: BORDER_RADIUS,
                overflow: 'hidden',
              }}>
              <TouchableRipple
                {...props}
                rippleColor={COLORS.TabBarIcon}
                onPress={props.onPress}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
              focused={focused}
              source={
                focused ? icons.notificationBold : icons.notificationLight
              }
            />
          ),
          tabBarButton: props => (
            <View
              style={{
                flex: 1,
                borderRadius: BORDER_RADIUS,
                overflow: 'hidden',
              }}>
              <TouchableRipple
                {...props}
                rippleColor={COLORS.TabBarIcon}
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
            <TabIcon
              focused={focused}
              source={focused ? icons.messageBold : icons.messageLight}
            />
          ),
          tabBarButton: props => (
            <View
              style={{
                flex: 1,
                borderRadius: BORDER_RADIUS,
                overflow: 'hidden',
              }}>
              <TouchableRipple
                {...props}
                rippleColor={COLORS.TabBarIcon}
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
