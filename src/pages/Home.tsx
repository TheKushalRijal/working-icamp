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
import FeaturedAnnouncement from '../components/announcements/FeaturedAnnouncements';
const DEV_BASE_URL = 'http://10.0.2.2:8000';
const BASE_URL=DEV_BASE_URL;

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
  date: string;
  location: string;
  image?: string;
  isJoined: boolean;
}

const Home: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { events: hardcodedEvents } = useEvents();

  const [events, setEvents] = useState<Event[]>(hardcodedEvents);
  const [activeTab, setActiveTab] = useState<'your-community' | 'campus-community'>('your-community');
  const [announcement, setAnnouncement] = useState<any>(null);
  const [announcementLoading, setAnnouncementLoading] = useState(true);
  const [featuredVideos, setFeaturedVideos] = useState<any[]>([]);

  // ✅ Fetch backend events and cache in AsyncStorage
  const fetchBackendEvents = async () => {
  try {
    const storedData = await AsyncStorage.getItem('backend_events');
    let existingEvents: Event[] = storedData ? JSON.parse(storedData) : [];

    // ✅ Check how many times page has been loaded
    const loadCountData = await AsyncStorage.getItem('page_load_count');
    let loadCount = loadCountData ? parseInt(loadCountData) : 0;
    loadCount += 1;
    await AsyncStorage.setItem('page_load_count', String(loadCount));

    // ✅ On first load — fetch all posts from backend
    if (loadCount === 1 || existingEvents.length === 0) {
      const response = await axios.get(`${DEV_BASE_URL}/home/`, { timeout: 10000 });
      if (response?.data && Array.isArray(response.data)) {
        const backendEvents: Event[] = response.data.map((item: any, index: number) => ({
          id: item.id || index + 1000,
          title: item.title || 'Untitled Event',
          description: item.description || item.caption || 'No description',
          date: item.date || new Date().toISOString(),
          location: item.location || 'TBD',
          image: item.image || 'https://example.com/default.jpg',
          isJoined: false,
        }));

        await AsyncStorage.setItem('backend_events', JSON.stringify(backendEvents));
        console.log('✅ All backend posts fetched and saved locally');
      }
      return;
    }

    // ✅ Every second load only — check for new post
    if (loadCount % 2 === 0 && existingEvents.length > 0) {
      const latestId = Math.max(...existingEvents.map((e) => e.id));
      const response = await axios.get(`${DEV_BASE_URL}/home/${latestId}`, { timeout: 10000 });

      if (response?.data === 0) {
        console.log('🟢 No new posts found');
      } else if (response?.data && typeof response.data === 'object') {
        const newPost: Event = {
          id: response.data.id || latestId + 1,
          title: response.data.title || 'Untitled Event',
          description: response.data.description || response.data.caption || 'No description',
          date: response.data.date || new Date().toISOString(),
          location: response.data.location || 'TBD',
          image: response.data.image || 'https://example.com/default.jpg',
          isJoined: false,
        };

        const updatedEvents = [...existingEvents, newPost];
        await AsyncStorage.setItem('backend_events', JSON.stringify(updatedEvents));
        console.log('🆕 New post added to local storage');
      }
    }
  } catch (error) {
    console.error('❌ Error fetching backend events:', error);
  }
};

// ✅ Load events from AsyncStorage (and fetch backend in background)
useEffect(() => {
  const loadEvents = async () => {
    try {
      const storedData = await AsyncStorage.getItem('backend_events');
      const localEvents = storedData ? JSON.parse(storedData) : [];
      const combinedEvents = [...hardcodedEvents, ...localEvents];
      setEvents(combinedEvents);
      console.log('📦 Loaded events from local storage + hardcoded');
    } catch (error) {
      console.error('❌ Error loading events from AsyncStorage:', error);
    }
  };

  loadEvents();
  fetchBackendEvents(); // background update logic
}, []);

// ✅ Fetch announcement with cache (unchanged)
useEffect(() => {
  const fetchAnnouncement = async () => {
    const BASE_URL = DEV_BASE_URL;
    const saveToStorage = async (data: any) => {
      try {
        await AsyncStorage.setItem('announcement', JSON.stringify(data));
      } catch (error) {
        console.error('Error saving announcement to storage:', error);
      }
    };

    try {
      const cached = await AsyncStorage.getItem('announcement');
      if (cached) {
        setAnnouncement(JSON.parse(cached));
      } else {
        const defaultData = { title: '📢 Summer Vacation', description: 'Class starting on Aug 19' };
        setAnnouncement(defaultData);
      }

      const response = await axios.get(`${BASE_URL}/announcements/`, { timeout: 10000 });
      if (response?.data) {
        setAnnouncement(response.data);
        await saveToStorage(response.data);
        console.log('✅ Announcement fetched and cached');
      }
    } catch (error) {
      console.error('❌ Failed to fetch announcement:', error.message);
    } finally {
      setAnnouncementLoading(false);
    }
  };

  fetchAnnouncement();
}, []);

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
    location={event.location}
    timestamp={event.date}
    likes={event.isJoined ? 1 : 0}
    comments={0}
    shares={0}
    isLiked={event.isJoined}
    isBookmarked={false}
    onLike={() => {}}
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

      <CommunityTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <View style={styles.contentArea}>
        <View style={styles.announcementContainer}>
          {announcementLoading ? (
            <Text>Loading announcement...</Text>
          ) : announcement ? (
            <FeaturedAnnouncement
              title={`📢 ${announcement.title}`}
              description={announcement.description}
            />
          ) : (
            <Text>No announcements available</Text>
          )}
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
    padding: 3,
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