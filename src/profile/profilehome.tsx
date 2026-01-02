import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  StatusBar,
  SafeAreaView,
  Animated,
  Modal,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
//import { AsyncStorage } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import ScamShieldApp from '../profileredirect/important/scammers';
// Update the navigation type to match the actual screens in App.tsx
import { DEV_BASE_URL } from '@env';


type RootStackParamList = {
  Personal: undefined;
  Visa: undefined;
  Resources: undefined;
  Outside: undefined;
  Scams: undefined;
  Groups: undefined;
  Store: undefined;
  UploadPost: undefined;
  Test: undefined;
  Rides: undefined;
  ScamShieldApp: undefined;
  Lawyers:undefined;
  Discounts: undefined;
  insurance:undefined;
  Driving: undefined;
  Docs: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ProfileSection {
  icon: string;
  title: string;
  description: string;
  route: keyof RootStackParamList;
  color: string;
}

// Add these interfaces for type safety
interface ProfileData {
  profilePic: string;
  fullName: string;
  university: string;
 // years: number;
  //major: string;
  location: string;
}

// Default hardcoded data
const DEFAULT_PROFILE_DATA: ProfileData = {
  profilePic: 'https://r1.ilikewallpaper.net/iphone-x-wallpapers/download/78885/kratos-on-thrones-iphone-x-wallpaper-ilikewallpaper_com.jpg',
  fullName: 'Your Name',
  university: 'University of Texas',
 // years: 3,
 // major: 'CS',
  location: 'Dallas'
};








const ProfilePage = () => {
  const navigation = useNavigation<NavigationProp>();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [profileData, setProfileData] = useState<ProfileData>(DEFAULT_PROFILE_DATA);
  const [showImageModal, setShowImageModal] = useState(false);
  const scrollY = new Animated.Value(0);

  // Function to fetch profile data from backend
  const fetchProfileData = async () => {
    try {
      // Replace this URL with your actual backend API endpoint
      const token = await AsyncStorage.getItem('userToken'); // Get saved token
    
    const response = await fetch('DEV_BASE_URL/profile/', {
      headers: {
        'Authorization': `Bearer ${token}`, // ← Critical for authentication
        'Content-Type': 'application/json'
      }
    });
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
        setIsConnected(true);
        
        // Save to AsyncStorage for offline access
        await AsyncStorage.setItem('profileData', JSON.stringify(data));
      } else {
        throw new Error('Failed to fetch profile data');
      }
    } catch (error) {
      console.log('Using offline data:', error);
      setIsConnected(false);
      // Try to load from AsyncStorage
      const savedData = await AsyncStorage.getItem('profileData');
      if (savedData) {
        setProfileData(JSON.parse(savedData));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const profileSections: ProfileSection[] = [
  { icon: 'school', title: "University Info", description: "Campus resources, academic calendar", route: "Outside", color: "#7C3AED" },
  { icon: 'flight', title: "Visa Guidance", description: "F1 visa tips, OPT/CPT info", route: "Visa", color: "#059669" },
    { icon: 'local-offer', title: "Health insurance and clinics", description: "Emergency clinics and health insurances for you", route: "insurance", color: "#16A34A" },

  { icon: 'directions-car', title: "Driving Schools", description: "Get your licence with a driving school", route: "Driving", color: "#2563EB" },
  { icon: 'menu-book', title: "Student Resources", description: "Tutoring, career services", route: "Resources", color: "#D97706" },
  { icon: 'local-offer', title: "Student Discounts", description: "Discounts for students only", route: "Discounts", color: "#16A34A" },
  { icon: 'security', title: "Avoid Scams", description: "Common frauds to watch for", route: "Scams", color: "#DC2626" },
];


  const headerHeight = scrollY.interpolate({
    inputRange: [0, 180],
    outputRange: [180, 80],
    extrapolate: 'clamp'
  });

  const avatarScale = scrollY.interpolate({
    inputRange: [0, 180],
    outputRange: [1, 0.5],
    extrapolate: 'clamp'
  });

  const avatarTop = scrollY.interpolate({
    inputRange: [0, 180],
    outputRange: [30, -10],
    extrapolate: 'clamp'
  });

  const pickImage = async () => {
    try {
      // Use react-native-image-picker instead of expo-image-picker
      const options = {
        mediaType: 'photo' as const,
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
      };

      const result = await launchImageLibrary(options);

      if (result.assets && result.assets[0]) {
        const newImageUri = result.assets[0].uri;
        
        if (newImageUri) {
          // Update profile data with new image
          const updatedProfileData = {
            ...profileData,
            profilePic: newImageUri
          };
          
          // Save to AsyncStorage
          await AsyncStorage.setItem('profileData', JSON.stringify(updatedProfileData));
          
          // Update state
          setProfileData(updatedProfileData);
          setShowImageModal(false);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to update profile picture');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <View style={styles.headerBackground} />
        <Animated.View style={[styles.profileImageContainer, { 
          transform: [{ scale: avatarScale }],
          top: avatarTop
        }]}>
          <TouchableOpacity 
            onPress={() => setShowImageModal(true)}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: profileData.profilePic }}
              style={styles.profileImage}
              onError={() => setProfileData(prev => ({
                ...prev,
                profilePic: 'https://via.placeholder.com/150'
              }))}
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.editButton}
            activeOpacity={0.8}
            onPress={() => setShowImageModal(true)}
          >
            <Icon name="edit-2" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* Profile Content */}
        <View style={styles.content}>
                  {/* Profile Content */}

          <View style={styles.profileInfo}>
            <Text style={styles.name}>{profileData.fullName}</Text>
            <Text style={styles.university}>{profileData.university}</Text>
                              {/* Profile Content 

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profileData.years}</Text>
                <Text style={styles.statLabel}>Years</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profileData.major}</Text>
                <Text style={styles.statLabel}>Major</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profileData.location}</Text>
                <Text style={styles.statLabel}>Location</Text>
              </View>
            </View>
            */}
          </View>

          {/* Connection Status Indicator */}
          

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('Docs')}
                >
                  <MaterialIcon name="message" size={20} color="#4F46E5" />
                  <Text style={styles.actionText}>Documents</Text>
                </TouchableOpacity>

              <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Lawyers')}
            >              
              <MaterialIcon name="event" size={30} color="#4F46E5" />
              <Text style={styles.actionText}>Lawyers</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Groups')}
            >
              <MaterialIcon name="groups" size={30} color="#4F46E5" />
              <Text style={styles.actionText}>Groups</Text>
            </TouchableOpacity>
          </View>

          {/* Main Sections */}
          <View style={styles.sectionsContainer}>
            {profileSections.map((section, index) => (
              <TouchableOpacity
                key={index}
                style={styles.sectionButton}
                onPress={() => navigation.navigate(section.route)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, { backgroundColor: section.color + '20' }]}>
                  <MaterialIcon 
                    name={section.icon} 
                    size={24} 
                    color={section.color}
                  />
                </View>
                <View style={styles.sectionTextContainer}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <Text style={styles.sectionDescription}>{section.description}</Text>
                </View>
                <Icon name="chevron-right" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      

      {/* Profile Image Modal */}
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowImageModal(false)}
            >
              <Icon name="x" size={24} color="#000" />
            </TouchableOpacity>
            
            <Image
              source={{ uri: profileData.profilePic }}
              style={styles.modalImage}
              resizeMode="contain"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={pickImage}
              >
                <Icon name="upload" size={20} color="#FFFFFF" />
                <Text style={styles.modalButtonText}>Change Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 100,
    paddingBottom: 80,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#11182e',
  },
  profileImageContainer: {
    position: 'absolute',
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#DC143C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  profileImage: {
    width: 114,
    height: 114,
    borderRadius: 57,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#11182e',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 2,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  university: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
 quickActions: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  marginVertical: 1,
  paddingHorizontal: 10,
  gap: 16, // adds space between buttons if supported
},

actionButton: {
  alignItems: 'center',
  backgroundColor: '#EEF2FF', // softer lavender tone
  paddingVertical: 1,
  paddingHorizontal: 1,
  borderRadius: 16,
  width: '28%',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3, // for Android shadow
  borderWidth: 1,
  borderColor: '#E0E7FF', // subtle border for depth
},




actionText: {
  color: '#4338CA', // deeper purple for contrast
  fontSize: 12,
  fontWeight: '600',
  marginTop: 10,
  letterSpacing: 0.3,
},

  sectionsContainer: {
    marginTop: 5,
  },
  sectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sectionTextContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  bottomNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomNavText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  offlineBanner: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  offlineText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    zIndex: 1,
  },
  modalImage: {
    width: 300,
    height: 300,
    borderRadius: 150,
    marginVertical: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC143C',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProfilePage;