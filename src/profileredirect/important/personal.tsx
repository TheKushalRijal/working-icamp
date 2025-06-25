import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const PersonalInfoPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    major: '',
    studentId: '',
  });

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch('https://your-backend-api.com/api/student-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();
      Alert.alert('Success', 'Information submitted successfully!');
      console.log('Backend response:', data);
    } catch (err) {
      console.error('Submission failed:', err);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Student Information</Text>
      <Text style={styles.subtitle}>Add your personal and academic details</Text>

      <View style={styles.inputGroup}>
        <Feather name="user" size={20} color="#4a5568" style={styles.icon} />
        <TextInput
          placeholder="Full Name"
          value={formData.fullName}
          onChangeText={(value) => handleChange('fullName', value)}
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Feather name="mail" size={20} color="#4a5568" style={styles.icon} />
        <TextInput
          placeholder="Email Address"
          value={formData.email}
          onChangeText={(value) => handleChange('email', value)}
          keyboardType="email-address"
          style={styles.input}
        />
      </View>

      {/* Major */}
      <View style={styles.inputGroup}>
        <Feather name="book" size={20} color="#4a5568" style={styles.icon} />
        <TextInput
          placeholder="Major (e.g., Computer Science)"
          value={formData.major}
          onChangeText={(value) => handleChange('major', value)}
          style={styles.input}
        />
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitBtnText}>Submit Info</Text>
      </TouchableOpacity>

      <Text style={styles.note}>
        💡 This information may be helpful in connecting with other students who
        share similar majors, courses, or goals.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    maxWidth: 600,
    alignSelf: 'center',
    fontFamily: 'System',
    backgroundColor: '#f7fafc',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2A4365',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#718096',
    marginBottom: 24,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2d3748',
  },
  submitBtn: {
    backgroundColor: '#2A4365',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  submitBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  note: {
    marginTop: 20,
    fontSize: 14,
    color: '#4A5568',
    fontStyle: 'italic',
    backgroundColor: '#edf2f7',
    padding: 12,
    borderRadius: 8,
  },
});

export default PersonalInfoPage;
