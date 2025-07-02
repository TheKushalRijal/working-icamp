// src/navigation/MainStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens inside Home tab flow
import Home from '../../pages/Home';
import UploadPost from '../../pages/uploadpost';
import PersonalInfoPage from '../../profileredirect/important/personal';
import Resources from '../../profileredirect/community/resources';
import RidersApp from '../../rideshare/rideshare';
// add other internal screens...
const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={Home} />
      <Stack.Screen name="Rides" component={RidersApp} />
      <Stack.Screen name="UploadPost" component={UploadPost} />
      <Stack.Screen name="Personal" component={PersonalInfoPage} />
      <Stack.Screen name="Resources" component={Resources} />
      {/* Add more if needed */}
    </Stack.Navigator>
  );
}
