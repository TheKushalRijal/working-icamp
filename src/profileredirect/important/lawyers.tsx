import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Linking, TouchableOpacity, ScrollView, TextInput, SafeAreaView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopNav from '../../components/navigation/TopNav';
import axios from 'axios';
//import { DEV_BASE_URL } from '@env';
import { BASE_URL } from '@env';
import { DEV_BASE_URL } from '@env';


// Fallback hardcoded data
const fallbackUniversityLawyer = {
    name: '',
    email: '',
    phone: '',
    specialization: '',
};

const fallbackExternalLawyers = [
  {
    id: '1',
    name: 'Rijal Law',
    email: 'info@rijallaw.com',
    phone: '18559974525',
    Specialization: 'Immigration Law',
  },
  
];

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

const LawyersScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLawyers, setFilteredLawyers] = useState([]);
  const [universityLawyer, setUniversityLawyer] = useState(null);
  const [externalLawyers, setExternalLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend or fallback to hardcoded data
useEffect(() => {
  const fetchData = async () => {
    const universityid = await AsyncStorage.getItem('@selected_university');

    try {
      // 1️⃣ FIRST: Try to load from AsyncStorage
      const savedData = await AsyncStorage.getItem('lawyersData');

      if (savedData) {
        const parsedData = JSON.parse(savedData);

        if (
          parsedData?.universityLawyer &&
          parsedData?.externalLawyers &&
          parsedData.externalLawyers.length > 0
        ) {
          // ✅ Data exists → use it and DO NOT call backend
          setUniversityLawyer(parsedData.universityLawyer);
          setExternalLawyers(parsedData.externalLawyers);
          setFilteredLawyers(parsedData.externalLawyers);
          setLoading(false);
          return;
        }
      }

      const response = await axios.get(`${BASE_URL}/universitylawyers/`, {
              params: {
                universityid: universityid,
              },
            });


      if (
        response.data &&
        response.data.universityLawyer &&
        response.data.externalLawyers
      ) {
        setUniversityLawyer(response.data.universityLawyer);
        setExternalLawyers(response.data.externalLawyers);
        setFilteredLawyers(response.data.externalLawyers);

        // Save to AsyncStorage
        await AsyncStorage.setItem(
          'lawyersData',
          JSON.stringify({
            universityLawyer: response.data.universityLawyer,
            externalLawyers: response.data.externalLawyers,
          })
        );
      } else {
        // 3️⃣ Backend returned invalid data → fallback
        setUniversityLawyer(fallbackUniversityLawyer);
        setExternalLawyers(fallbackExternalLawyers);
        setFilteredLawyers(fallbackExternalLawyers);
      }
    } catch (err) {
      console.log('Error fetching data:', err);
      setError(err);

      // 4️⃣ FINAL FALLBACK (storage already checked above)
      setUniversityLawyer(fallbackUniversityLawyer);
      setExternalLawyers(fallbackExternalLawyers);
      setFilteredLawyers(fallbackExternalLawyers);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);


  // Search filtering
  useEffect(() => {
    const lowerCaseQuery = searchQuery.trim().toLowerCase();
    
    if (!lowerCaseQuery) {
      setFilteredLawyers(externalLawyers);
      return;
    }
  
    setFilteredLawyers(
      externalLawyers.filter(lawyer => {
        return (
          lawyer.name.toLowerCase().includes(lowerCaseQuery) ||
          lawyer.email.toLowerCase().includes(lowerCaseQuery) ||
          lawyer.phone.includes(searchQuery)
        );
      })
    );
  }, [searchQuery, externalLawyers]);

  const renderLawyer = ({ item }) => (
    <View style={styles.lawyerCard}>
      <Text style={styles.name}>{item.name}</Text>
      <ContactButton label="Email" value={item.email} isEmail />
      <ContactButton label="Phone" value={item.phone} />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1e88e5" />
      </SafeAreaView>
    );
  }

  if (error && !universityLawyer) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Failed to load data. Please try again later.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <TopNav title="Lawyers & Legal Help" />
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search lawyers..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <Text style={styles.header}>University Lawyer</Text>

            {universityLawyer && universityLawyer.name ? (
              <View style={styles.universityCard}>
                <Text style={styles.name}>{universityLawyer.name}</Text>
                <ContactButton label="Email" value={universityLawyer.email} isEmail />
                <ContactButton label="Phone" value={universityLawyer.phone} />
              </View>
            ) : (
              <Text style={styles.noResults}>
                No university lawyer available
              </Text>
            )}


          <Text style={styles.header}>Other Available Lawyers</Text>
          {filteredLawyers.length > 0 ? (
            <FlatList
              data={filteredLawyers}
              renderItem={renderLawyer}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.noResults}>No lawyers found matching your search</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
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
  noResults: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#666',
  },
});

export default LawyersScreen;