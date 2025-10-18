import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Feather';
import axios from 'axios';
import { useEvents } from '../context/EventContext';
import VideoSection from '../components/videos/VideoSection';
import BottomNav from '../components/navigation/BottomNav';
import UserPost from '../components/UserPost';
  //import { DEV_BASE_URL, PROD_BASE_URL } from '@env';
import { PROD_BASE_URL } from '@env';
const DEV_BASE_URL = 'http://10.0.2.2:8000';
//import BASE_URL from '@env';
import { BASE_URL } from '@env';



import AsyncStorage from '@react-native-async-storage/async-storage';
// Define the navigation type
type RootStackParamList = {
  Home: undefined;
  Upload: undefined;
  UploadPost: undefined;
  Visa:undefined;
  // Add other screens as needed
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// Components
import FeaturedAnnouncement from '../components/announcements/FeaturedAnnouncements';
import CommunityLinks from '../components/navigation/CommunityLink';
import CommunityTabs from '../components/navigation/CommunityTabs';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
  isJoined: boolean;
}

interface Post {
  id: number | string;
  user: string;
  title: string;
  text: string;
  content: string;
  caption: string;
  author: string;
  date: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
  location?: { name?: string };
  Timestamp?: string;
  preview?: string;
}


const Home: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { events: initialEvents } = useEvents();
  const [activeTab, setActiveTab] = useState<'your-community' | 'campus-community'>('your-community');

  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [firebasePosts, setFirebasePosts] = useState<Post[]>([]);
  const [localPosts, setLocalPosts] = useState<Post[]>([]);
  const [backendPosts, setBackendPosts] = useState<Post[]>([]);
  const [featuredVideos, setFeaturedVideos] = useState<any[]>([]);
  const [announcement, setAnnouncement] = useState<any>(null);
  const [announcementLoading, setAnnouncementLoading] = useState(true);







const getFromBackend = async () => {

  try {
    const homeResponse = await axios.get(`${BASE_URL}/home/`, {
      timeout: 10, // 10 second timeout

   //   withCredentials: true,
    });

    const videosResponse = await axios.get(`${BASE_URL}/videos/`, {
      timeout: 10, // 10 second timeout

   //   withCredentials: true,
    });
    console.log("Home Data:", homeResponse.data);
    console.log("Videos Data:", videosResponse.data);

  

    return {
      home: homeResponse.data,
      videos: videosResponse.data,
    };
  } catch (error) {
   // console.error('Error fetching from backend:', error);
    return {};
  }
};

const allgetFromBackend = async () => {
  const BASE_URL = DEV_BASE_URL;

  try {
    const homeResponse = await axios.get(`${BASE_URL}/home/comunity/`, {
     // withCredentials: true,
    });

    const videosResponse = await axios.get(`${BASE_URL}/videos/community/`, {
     // withCredentials: true,
    });
    console.log(videosResponse.data)

    return {
      communityhome: homeResponse.data,
      communityvideos: videosResponse.data,
    };
  } catch (error) {
  //  console.error('Error fetching from backend:', error);
    return {};
  }
};



useEffect(() => {
  const fetchBackendData = async () => {// check here 
    const { home, videos } = await getFromBackend();
    console.log('Backend data received:', { home, videos });
    
    if (home && Array.isArray(home)) {
      const formattedPosts = home.map((post: any) => ({
        id: post.id || Math.random().toString(),
        user: post.user || 'Anonymous',
        title: post.title || '',
        text: post.content || post.caption || '',
        content: post.content || post.caption || '',
        caption: post.caption || '',
        author: post.author || post.user || 'Anonymous',
        date: post.date || post.Timestamp || new Date().toISOString(),
        likes: post.likes || 0,
        comments: post.comments || 0,
        isLiked: false,
        isBookmarked: false,
        location: post.location || {},
        Timestamp: post.Timestamp,
        preview: post.preview
      }));
      console.log('Formatted backend posts:', formattedPosts);
      setBackendPosts(formattedPosts);
    }

    if (videos && Array.isArray(videos)) {
      console.log('Featured videos data:', videos);
      console.log('Video URLs:', videos.map(v => v.url));
      console.log('Video titles:', videos.map(v => v.title));
      setFeaturedVideos(videos);
    } else {
      console.log('No videos data received or invalid format:', videos);
    }
  };

  fetchBackendData();
}, []);

  const handleJoinEvent = (eventId: number) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === eventId ? { ...event, isJoined: !event.isJoined } : event
      )
    );
  };

  const handleLikePost = (postId: number | string) => {
    setFirebasePosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  };

  const handleUploadPress = () => {
    navigation.navigate('UploadPost');
  };

  // Fetch announcement from backend or fallback
 

  // Add renderAnnouncement function
  useEffect(() => {
    const fetchAnnouncement = async () => {
      const BASE_URL = DEV_BASE_URL;
  
      // Helper function to save data in AsyncStorage
      const saveToStorage = async (data) => {
        try {
          await AsyncStorage.setItem('announcement', JSON.stringify(data));
          console.log('Saved announcement to storage.');
        } catch (error) {
          console.error('Error saving announcement to storage:', error);
        }
      };
  
      try {
        // Load cached data first
        const cached = await AsyncStorage.getItem('announcement');
        if (cached) {
          setAnnouncement(JSON.parse(cached));
          console.log('Loaded announcement from cache.');
        } else {
          // Use default if no cache
          const defaultData = {
            title: '📢 Summer Vacation',
            description: 'Class starting on Aug 19',
          };
          setAnnouncement(defaultData);
        }
  
        // Then try fetching from backend
       const response = await axios.get(`${BASE_URL}/announcements/`, {
  timeout: 10, // 10 seconds in milliseconds
});

        if (response?.data) {
          setAnnouncement(response.data);
          await saveToStorage(response.data); // Save fetched data to storage
          console.log('Fetched announcement from backend:', response.data);
        }
      } catch (error) {
        console.error('Failed to fetch from backend:', error.message);
      } finally {
        setAnnouncementLoading(false);
      }
    };
  
    fetchAnnouncement();
  }, []);

  const renderContent = () => {



    // Render posts based on active tab
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
        onLike={() => handleJoinEvent(event.id)}
      />
    );

    const renderPostItem = ({ item: post, index }: { item: Post; index: number }) => (
      <UserPost
        key={`backend-${post.id || index}`}
        id={post.id || `backend-${index}`}
        user={{ id: post.user || 'username', name: post.user || 'Anonymous' }}
        title={post.title || post.user || 'Anonymous'}
        content={post.content || post.caption || ''}
        location={post.location?.name || ''}
        timestamp={post.Timestamp || post.date || new Date().toISOString()}
        likes={post.likes || 0}
        comments={post.comments || 0}
        shares={0}
        isLiked={post.isLiked || false}
        isBookmarked={post.isBookmarked || false}
        onLike={() => {}}
      >
        {post.preview && (
          <View style={styles.postVideoContainer}>
            <Text>Video Preview: {post.preview}</Text>
          </View>
        )}
      </UserPost>
    );

    if (activeTab === 'your-community') {
      return (
        <>
          {/* Backend Posts */}
          {events.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Your Events</Text>
              <FlatList
                data={events}
                renderItem={renderEventItem}
                keyExtractor={(item) => `event-${item.id}`}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
              />
            </>
          )}
          {backendPosts.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Your Posts</Text>
              <FlatList
                data={backendPosts}
                renderItem={renderPostItem}
                keyExtractor={(item, index) => `post-${item.id || index}`}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
              />
            </>
          )}

          {/* Events */}
          

          {/* Empty State */}
          {backendPosts.length === 0 && events.length === 0 && (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>
                No posts or events available in your community yet
              </Text>
            </View>
          )}
        </>
      );
    } else {
      // Campus Community tab shows events and firebase posts
      return (
        <>
          {/* Events */}
          {events.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Campus Events</Text>
              <FlatList
                data={events}
                renderItem={renderEventItem}
                keyExtractor={(item) => `event-${item.id}`}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
              />
            </>
          )}
        </>
      );
    }
  };


  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoTitleWrapper}>
            <View style={styles.logoCircle}>
              <Text style={{ color: '#DC143C', fontWeight: 'bold' }}>NS</Text>
            </View>
            <Text style={styles.welcomeText}>Icamp</Text>
          </View>

          <TouchableOpacity 
            style={styles.loginBtn} 
            onPress={handleUploadPress}
            accessibilityLabel="Upload"
          >
            <Icon name="plus" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <CommunityLinks />
      </View>

      <CommunityTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <View style={styles.contentArea}>
  {/* Announcement and Videos always shown */}
  <View style={styles.contentArea}>
  {/* Announcement */}
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

  {/* Videos */}


  // add here
  <View style={{ 
    alignItems: 'flex-end', 
    marginTop: -60,      // more space above the arrow
    marginBottom: 25     // less space below the arrow
  }}>
    <Text style={{ 
      fontSize: 30,
      color: '#2a4365'  // matching the section title color
    }}>→</Text>
  </View>


  <VideoSection activeTab={activeTab} />

  {/* Posts/Events */}
  {renderContent()}
</View>

  {/* Posts/Events based on tab */}
</View>

    </ScrollView>
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