import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  SafeAreaView,
  Dimensions,
  Linking
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TopNav from '../../components/navigation/TopNav';
import axios from 'axios';
import { DEV_BASE_URL } from '@env';
const { width } = Dimensions.get('window');
const GROUPS_ENDPOINT = `${DEV_BASE_URL}/api/groups/`;
DEV_BASE_URL;

interface GroupData {
  id: string;
  name: string;
  platform: string;
  members?: string; // optional if backend doesn't send this yet
  description: string;
  link: string;
  icon: string;
  verified?: boolean;
  category?: string;
}

/* 1. Move hardcoded groups here
const hardcodedGroups: GroupData[] = [
  {
    id: 'f1',
    name: 'Nepali community DFW',
    platform: 'facebook',
    description: 'Dallas, Fortworth, Arlington, Irving help Group',
    link: 'https://www.facebook.com/groups/800092676804143',
    icon: 'facebook',
   
  },
  {
    id: 'f2',
    name: 'Helpful Nepali Community Groups',
    platform: 'telegram',
    description: 'Worldwide scam alerts in multiple languages',
    link: 'https://www.facebook.com/groups/usnepalhelpnetwork',
    icon: 'telegram',
   
  },
  {
    id: 'f3',
    name: 'US-Nepal Help Network',
    platform: 'facebook',
    description: 'Nepali Help Group All Over USA',
    link: 'https://www.facebook.com/groups/usnepalhelpnetwork',
    icon: 'facebook',
    
  },
  // Add more hardcoded groups as needed
];
*/
// Restore categories array
const categories = [
  { id: 'all', name: 'All Groups' },
  { id: 'official', name: 'Official', icon: 'verified' },
  { id: 'local', name: 'Local', icon: 'map-marker' },
  { id: 'financial', name: 'Financial', icon: 'currency-usd' },
  { id: 'technical', name: 'Technical', icon: 'shield-lock' },
  { id: 'crypto', name: 'Crypto', icon: 'bitcoin' }
];

const CommunityGroupsScreen = () => {
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const hardcodedGroups: GroupData[] = [
    {
      id: 'f1',
      name: 'Nepali community DFW',
      platform: 'facebook',
      description: 'Dallas, Fortworth, Arlington, Irving help Group',
      link: 'https://www.facebook.com/groups/800092676804143',
      icon: 'facebook',
     
    },
    {
      id: 'f2',
      name: 'Helpful Nepali Community Groups',
      platform: 'telegram',
      description: 'Worldwide scam alerts in multiple languages',
      link: 'https://www.facebook.com/groups/usnepalhelpnetwork',
      icon: 'telegram',
     
    },
    {
      id: 'f3',
      name: 'US-Nepal Help Network',
      platform: 'facebook',
      description: 'Nepali Help Group All Over USA',
      link: 'https://www.facebook.com/groups/usnepalhelpnetwork',
      icon: 'facebook',
      
    },
    // Add more hardcoded groups if needed
  ];
  
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        console.log('Attempting to fetch groups from backend...');
        const response = await axios.get(`${DEV_BASE_URL}/groups/`, {
          timeout: 1000, // 1 second timeout
        });
  
        if (response.data && Array.isArray(response.data)) {
          setGroups(response.data);
          console.log('Groups fetched successfully.');
        } else {
          console.warn('Invalid response format. Falling back to hardcoded groups.');
          setGroups(hardcodedGroups);
        }
      } catch (error) {
        console.error('Failed to fetch groups. Using fallback data.', error);
        setGroups(hardcodedGroups);
      }
    };
  
    fetchGroups();
  }, []);
  

  // 2. Combine hardcoded and fetched groups
  const allGroups: GroupData[] = groups.length > 0 ? groups : hardcodedGroups;

  // Filter out groups missing essential fields
  const validGroups = allGroups.filter(
    group => group && group.name && group.description
  );

  // 3. Use validGroups for filtering and searching
  const filteredGroups = validGroups.filter(group => {
    const matchesCategory = activeFilter === 'all' || group.category === activeFilter;
    const name = group.name || '';
    const description = group.description || '';
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleGroupPress = (link: string) => {
    Linking.openURL(link).catch(err => {
      console.error("Failed to open URL:", err);
      // Using console.warn instead of alert for better error handling
      console.warn("Couldn't open the group link. Please try again later.");
    });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <Feather name="facebook" size={20} color="#1877F2" />;
      case 'whatsapp': return <Feather name="whatsapp" size={20} color="#25D366" />;
      case 'telegram': return <Feather name="send" size={20} color="#0088CC" />;
      case 'instagram': return <Feather name="instagram" size={20} color="#E4405F" />;
      case 'discord': return <MaterialCommunityIcons name="discord" size={20} color="#5865F2" />;
      default: return <Feather name="users" size={20} color="#3498db" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'facebook': return '#1877F2';
      case 'whatsapp': return '#25D366';
      case 'telegram': return '#0088CC';
      case 'instagram': return '#E4405F';
      case 'discord': return '#5865F2';
      default: return '#3498db';
    }
  };

  const renderGroupItem = ({ item }: { item: GroupData }) => (
    <TouchableOpacity
      style={styles.groupCard}
      onPress={() => handleGroupPress(item.link)}
      activeOpacity={0.8}
    >
      <View style={styles.groupHeader}>
        <View style={[
          styles.platformIconContainer,
          { backgroundColor: `${getPlatformColor(item.platform)}10` }
        ]}>
          {getPlatformIcon(item.platform)}
        </View>
        <View style={styles.groupInfo}>
          <View style={styles.groupTitleRow}>
            <Text style={styles.groupName} numberOfLines={1}>{item.name}</Text>
            {item.verified && (
              <MaterialIcons 
                name="verified" 
                size={16} 
                color={getPlatformColor(item.platform)} 
                style={styles.verifiedIcon} 
              />
            )}
          </View>
          <View style={styles.groupMeta}>
            <Text style={styles.groupPlatform}>
              {(item.platform || '').charAt(0).toUpperCase() + (item.platform || '').slice(1)}
            </Text>
            <View style={styles.memberCount}>
              <Ionicons name="people" size={12} color="#7f8c8d" />
              <Text style={styles.memberCountText}>{item.members}</Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={styles.groupDescription}>{item.description}</Text>

      <View style={styles.groupFooter}>
        <TouchableOpacity 
          style={[
            styles.joinButton,
            { backgroundColor: getPlatformColor(item.platform) }
          ]}
          onPress={() => handleGroupPress(item.link)}
        >
          <Text style={styles.joinButtonText}>Join Group</Text>
          <Feather name="arrow-up-right" size={14} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopNav title="Community Groups" />
      <ScrollView 
        style={styles.container}
        stickyHeaderIndices={[1]} // Makes the filter bar sticky
      >
        {/* Header */}
        

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#95a5a6" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search groups..."
            placeholderTextColor="#95a5a6"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#95a5a6" />
            </TouchableOpacity>
          )}
        </View>

        {/* Featured Groups */}
        {activeFilter === 'all' && searchQuery.length === 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Most Popular Groups</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredContainer}
            >
              {hardcodedGroups.map(group => (
                <TouchableOpacity
                  key={group.id}
                  style={[
                    styles.featuredCard,
                    { borderColor: getPlatformColor(group.platform) }
                  ]}
                  onPress={() => handleGroupPress(group.link)}
                >
                  <View style={styles.featuredHeader}>
                    
                    
                  </View>
                  <Text style={styles.featuredName} numberOfLines={2}>{group.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Category Filters */}
       

        {/* All Groups */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {activeFilter === 'all' ? 'All Communities' : `${categories.find(c => c.id === activeFilter)?.name || 'Unknown'} Communities`}
            <Text style={styles.groupCount}>  ({filteredGroups.length})</Text>
          </Text>
          
          {filteredGroups.length > 0 ? (
            <FlatList
              data={filteredGroups}
              renderItem={renderGroupItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.groupsList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Feather name="search" size={40} color="#bdc3c7" />
              <Text style={styles.emptyText}>No groups found</Text>
              <Text style={styles.emptySubtext}>Try a different search or filter</Text>
            </View>
          )}
        </View>

        {/* Safety Notice */}
        <View style={styles.safetyNotice}>
          <Ionicons name="shield-checkmark" size={20} color="#3498db" />
          <View style={styles.noticeTextContainer}>
            <Text style={styles.safetyNoticeTitle}>Safety First</Text>
            <Text style={styles.safetyNoticeText}>
              These are external communities. ScamShield verifies them but doesn't manage them.
              Never share personal or financial information in these groups.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 20,
    paddingBottom: 16,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 26,
    color: '#2c3e50',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    color: '#7f8c8d',
    lineHeight: 22,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    color: '#2c3e50',
    padding: 0,
    margin: 0,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
    color: '#2c3e50',
    marginBottom: 16,
  },
  groupCount: {
    fontFamily: 'Roboto-Regular',
    color: '#7f8c8d',
  },
  featuredContainer: {
    paddingBottom: 8,
  },
  featuredCard: {
    width: width * 0.65,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  featuredHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  featuredIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredVerifiedBadge: {
    backgroundColor: '#3498db',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredName: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 8,
    height: 44,
  },
  featuredMembers: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: '#7f8c8d',
  },
  filterContainer: {
    marginVertical: 12,
    paddingVertical: 4,
  },
  filterScroll: {
    paddingHorizontal: 4,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  activeFilter: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  filterIcon: {
    marginRight: 6,
  },
  filterText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: '#3498db',
  },
  activeFilterText: {
    color: 'white',
  },
  groupsList: {
    paddingBottom: 8,
  },
  groupCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  platformIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  groupInfo: {
    flex: 1,
  },
  groupTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  groupName: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: '#2c3e50',
    marginRight: 6,
    flexShrink: 1,
  },
  verifiedIcon: {
    marginLeft: 2,
  },
  groupMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupPlatform: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: '#7f8c8d',
    marginRight: 12,
  },
  memberCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberCountText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  groupDescription: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: '#34495e',
    marginBottom: 16,
    lineHeight: 20,
  },
  groupFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinButtonText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: 'white',
    marginRight: 6,
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: '#2c3e50',
    marginTop: 16,
  },
  emptySubtext: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
  safetyNotice: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  noticeTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  safetyNoticeTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: '#3498db',
    marginBottom: 4,
  },
  safetyNoticeText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 13,
    color: '#3498db',
    lineHeight: 18,
  },
});

export default CommunityGroupsScreen;