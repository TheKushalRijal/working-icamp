import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { getItem } from '../utils/asyncStorage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
//import { AsyncStorage } from 'react-native';

interface Props {
  children: React.ReactNode;
}

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('ProtectedRoute: Checking authentication...');
        const token = await getItem('token');
        console.log('ProtectedRoute: Token found:', !!token);
        
        if (token) {
          setAuthenticated(true);
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }
      } catch (error) {
        console.error('ProtectedRoute: Error checking auth:', error);
        // On error, redirect to login
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigation]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{authenticated && children}</>;
};

export default ProtectedRoute;
