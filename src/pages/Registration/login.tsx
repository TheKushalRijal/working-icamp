import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { setItem } from '../../utils/asyncStorage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEV_BASE_URL } from '@env';
import axios from 'axios';
// Define the navigation param list
type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Register: undefined;
  Home: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const { login } = useAuth();

  // React Native does NOT have document.cookie
  // Adjust or remove CSRF handling as needed
  const getCSRFToken = () => {
    return '';
  };


 useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      }
    };
    checkLogin();
  }, [navigation]);


  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

     try {
    const response = await axios.post(
      `${DEV_BASE_URL}/loginroute/`,
      { email, password }, // send as object, not JSON string
      {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRFToken(),
        },
      }
    );

    const data = response.data;

       if (
  response.status === 200 &&
  data.access &&
  data.refresh &&
  data.user
) {
  await AsyncStorage.setItem('accessToken', data.access);
  await AsyncStorage.setItem('refreshToken', data.refresh);
  await AsyncStorage.setItem('userData', JSON.stringify(data.user));
  const success = await setItem('token', data.access);
  if (success) {
    await login(data.access);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  } else {
    setError('Failed to save authentication token');
  }
} else {
  setError(data.error || 'Login failed: Invalid credentials or server error.');
}
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={styles.container}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            {/* Replace this with a proper SVG or Image if needed */}
            <Text style={styles.logoText}>N</Text>
          </View>
          <Text style={styles.title}>Icamp</Text>
          <Text style={styles.subtitle}>Get all information as Nepali students</Text>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Your Email"
            style={styles.input}
            editable={!isLoading}
          />

          <View style={styles.passwordLabelContainer}>
            <Text style={styles.label}>Password</Text>
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.toggleText}>{showPassword ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholder="••••••••"
            style={styles.input}
            editable={!isLoading}
          />

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading}
            style={[styles.button, isLoading ? styles.buttonDisabled : null]}
          >
            {isLoading ? (
              <>
                <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>Signing In...</Text>
              </>
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>New to the community? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Create account</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our{' '}
            <Text style={styles.link}>Terms</Text> and <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#383961',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    borderTopWidth: 4,
    borderTopColor: '#DC143C',// for the top of the card
  },
  header: {
    backgroundColor: '#091429',// for card
    paddingVertical: 24,
    alignItems: 'center',
  },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoText: {
    color: '#DC143C',
    fontWeight: 'bold',
    fontSize: 24,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
    padding: 12,
    margin: 16,
    borderRadius: 4,
  },
  errorText: {
    color: '#B91C1C',
  },
  form: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  label: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#111827',
  },
  passwordLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  toggleText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#1D4ED8',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerText: {
    color: '#6B7280',
    fontSize: 14,
  },
  registerLink: {
    color: '#DC143C',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 4,
    textDecorationLine: 'underline',
  },
  footer: {
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },
  link: {
    color: '#2563EB',
    textDecorationLine: 'underline',
  },
});

export default Login;
