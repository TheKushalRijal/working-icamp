import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEvents } from '../context/EventContext';
import VideoSection from '../components/videos/VideoSection';
import BottomNav from '../components/navigation/BottomNav';
import UserPost from '../components/UserPost';
import { PROD_BASE_URL } from '@env';
import CommunityLinks from '../components/navigation/CommunityLink';
import CommunityTabs from '../components/navigation/CommunityTabs';
//const DEV_BASE_URL = 'http://10.0.2.2:8000';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

import { DEV_BASE_URL } from '../config/config.ts';
//const BASE_URL=DEV_BASE_URL;

import FeaturedAnnouncement from '../components/announcements/FeaturedAnnouncements';



type RootStackParamList = {
  Home: undefined;
  Upload: undefined;
  UploadPost: undefined;
  Visa: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface Event {
  id: number;
  title: string;
  description: string;
}

export const STORAGE_KEY = 'backend_events';

const Home: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { events: hardcodedEvents } = useEvents();

  const [events, setEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState<'your-community' | 'campus-community'>('your-community');
const sortByLatest = (events: Event[]) =>
  [...events].sort((a, b) => b.id - a.id);

  // --------------------------
  // Load events from storage FIRST (this fixes your bug)
  // --------------------------
  const loadEventsFromStorage = async () => {
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      const localEvents: Event[] = storedData ? JSON.parse(storedData) : [];
          const combined = sortByLatest([...hardcodedEvents, ...localEvents]);
          setEvents(combined);
      console.log('📦 UI loaded from AsyncStorage immediately');
      return localEvents;
    } catch (error) {
      console.error('❌ Error loading events from AsyncStorage:', error);
      return [];
    }
  };

  // --------------------------
  // Fetch backend events (background only)
  // --------------------------
  const fetchBackendEvents = async (existingEvents: Event[]) => {
    try {
      const latestId =
        existingEvents.length > 0
          ? Math.max(...existingEvents.map(e => Number(e.id) || 0))
          : 0;
      console.log('🔄 Fetching backend events...........................');

        console.log('➡️ Sending request to backend with latestId:', latestId);
    const universityId = await AsyncStorage.getItem("@selected_university");

const startTime = Date.now();
const DEV_BASE_URL = 'http://10.0.2.2:8000';
 const response = await axios.get(
      `${DEV_BASE_URL}/home/${latestId}/`,
      {
        timeout: 5000,
        params: {
          universityid: universityId, // 👈 matches backend argument
        },
      }
    );

const endTime = Date.now();

console.log('⏱️ Backend response time (ms):', endTime - startTime);
console.log('📡 Raw Axios response:', response);
console.log('📦 response.data:', response.data);
console.log('📦 response.data type:', typeof response.data);
console.log(
  '📦 response.data length (if array):',
  Array.isArray(response.data) ? response.data.length : 'N/A'
);
      const data = response.data;
      // Backend says no new data → DO NOTHING
      if (data === 0 || data == null) {
  // 👇 IMPORTANT FIX
        if (existingEvents.length === 0) {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        }
        return;
}


      const incomingPosts: Event[] = Array.isArray(data) ? data : [data];

      const mappedIncoming: Event[] = incomingPosts
        .filter(item => item && item.id != null)
        .map(item => ({
          id: Number(item.id),
          title: item.title || 'Untitled Event',
          description: item.description || 'No description',
        }));

      // Merge ONLY new items
      const eventMap = new Map<number, Event>();
      existingEvents.forEach(e => eventMap.set(e.id, e));
      mappedIncoming.forEach(e => eventMap.set(e.id, e));

      const mergedEvents = Array.from(eventMap.values()).sort(
          (a, b) => b.id - a.id   // 🔥 latest first
        );


      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mergedEvents));
      setEvents([...hardcodedEvents, ...mergedEvents]);
      console.log('✅ UI updated with backend additions only');

    } catch (error) {
      console.log("error");
    }
  };

  // --------------------------
  // Run on focus (STRICT ORDER)
  // --------------------------
  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      const run = async () => {
        const localEvents = await loadEventsFromStorage();
        if (mounted) {
          fetchBackendEvents(localEvents);
        }
      };

      run();

      return () => {
        mounted = false;
      };
    }, [])
  );

  // --------------------------
  // UI helpers
  // --------------------------
  const handleUploadPress = () => {
    navigation.navigate('UploadPost');
  };

  const renderEventItem = ({ item }: { item: Event }) => (
    <UserPost
      key={item.id}
      id={item.id}
      user={{ id: String(item.id), name: item.title }}
      title={item.title}
      content={item.description}
    />
  );

  const renderContent = () => (
    <>
      {events.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>
            {activeTab === 'your-community' ? 'Your Events' : 'Campus Events'}
          </Text>

          <FlatList
            data={events}
            renderItem={renderEventItem}
            keyExtractor={(item) => `event-${item.id}`}
            scrollEnabled={false}
          />
        </>
      ) : (
        <View style={styles.emptyStateContainer}>
          <Text>No events available</Text>
        </View>
      )}
    </>
  );

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.logoTitleWrapper}>
              <View style={styles.logoCircle}>
                <Text style={{ color: '#DC143C', fontWeight: 'bold' }}>NS</Text>
              </View>
              <Text style={styles.welcomeText}>Icamp</Text>
            </View>
            <TouchableOpacity style={styles.loginBtn} onPress={handleUploadPress}>
              <Icon name="plus" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <CommunityLinks />
        </View>

        <View style={styles.contentArea}>
          <View style={styles.announcementContainer}>
            <FeaturedAnnouncement />
          </View>

          <View style={{ alignItems: 'flex-end', marginTop: -60, marginBottom: 25 }}>
            <Text style={{ fontSize: 30, color: '#2a4365' }}>→</Text>
          </View>

          <VideoSection activeTab={activeTab} />
          {renderContent()}
        </View>
      </ScrollView>
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0dfeb',// background
  },
  header: {
    backgroundColor: '#11182e',// top nav
    borderBottomWidth: 3,
    borderBottomColor: '#dc143c',
  },
  headerContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loginBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  contentWrapper: {
    flex: 1,
  },
  announcementContainer: {
    marginTop: 0,
    marginBottom: 10,
  },
  contentArea: {
    padding: 7,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2a4365',
    marginTop: -1,
    marginBottom: -1,
    paddingHorizontal: 12,
  },

  emptyStateContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginVertical: 16,
  },
  
});

export default Home;