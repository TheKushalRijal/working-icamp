import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Calendar, MessageCircle, User } from 'lucide-react-native';

import HomeStack from './MainStack';
import NepaliCalendar from '../calander/calander';

import RidersApp from '../../rideshare/rideshare';
import StoresNearMe from '../../pages/stores';
import Housings from '../../pages/housings';
import ProfilePage from '../../profile/profilehome';

const Tab = createBottomTabNavigator();

const BottomNav = () => {
  return (
    <Tab.Navigator
  screenOptions={({ route }) => ({
    headerShown: false,
    tabBarShowLabel: true,
    tabBarLabelStyle: { fontSize: 12, marginBottom: 4 },
    tabBarActiveTintColor: '#38B2AC',
    tabBarInactiveTintColor: '#718096',
    tabBarStyle: {
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#e2e8f0',
      paddingBottom: 6,
      height: 60,
    },
    tabBarIcon: ({ color, size }) => {
      switch (route.name) {
        case 'Home':
          return <Home color={color} size={size} />;
        case 'Events':
          return <Calendar color={color} size={size} />;
        case 'Rides':
          return <MessageCircle color={color} size={size} />;
        case 'Places':
          return <MessageCircle color={color} size={size} />;
        case 'Housings':
          return <MessageCircle color={color} size={size} />;
        case 'Profile':
          return <User color={color} size={size} />;
        default:
          return null;
      }
    },
  })}
>
  <Tab.Screen name="Home" component={HomeStack} />
  <Tab.Screen name="Events" component={NepaliCalendar} />
  <Tab.Screen name="Rides" component={RidersApp} />
  <Tab.Screen name="Places" component={StoresNearMe} />
  <Tab.Screen name="Housings" component={Housings} />
  <Tab.Screen name="Profile" component={ProfilePage} />
</Tab.Navigator>

  );
};

export default BottomNav;
