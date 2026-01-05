import React, { useState, useRef, useEffect } from 'react';
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
import axios from 'axios';
import { saveUniversityDataToSQLite } from './database';
import UniversitySelector from './selectuniversity';

const DEV_BASE_URL = 'http://10.0.2.2:8000';

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

  // 🔹 moved here (was illegally inside handleSubmit)
  const [selectedUniversity, setSelectedUniversity] = useState<string>('');
  const codeInputs = useRef<Array<TextInput | null>>([]);
const [selectedUniversityId, setSelectedUniversityId] = useState<number | null>(null);
const [formData, setFormData] = useState<{ university?: string }>({});

  const navigation = useNavigation<NavigationProp>();
  const { login } = useAuth();

  // 🔹 moved here (was illegally inside handleSubmit)
  useEffect(() => {
    async function fetchUniversity() {
      try {
        const university = await AsyncStorage.getItem('@selected_university');
        if (university) {
          setSelectedUniversity(university);
          console.log(
            'Selected university success in registrer---------------:',
            university
          );
        }
      } catch (error) {
        console.error('Failed to load university from storage:', error);
      }
    }
    fetchUniversity();
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      const storedUniversityId = await AsyncStorage.getItem(
        '@selected_university'
      );
      const universityId = storedUniversityId
        ? parseInt(storedUniversityId, 10)
        : null;

      const response = await axios.post(
        `${DEV_BASE_URL}/loginroute/`,
        {
          email,
          password,
          university: universityId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );










      
      const data = response.data;

      console.log(
        'Backend response while login data here------------------------------------------------------------------------------',
        data
      );

      if (response.status === 200 && data.access && data.user) {
        await AsyncStorage.setItem('accessToken', data.access);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));

        console.log('Backend response while login data here:', data);

       // const university_data = data;;
        console.log(
          'Fetched university data: from backend her this is the finale and i sleep nowe',
        //  university_data
        );

const university_data = data.university_data;


//await saveUniversityDataToSQLite(university_data);









        if (university_data) {
          await saveUniversityDataToSQLite(university_data);
          console.log(
            'this data is connecting to the database here now, its working correctly',
            university_data
          );
        }

        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      } else {
        setError(
          data.error || 'Login failed: Invalid credentials or server error.'
        );
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  



/* Check if backend response has university name
if (data.user.university_name) {
 // setUniversity(data.user.university_name);
  await AsyncStorage.setItem('@selected_university', data.user.university_name);
}
}
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
*/



// Example usage: call this function where you need the email
// const storedEmail = await getEmailFromStorage();
// console.log('Email from AsyncStorage:', storedEmail);


  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={styles.container}
    >
      <View style={styles.card}>
        <View style={styles.header}>
         
         
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


                <View>
                    

     <UniversitySelector
  selectedUniversityId={selectedUniversityId}
  onSelectUniversity={(id) => {
    setSelectedUniversityId(id);
    setFormData(prev => ({ ...prev, university: id.toString() }));
  }}
/>


</View>









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



