// src/components/LandingRedirect.tsx
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import { getItem } from '../../utils/asyncStorage';
import { testAsyncStorage } from '../../utils/testAsyncStorage';

const LandingRedirect: React.FC = () => {
  const navigation = useNavigation<any>();

  useEffect(() => {
    const checkToken = async () => {
      try {
        console.log('Checking for stored token...');
        
        // Test AsyncStorage functionality first
        await testAsyncStorage();
        
        const storedToken = await getItem('token');
        console.log('Token found:', !!storedToken);
        
        if (storedToken) {
          navigation.replace('Home');
        } else {
          navigation.replace('Landing');
        }
      } catch (error) {
        console.error('Error checking token:', error);
        // Fallback to landing page on error
        navigation.replace('Landing');
      }
    };

    checkToken();
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default LandingRedirect;
