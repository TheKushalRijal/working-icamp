import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopNav from '../../components/navigation/TopNav';
import axios from 'axios';
import { BASE_URL } from '@env';

// Fallback hardcoded data
const fallbackHealthInsurance = {
  provider: 'University Health Plan',
  phone: '1-800-HEALTH',
  email: 'health@university.edu',
  website: 'https://health.university.edu',
  coverage: 'Full medical, dental, and vision coverage',
  emergencyContact: '1-888-EMERGENCY'
};

const fallbackClinics = [
  {
    id: '1',
    name: 'University Health Center',
    address: '123 Campus Drive, University City',
    phone: '1-555-UNI-CARE',
    hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-1PM',
    services: ['Primary Care', 'Urgent Care', 'Vaccinations', 'Physicals'],
    isEmergency: false
  },
  {
    id: '2',
    name: 'Campus Dental Clinic',
    address: '456 Health Sciences Blvd',
    phone: '1-555-DENTAL',
    hours: 'Mon-Thu: 8AM-5PM, Fri: 8AM-12PM',
    services: ['Cleanings', 'Fillings', 'Emergency Dental'],
    isEmergency: false
  },
  
];

const ContactButton = ({ label, value, type }) => (
  <TouchableOpacity
    onPress={() => {
      let url = value;
      if (type === 'email') url = `mailto:${value}`;
      if (type === 'phone') url = `tel:${value}`;
      Linking.openURL(url);
    }}
  >
    <Text style={styles.contactLink}>{label}: {value}</Text>
  </TouchableOpacity>
);

const Healthinsurance = () => {
  const [healthInsurance, setHealthInsurance] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data with synchronization logic
  useEffect(() => {
  const fetchData = async () => {
    try {
      // 1️⃣ Get the latest health data from AsyncStorage
      const storedData = await AsyncStorage.getItem('healthData');
      let lastKnownId = 0;

      if (storedData) {
        const parsedData = JSON.parse(storedData);
        lastKnownId = parsedData.lastUpdateId || 0;
      }

      // 2️⃣ Get the selected university ID from AsyncStorage
      const storedUniversityId = await AsyncStorage.getItem('@selected_university');
      const universityId = storedUniversityId ? parseInt(storedUniversityId, 10) : 9999; // 9999 = default "all"

      // 3️⃣ Send request to backend with both lastUpdateId and universityId
      const response = await axios.get(`${BASE_URL}/health-data/`, {
        params: { 
          lastUpdateId: lastKnownId,
          universityId: universityId
        }
      });
        // If backend returns 0, it means no new data available
        if (response.data.updateAvailable === 0) {
          console.log('Data is up to date, using cached data');
          // Use stored data if available
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            setHealthInsurance(parsedData.healthInsurance);
            setClinics(parsedData.clinics);
          } else {
            // Fallback to hardcoded data
            setHealthInsurance(fallbackHealthInsurance);
            setClinics(fallbackClinics);
          }
        } else {
          console.log('New data available, updating...');
          // Backend sent new data, update everything
          const newData = response.data;
          
          // Update state
          setHealthInsurance(newData.healthInsurance);
          setClinics(newData.clinics);
          
          // Update AsyncStorage with new data and new ID
          await AsyncStorage.setItem('healthData', JSON.stringify({
            healthInsurance: newData.healthInsurance,
            clinics: newData.clinics,
            lastUpdateId: newData.currentUpdateId
          }));
        }

      } catch (err) {
        console.log('Error fetching data from backend:', err);
        setError(err.message);
        
        // Fallback: Try to load from AsyncStorage
        try {
          const storedData = await AsyncStorage.getItem('healthData');
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            setHealthInsurance(parsedData.healthInsurance);
            setClinics(parsedData.clinics);
          } else {
            // Final fallback to hardcoded data
            setHealthInsurance(fallbackHealthInsurance);
            setClinics(fallbackClinics);
          }
        } catch (storageErr) {
          console.log('Storage error:', storageErr);
          // Ultimate fallback to hardcoded data
          setHealthInsurance(fallbackHealthInsurance);
          setClinics(fallbackClinics);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1e88e5" />
        <Text style={styles.loadingText}>Loading health data...</Text>
      </SafeAreaView>
    );
  }

  if (error && !healthInsurance) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load data</Text>
        <Text style={styles.errorSubtext}>Using cached information</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TopNav title="Health Insurance & Clinics" />
      
      <ScrollView style={styles.content}>
        {/* Health Insurance Section */}
        <Text style={styles.sectionTitle}>Health Insurance</Text>
        {healthInsurance && (
          <View style={styles.insuranceCard}>
            <Text style={styles.insuranceProvider}>{healthInsurance.provider}</Text>
            <ContactButton label="Phone" value={healthInsurance.phone} type="phone" />
            <ContactButton label="Email" value={healthInsurance.email} type="email" />
            <ContactButton label="Website" value={healthInsurance.website} type="website" />
            {healthInsurance.emergencyContact && (
              <ContactButton label="24/7 Emergency" value={healthInsurance.emergencyContact} type="phone" />
            )}
            <Text style={styles.coverage}>{healthInsurance.coverage}</Text>
          </View>
        )}

        {/* Clinics Section */}
        <Text style={styles.sectionTitle}>Nearby Clinics</Text>
        {clinics.map((clinic) => (
          <View key={clinic.id} style={[
            styles.clinicCard,
            clinic.isEmergency && styles.emergencyCard
          ]}>
            <View style={styles.clinicHeader}>
              <Text style={styles.clinicName}>{clinic.name}</Text>
              {clinic.isEmergency && (
                <Text style={styles.emergencyBadge}>EMERGENCY</Text>
              )}
            </View>
            
            <Text style={styles.clinicInfo}>{clinic.address}</Text>
            <Text style={styles.clinicInfo}>{clinic.hours}</Text>
            
            <View style={styles.services}>
              {clinic.services.map((service, index) => (
                <Text key={index} style={styles.service}>• {service}</Text>
              ))}
            </View>
            
            <ContactButton label="Call" value={clinic.phone} type="phone" />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  insuranceCard: {
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#1e88e5',
  },
  insuranceProvider: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1565c0',
  },
  coverage: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  clinicCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  emergencyCard: {
    backgroundColor: '#fff5f5',
    borderColor: '#ff6b6b',
  },
  clinicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  clinicName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    flex: 1,
  },
  emergencyBadge: {
    backgroundColor: '#ff6b6b',
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  clinicInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  services: {
    marginVertical: 8,
  },
  service: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  contactLink: {
    fontSize: 15,
    color: '#1e88e5',
    marginTop: 4,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: '#d32f2f',
    marginBottom: 8,
  },
  errorSubtext: {
    color: '#666',
    textAlign: 'center',
  },
});

export default Healthinsurance;