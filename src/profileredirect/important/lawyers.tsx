import React from 'react';
import { View, Text, FlatList, StyleSheet, Linking, TouchableOpacity, ScrollView } from 'react-native';

// Sample data
const universityLawyer = {
  name: 'Jane Doe',
  email: 'jane.doe@university.edu',
  phone: '+1-800-123-4567',
};

const externalLawyers = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@lawfirm.com',
    phone: '+1-800-555-1234',
  },
  {
    id: '2',
    name: 'Maria Garcia',
    email: 'maria.garcia@legalhelp.org',
    phone: '+1-800-555-5678',
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'mchen@justicehub.com',
    phone: '+1-800-555-9012',
  },
];

// Contact button component
const ContactButton = ({ label, value, isEmail }) => (
  <TouchableOpacity
    onPress={() => {
      const url = isEmail ? `mailto:${value}` : `tel:${value}`;
      Linking.openURL(url);
    }}
  >
    <Text style={styles.contactLink}>{label}: {value}</Text>
  </TouchableOpacity>
);

// Main component
const LawyersScreen = () => {
  const renderLawyer = ({ item }) => (
    <View style={styles.lawyerCard}>
      <Text style={styles.name}>{item.name}</Text>
      <ContactButton label="Email" value={item.email} isEmail />
      <ContactButton label="Phone" value={item.phone} />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>University Lawyer</Text>
      <View style={styles.universityCard}>
        <Text style={styles.name}>{universityLawyer.name}</Text>
        <ContactButton label="Email" value={universityLawyer.email} isEmail />
        <ContactButton label="Phone" value={universityLawyer.phone} />
      </View>

      <Text style={styles.header}>Other Available Lawyers</Text>
      <FlatList
        data={externalLawyers}
        renderItem={renderLawyer}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#333',
  },
  universityCard: {
    backgroundColor: '#e0f7fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  lawyerCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#222',
  },
  contactLink: {
    fontSize: 16,
    color: '#1e88e5',
    marginTop: 2,
  },
});

export default LawyersScreen;
