import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { sendSyncMetaToBackend } from './syncdatabase';
import { BASE_URL } from '@env';


const AuthLoading: React.FC = () => {
  const navigation = useNavigation();

  useEffect(() => {
  const checkToken = async () => {
    const token = await AsyncStorage.getItem('accessToken');

    if (token) {
      // fire-and-forget (do NOT await)
      sendSyncMetaToBackend(BASE_URL)
        .then((result) => {
          console.log('Sync check result:', result);
          // next step: if result.changed exists -> refetch & overwrite those datasets
        })
        .catch((e) => console.log('Sync check failed:', e));
    }

    navigation.reset({
      index: 0,
      routes: [{ name: token ? 'Main' : 'Login' }],
    });
  };
    checkToken();
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
};





export default AuthLoading;