// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthProvider } from './src/context/AuthContent';
import { EventProvider } from './src/context/EventContext';

// Screens
import Home from './src/pages/Home';
import Login from './src/pages/Registration/login';
import Register from './src/pages/Registration/register';
import LandingRedirect from './src/pages/Registration/landingpage';
import RidersApp from './src/rideshare/rideshare';
import Outside from './src/pages/UTA';
import UniversitySelection from './src/pages/university';
import StoresNearMe from './src/pages/stores';
import PersonalInfoPage from './src/profileredirect/important/personal';
import VisaPage from './src/profileredirect/important/visa';
import UploadPost from './src/pages/uploadpost';
import UniversityResourcesPage from './src/profileredirect/community/resources';
import Test from './src/pages/test';
import ProfilePage from './src/profile/profilehome';
import Housings from './src/pages/housings';
import NepaliCalendar from './src/components/calander/calander';

import BottomNav from './src/components/navigation/BottomNav';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Show BottomNav as the main app shell for authenticated users */}

      <Stack.Screen name="Main" component={BottomNav} />
      <Stack.Screen name="Rides" component={RidersApp} />

      {/* Screens outside BottomNav (like auth & onboarding) */}
      <Stack.Screen name="Landing" component={LandingRedirect} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />

      {/* Optional: other screens you want modally or outside of tabs */}
      <Stack.Screen name="UniversitySelection" component={UniversitySelection} />
      <Stack.Screen name="Store" component={StoresNearMe} />
      <Stack.Screen name="Personal" component={PersonalInfoPage} />
      <Stack.Screen name="Visa" component={VisaPage} />
      <Stack.Screen name="UploadPost" component={UploadPost} />
      <Stack.Screen name="Resources" component={UniversityResourcesPage} />
      <Stack.Screen name="Test" component={Test} />
    </Stack.Navigator>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </EventProvider>
    </AuthProvider>
  );
}
