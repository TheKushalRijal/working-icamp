import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import TopNav from '../../components/navigation/TopNav';
import SQLite from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { DEV_BASE_URL } from '@env';

interface Resource {
  icon: string;
  title: string;
  description: string;
  link?: string;
}

// Move existing resources array to fallbackData
const fallbackData: Resource[] = [
  {
    icon: 'book-open',
    title: 'Mav Mover',
    description: 'Book a ride for free and move around the campus',
    link: 'https://play.google.com/store/apps/details?id=ridewithvia.uota.arlingtonunilatenight&hl=en_US&pli=1',
  },
  {
    icon: 'book-open',
    title: 'Library Services',
    description: 'Access academic journals, borrow books, or use study spaces.',
    link: 'https://library.uta.edu',
  },
  {
    icon: 'map-pin',
    title: 'Campus Map',
    description: 'Find buildings, departments, parking spots, and more.',
    link: 'https://www.uta.edu/maps',
  },
  {
    icon: 'users',
    title: 'Student Organizations',
    description: 'Join clubs and student groups to connect and collaborate.',
    link: 'https://mavorgs.uta.edu',
  },
  {
    icon: 'globe',
    title: 'International Student Office',
    description: 'Support for international students including visa and immigration help.',
    link: 'https://www.uta.edu/oie',
  },
  {
    icon: 'message-circle',
    title: 'Counseling & Mental Health',
    description: 'Talk to professionals for mental health, stress, or emotional support.',
    link: 'https://www.uta.edu/student-affairs/caps',
  },
];

const UniversityResourcesPage = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);

  const fetchResourcesFromSQLite = async (): Promise<Resource[]> => {
    const db = await SQLite.openDatabase({ name: 'university.db', location: 'default' });
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT icon, title, description, link FROM resource`,
          [],
          (txObj, { rows }) => {
            const resources: Resource[] = [];
            for (let i = 0; i < rows.length; i++) {
              resources.push(rows.item(i));
            }
            resolve(resources);
          },
          (txObj, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  };

  useEffect(() => {
    //AsyncStorage.getItem("@selected_university").then(setSelectedUniversity);

    const fetchResources = async () => {
      

      // 1️⃣ Try SQLite first
      try {
        const sqliteData = await fetchResourcesFromSQLite();
        if (sqliteData && sqliteData.length > 0) {
          setResources(sqliteData);
          console.log(`✅ Resources loaded from SQLite`,sqliteData);
          return;
        }
      } catch (sqliteError) {
        console.warn("SQLite error or no data, will try backend next.", sqliteError);
      }

      // 2️⃣ Try backend if SQLite fails or is empty
      try {
        const response = await axios.get(
          `${DEV_BASE_URL}/resourcess/?university=${selectedUniversity}`,
          { timeout: 1000 }
        );
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setResources(response.data);
          console.log(`✅ Resources fetched from backend`);
          return;
        }
      } catch (error) {
        console.error(`❌ Error fetching resources from backend:`, error);
      }

      // 3️⃣ Fallback to hardcoded data
      setResources(fallbackData);
      console.warn(`⚠️ Using fallback resources data`);
    };

    fetchResources();
  }, [selectedUniversity]);

  const handleResourcePress = (link?: string) => {
    if (link) {
      Linking.openURL(link);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <TopNav title="University Resources" showBackButton={true} />
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>University Resources</Text>
      </View> */}

      <ScrollView style={styles.scrollView}>
        <Text style={styles.intro}>
          Here are some of the most helpful resources available to all UTA students.
        </Text>

        <View style={styles.resourceList}>
          {resources.map((resource, index) => (
            <TouchableOpacity
              key={index}
              style={styles.resourceCard}
              onPress={() => handleResourcePress(resource.link)}
            >
              <FeatherIcon name={resource.icon} size={24} color="#1e3a8a" style={styles.resourceIcon} />
              <View style={styles.resourceContent}>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                <Text style={styles.resourceDesc}>{resource.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1e3a8a',
    padding: 24,
    borderBottomWidth: 3,
    borderBottomColor: '#dc143c',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  intro: {
    fontSize: 16,
    color: '#2a4365',
    marginVertical: 24,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  resourceList: {
    padding: 16,
    gap: 16,
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: 'white',
    borderLeftWidth: 5,
    borderLeftColor: '#1e3a8a',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  resourceIcon: {
    marginTop: 3,
  },
  resourceContent: {
    flex: 1,
    marginLeft: 12,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#111827',
  },
  resourceDesc: {
    fontSize: 14,
    color: '#4a5568',
  },
});

export default UniversityResourcesPage;
