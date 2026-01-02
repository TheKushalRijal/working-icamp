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
const BASE_URL=DEV_BASE_URL;

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
 // date: string;
 // location: string;
 // image?: string;
 // isJoined: boolean;
}

const Home: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { events: hardcodedEvents } = useEvents();

  const [events, setEvents] = useState<Event[]>(hardcodedEvents);
  const [activeTab, setActiveTab] = useState<'your-community' | 'campus-community'>('your-community');

  const [featuredVideos, setFeaturedVideos] = useState<any[]>([]);

  // --------------------------
  // Fetch backend events and cache in AsyncStorage
  // --------------------------
const fetchBackendEvents = async () => {
  try {
    // -----------------------------
    // 1️⃣ Load & validate local data
    // -----------------------------
    let existingEvents: Event[] = [];

    try {
      const storedData = await AsyncStorage.getItem('backend_events');
      const parsed = storedData ? JSON.parse(storedData) : [];
      if (Array.isArray(parsed)) {
        existingEvents = parsed;
      }
    } catch {
      // Corrupted local storage → reset safely
      existingEvents = [];
      await AsyncStorage.removeItem('backend_events');
    }

    // Show cached data immediately
    setEvents([...hardcodedEvents, ...existingEvents]);

    // -----------------------------
    // 2️⃣ Determine sync cursor safely
    // -----------------------------
    const latestId =
      existingEvents.length > 0
        ? Math.max(...existingEvents.map(e => Number(e.id) || 0))
        : 0;

    // -----------------------------
    // 3️⃣ Ask backend for updates
    // -----------------------------
    const response = await axios.get(
      `${DEV_BASE_URL}/home/${latestId}`,
      { timeout: 10000 }
    );

    const data = response.data;

    // -----------------------------
    // 4️⃣ Handle "no new data"
    // -----------------------------
    if (data === 0 || data == null) {
      return;
    }

    // -----------------------------
    // 5️⃣ Normalize backend response
    // -----------------------------
    let incomingPosts: Event[] = [];

    if (Array.isArray(data)) {
      incomingPosts = data;
    } else if (typeof data === 'object') {
      incomingPosts = [data];
    } else {
      // Unknown response → ignore safely
      return;
    }

    // -----------------------------
    // 6️⃣ Map & sanitize incoming data
    // -----------------------------
    const mappedIncoming: Event[] = incomingPosts
      .filter(item => item && item.id != null)
      .map(item => ({
        id: Number(item.id),
        title: item.title || 'Untitled Event',
        description:
          item.description || item.caption || 'No description',
        date: item.date || new Date().toISOString(),
        location: item.location || 'TBD',
        image: item.image || '',
        isJoined: false,
      }));

    // -----------------------------
    // 7️⃣ Merge by ID (dedupe + update)
    // -----------------------------
    const eventMap = new Map<number, Event>();

    // Add existing events
    for (const e of existingEvents) {
      eventMap.set(Number(e.id), e);
    }

    // Add / overwrite with backend events
    for (const e of mappedIncoming) {
      eventMap.set(Number(e.id), e);
    }

    // -----------------------------
    // 8️⃣ Convert back to sorted array
    // -----------------------------
    const mergedEvents = Array.from(eventMap.values()).sort(
      (a, b) => Number(a.id) - Number(b.id)
    );

    // -----------------------------
    // 9️⃣ Detect backend deletion/reset
    // -----------------------------
    // If backend returned posts with IDs LOWER than what we sent,
    // it likely means backend was reset or data deleted.
    const backendMaxId = Math.max(...mappedIncoming.map(e => e.id), 0);

    if (backendMaxId < latestId) {
      // Backend reset detected → trust backend more
      // Optional strategy: refetch everything
      console.warn('⚠️ Backend reset detected, re-syncing fully');

      const fullResponse = await axios.get(`${DEV_BASE_URL}/home/`);
      if (Array.isArray(fullResponse.data)) {
        const freshEvents = fullResponse.data.map((item: any) => ({
          id: Number(item.id),
          title: item.title || 'Untitled Event',
          description:
            item.description || item.caption || 'No description',
          date: item.date || new Date().toISOString(),
          location: item.location || 'TBD',
          image: item.image || '',
          isJoined: false,
        }));

        await AsyncStorage.setItem(
          'backend_events',
          JSON.stringify(freshEvents)
        );
        setEvents([...hardcodedEvents, ...freshEvents]);
        return;
      }
    }

    // -----------------------------
    // 🔟 Persist & update UI
    // -----------------------------
    await AsyncStorage.setItem(
      'backend_events',
      JSON.stringify(mergedEvents)
    );

    setEvents([...hardcodedEvents, ...mergedEvents]);
  } catch (error) {
    console.error('❌ Event sync failed', error);
    // UI still shows cached data → safe failure
  }
};


  // --------------------------
  // Load events from storage
  // --------------------------
  const loadEventsFromStorage = async () => {
    try {
      const storedData = await AsyncStorage.getItem('backend_events');
      const localEvents = storedData ? JSON.parse(storedData) : [];
      setEvents([...hardcodedEvents, ...localEvents]);
      console.log('📦 Loaded events from storage + hardcoded');
    } catch (error) {
      console.error('❌ Error loading events from AsyncStorage:', error);
    }
  };

  // --------------------------
  // Run on first mount and on every focus
  // --------------------------
  useFocusEffect(
    useCallback(() => {
      loadEventsFromStorage();
      fetchBackendEvents();
    }, [])
  );

  // --------------------------
  // Fetch announcement with cache
  // --------------------------


// Rest of your UI code (unchanged)
const handleUploadPress = () => {
  navigation.navigate('UploadPost');
};

const renderEventItem = ({ item: event }: { item: Event }) => (
  <UserPost
    key={event.id}
    id={event.id}
    user={{ id: String(event.id), name: event.title }}
    title={event.title}
    content={event.description}
   
   
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
          ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        />
      </>
    ) : (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateText}>No events available</Text>
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

     {/* <CommunityTabs activeTab={activeTab} onTabChange={setActiveTab} /> */}

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

    {/* 👇 Add Bottom Navigation outside the scroll */}
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