import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopNav from '../../components/navigation/TopNav';
import axios from 'axios';
import { BASE_URL } from '@env';

// Fallback hardcoded data
const fallbackHealthInsurance = {
  id: '1',
  insurance_name: 'University Health Plan',
  phone: '1-800-HEALTH',
  emergency_contact: '911',
  website: 'https://www.university.edu/health-insurance',
  address: 'On-campus Health Center',
  description: 'Full coverage for enrolled students',
  cost: 0,
};











import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'university.db', location: 'default' },
  () => console.log('DB opened'),
  error => console.log('DB open error', error)
);



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
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [clinics, setClinics] = useState([]);


  // Fetch data with synchronization logic
useEffect(() => {
  fetchHealthInsurance();
}, []);

const fetchHealthInsurance = (showLoading = true) => {
  if (showLoading) setLoading(true);

  db.transaction(tx => {
    tx.executeSql(
    `SELECT
     id,
     university_id,
     insurance_name,
     phone,
     emergency_contact,
     website,
     address,
     description,
     cost
   FROM health_insurance
   LIMIT 1`,
  [],

      (_, result) => {
        if (result.rows.length > 0) {
          const item = result.rows.item(0);

          setHealthInsurance({
          id: String(item.id),
          insurance_name: item.insurance_name,
          phone: item.phone,
          emergency_contact: item.emergency_contact,
          website: item.website,
          address: item.address,
          description: item.description,
          cost: item.cost,
        });

        } else {
          setHealthInsurance(fallbackHealthInsurance);
        }

        setLoading(false);
      },
      (_, err) => {
  console.log('health_insurance SELECT error:', err);
  setHealthInsurance(fallbackHealthInsurance);
  setError(err.message);
  setLoading(false);
  return false;
}

    );
  });
};

 

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
    <TopNav title="Health Insurance" />

    <ScrollView style={styles.content}>
      {/* Health Insurance Section */}
      <Text style={styles.sectionTitle}>University Health Insurance</Text>

      {healthInsurance && (
        <View style={styles.insuranceCard}>
          <Text style={styles.insuranceProvider}>
            {healthInsurance.insurance_name}
          </Text>

          {healthInsurance.phone && (
            <ContactButton
              label="Phone"
              value={healthInsurance.phone}
              type="phone"
            />
          )}

          {healthInsurance.website && (
            <ContactButton
              label="Website"
              value={healthInsurance.website}
              type="url"
            />
          )}

          {healthInsurance.address && (
            <Text style={styles.insuranceInfo}>
              {healthInsurance.address}
            </Text>
          )}

          {healthInsurance.description && (
            <Text style={styles.coverage}>
              {healthInsurance.description}
            </Text>
          )}

          {healthInsurance.cost !== null && (
            <Text style={styles.coverage}>
              Annual Cost: ${healthInsurance.cost}
            </Text>
          )}
        </View>
      )}

      {/* Marketplace Insurance (Placeholder) */}
      {clinics.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Marketplace Insurance</Text>

          {clinics.map((clinic) => (
            <View
              key={clinic.id}
              style={[
                styles.clinicCard,
                clinic.isEmergency && styles.emergencyCard,
              ]}
            >
              <View style={styles.clinicHeader}>
                <Text style={styles.clinicName}>{clinic.name}</Text>

                {clinic.isEmergency && (
                  <Text style={styles.emergencyBadge}>EMERGENCY</Text>
                )}
              </View>

              {clinic.address && (
                <Text style={styles.clinicInfo}>{clinic.address}</Text>
              )}

              {clinic.phone && (
                <ContactButton
                  label="Call"
                  value={clinic.phone}
                  type="phone"
                />
              )}
            </View>
          ))}
        </>
      )}
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