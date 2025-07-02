import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Login: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState<string[]>(Array(6).fill(''));
  const [verificationError, setVerificationError] = useState('');

  // Refs to move focus between code inputs
  const codeInputs = useRef<Array<TextInput | null>>([]);

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): string[] => {
    const newErrors: string[] = [];
    if (!formData.fullName.trim()) newErrors.push('Full name is required');
    if (!formData.email.includes('@')) newErrors.push('Valid email required');
    if (formData.password.length < 6) newErrors.push('Password needs 6+ characters');
    if (formData.password !== formData.confirmPassword) newErrors.push('Passwords must match');
    return newErrors;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrors([]);

    const newErrors = validateForm();
    if (newErrors.length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // No CSRF token in React Native normally. Adjust backend for tokenless or JWT.
      const response = await axios.post('http://10.0.2.2:8000/register_user/', formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        // Store full name if needed in AsyncStorage or context, here just local state
        setVerificationStep(true);
      } else {
        setErrors(['Something went wrong. Please try again.']);
      }
    } catch (error) {
      console.error(error);
      setErrors(['Server error. Please try again later.']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationChange = (text: string, index: number) => {
    if (/^\d*$/.test(text)) {
      const newCode = [...verificationCode];
      newCode[index] = text;
      setVerificationCode(newCode);

      // Focus next input if filled and not last
      if (text && index < 5) {
        codeInputs.current[index + 1]?.focus();
      }
    }
  };

  const handleVerificationKeyPress = (
    e: { nativeEvent: { key: string } },
    index: number
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !verificationCode[index] && index > 0) {
      codeInputs.current[index - 1]?.focus();
    }
  };

  const handleVerificationSubmit = async () => {
    const code = verificationCode.join('');
    if (code.length !== 6) {
      setVerificationError('Please enter the full 6-digit code');
      return;
    }

    setIsLoading(true);
    setVerificationError('');

    try {
      const response = await axios.post(
        'http://10.0.2.2:8000/verify_code/',
        { email: formData.email, code },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Verification successful! You can now login.', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login' as never),
          },
        ]);
      } else {
        setVerificationError('Invalid verification code. Please try again.');
      }
    } catch (error: any) {
      console.log(error);
      
      setVerificationError(
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Server error. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (verificationStep) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>N</Text>
            </View>
            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.subtitle}>We've sent a 6-digit code to {formData.email}</Text>
          </View>

          {verificationError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{verificationError}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <View style={styles.codeContainer}>
              {verificationCode.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => (codeInputs.current[index] = ref)}
                  style={styles.codeInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={text => handleVerificationChange(text, index)}
                  onKeyPress={e => handleVerificationKeyPress(e, index)}
                  autoFocus={index === 0}
                />
              ))}
            </View>

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleVerificationSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.buttonText}>Verifying...</Text>
                </>
              ) : (
                <Text style={styles.buttonText}>Verify Code</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Didn't receive the code? <Text style={styles.link}>Resend</Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>N</Text>
            </View>
            <Text style={styles.title}>Join Our Community</Text>
            <Text style={styles.subtitle}>Connect with Nepali students across the USA</Text>
          </View>

          {errors.length > 0 && (
            <View style={styles.errorBox}>
              {errors.map((err, i) => (
                <Text key={i} style={styles.errorText}>
                  {err}
                </Text>
              ))}
            </View>
          )}

          <View style={styles.form}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={formData.fullName}
              onChangeText={text => handleChange('fullName', text)}
              placeholder="Enter your full name"
              autoCapitalize="words"
              editable={!isLoading}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={text => handleChange('email', text)}
              placeholder="your.university@edu"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />

            <View style={styles.passwordLabelContainer}>
              <Text style={styles.label}>Password</Text>
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.toggleText}>{showPassword ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              value={formData.password}
              onChangeText={text => handleChange('password', text)}
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={!isLoading}
            />

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              value={formData.confirmPassword}
              onChangeText={text => handleChange('confirmPassword', text)}
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={!isLoading}
            />

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.buttonText}>Creating Account...</Text>
                </>
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.registerLink}>Sign in</Text>
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
      </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    borderTopWidth: 4,
    borderTopColor: '#DC143C', // for the top of the card
  },
  header: {
    backgroundColor: '#091429', // for card
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
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  codeInput: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
});

export default Register;
