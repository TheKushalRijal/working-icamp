import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  SafeAreaView,
  Dimensions,
  Linking,
  RefreshControl,
  ActivityIndicator,
  Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TopNav from '../../components/navigation/TopNav';
import axios from 'axios';
import { DEV_BASE_URL } from '@env';
import { Platform } from 'react-native';

const { width } = Dimensions.get('window');

interface GroupData {
  id: string;
  name: string;
  platform: string;
  description: string;
  link: string;
  icon: string;
  verified?: boolean;
  category?: string;
}

interface Category {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const categories: Category[] = [
  { id: 'all', name: 'All', icon: 'apps' },
  { id: 'facebook', name: 'Facebook', icon: 'logo-facebook' },
  { id: 'telegram', name: 'Telegram', icon: 'paper-plane' },
  { id: 'whatsapp', name: 'WhatsApp', icon: 'logo-whatsapp' },
  { id: 'discord', name: 'Discord', icon: 'chatbubbles' },
];

const fallbackGroups: GroupData[] = [
  {
    id: '1',
    name: 'Nepali Community DFW',
    platform: 'facebook',
    description: 'Dallas, Fort Worth, Arlington, Irving help Group for Nepali community members',
    link: 'https://www.facebook.com/groups/800092676804143',
    icon: 'facebook',
    verified: true,
  
  },
  {
    id: '2',
    name: 'Nepali Help Network USA',
    platform: 'telegram',
    description: 'Emergency help, resources and support for Nepali community across USA',
    link: 'https://t.me/nepalihelpusa',
    icon: 'telegram',
    verified: true,
  
  },
  {
    id: '3',
    name: 'US-Nepal Help Network',
    platform: 'facebook',
    description: 'Connecting Nepali community members all over the United States',
    link: 'https://www.facebook.com/groups/usnepalhelpnetwork',
    icon: 'facebook',
   
  },
  {
    id: '4',
    name: 'Nepali Tech Community',
    platform: 'discord',
    description: 'Tech discussions, career advice and networking for Nepali professionals',
    link: 'https://discord.gg/nepalitech',
    icon: 'discord',
    verified: true,
  },
  {
    id: '5',
    name: 'Nepali Students USA',
    platform: 'whatsapp',
    description: 'Student support group for Nepali students in American universities',
    link: 'https://chat.whatsapp.com/invite/example',
    icon: 'whatsapp',
  },
];

import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'university.db', location: 'default' },
  () => console.log('DB opened'),
  error => console.log('DB open error', error)
);

const CommunityGroupsScreen = () => {
const [groups, setGroups] = useState<GroupData[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = (showLoading = true) => {
    if (showLoading) setLoading(true);

db.transaction(tx => {
  tx.executeSql(
    `SELECT 
      id,
      name,
      platform,
      description,
      link,
      icon,
      verified,
      category,
      members
     FROM community_group`,
    [],
    (_, result) => {
      const rows = result.rows;
      const data: GroupData[] = [];

      for (let i = 0; i < rows.length; i++) {
        const item = rows.item(i);
        data.push({
          ...item,
          id: String(item.id),
          verified: Boolean(item.verified),
        });
      }

      console.log('SQLite rows count:------------------------------------------>', data.length);

      if (data.length > 0) {
        setGroups(data);
      } else {
        setGroups(fallbackGroups);
      }

      setLoading(false);
      setRefreshing(false);
    },
    (_, error) => {
      // 🔴 THIS WAS MISSING
      console.log('SQLite SELECT error:', error);

      // fail gracefully
      setGroups(fallbackGroups);
      setLoading(false);
      setRefreshing(false);

      return false; // stop transaction propagation
    }
  );
});

  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchGroups(false);
  }, []);
  const handleGroupPress = async (link: string) => {
    try {
      const canOpen = await Linking.canOpenURL(link);
      if (canOpen) {
        await Linking.openURL(link);
      } else {
        Alert.alert('Error', 'Cannot open this link');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open group link');
    }
  };

  const getPlatformIcon = (platform: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      facebook: <Ionicons name="logo-facebook" size={22} color="#1877F2" />,
      whatsapp: <Ionicons name="logo-whatsapp" size={22} color="#25D366" />,
      telegram: <MaterialCommunityIcons name="telegram" size={22} color="#0088CC" />,
      discord: <MaterialCommunityIcons name="discord" size={22} color="#5865F2" />,
      instagram: <Ionicons name="logo-instagram" size={22} color="#E4405F" />,
    };
    return iconMap[platform] || <Ionicons name="people" size={22} color="#7F8C8D" />;
  };

  const getPlatformColor = (platform: string) => {
    const colorMap: { [key: string]: string } = {
      facebook: '#1877F2',
      whatsapp: '#25D366',
      telegram: '#0088CC',
      discord: '#5865F2',
      instagram: '#E4405F',
    };
    return colorMap[platform] || '#7F8C8D';
  };

  const filteredGroups = groups.filter(group => {
    if (activeFilter !== 'all' && group.platform !== activeFilter) return false;
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      group.name.toLowerCase().includes(query) ||
      group.description.toLowerCase().includes(query)
    );
  });

  const renderGroupItem = ({ item }: { item: GroupData }) => (
    <TouchableOpacity
      style={styles.groupCard}
      onPress={() => handleGroupPress(item.link)}
      activeOpacity={0.7}
    >
      <View style={styles.groupHeader}>
        <View style={[
          styles.platformIconContainer,
          { backgroundColor: `${getPlatformColor(item.platform)}15` }
        ]}>
          {getPlatformIcon(item.platform)}
        </View>
        
        <View style={styles.groupInfo}>
          <View style={styles.groupTitleRow}>
            <Text style={styles.groupName} numberOfLines={1}>
              {item.name}
            </Text>
            {item.verified && (
              <MaterialIcons 
                name="verified" 
                size={16} 
                color={getPlatformColor(item.platform)} 
              />
            )}
          </View>
          
          <View style={styles.groupMeta}>
            <Text style={styles.groupPlatform}>
              {item.platform.charAt(0).toUpperCase() + item.platform.slice(1)}
            </Text>
            <View style={styles.separator} />
            <View style={styles.memberCount}>
              <Ionicons name="people-outline" size={14} color="#7F8C8D" />
              
            </View>
          </View>
        </View>
      </View>

      <Text style={styles.groupDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.groupFooter}>
        <TouchableOpacity
          style={[styles.joinButton, { backgroundColor: getPlatformColor(item.platform) }]}
          onPress={() => handleGroupPress(item.link)}
        >
          <Text style={styles.joinButtonText}>Join Group</Text>
          <Feather name="external-link" size={14} color="white" style={styles.joinIcon} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryFilter = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterContainer}
    >
      {categories.map(category => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.filterButton,
            activeFilter === category.id && styles.activeFilterButton
          ]}
          onPress={() => setActiveFilter(category.id)}
        >
          <Ionicons
            name={category.icon}
            size={16}
            color={activeFilter === category.id ? '#FFFFFF' : getPlatformColor(category.id)}
            style={styles.filterIcon}
          />
          <Text style={[
            styles.filterText,
            activeFilter === category.id && styles.activeFilterText
          ]}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopNav title=" Groups" />
      
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3498db']}
            tintColor="#3498db"
          />
        }
      >
        {/* Search Section */}
       

        {/* Category Filters */}
        {renderCategoryFilter()}

        {/* Loading State */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3498db" />
            <Text style={styles.loadingText}>Loading groups...</Text>
          </View>
        ) : (
          <>
            {/* Groups Count */}
            <View style={styles.headerRow}>
              <Text style={styles.sectionTitle}>
                {activeFilter === 'all' ? 'All Groups' : 
                 `${categories.find(c => c.id === activeFilter)?.name} Groups`}
              </Text>
              <Text style={styles.groupCount}>
                {filteredGroups.length} {filteredGroups.length === 1 ? 'group' : 'groups'}
              </Text>
            </View>

            {/* Groups List */}
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
                <Feather name="users" size={60} color="#BDC3C7" />
                <Text style={styles.emptyTitle}>No groups found</Text>
                <Text style={styles.emptySubtitle}>
                  {searchQuery ? 'Try a different search term' : 'No groups available in this category'}
                </Text>
              </View>
            )}

            {/* Safety Tip */}
            
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    fontFamily: 'System',
  },
  filterContainer: {
    paddingVertical: 8,
    paddingRight: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E8ECF0',
  },
  activeFilterButton: {
    backgroundColor: '#3498DB',
    borderColor: '#3498DB',
  },
  filterIcon: {
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'System',
    fontWeight: '500',
    color: '#2C3E50',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  loadingContainer: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#7F8C8D',
    fontFamily: 'System',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'System',
    fontWeight: '700',
    color: '#2C3E50',
  },
  groupCount: {
    fontSize: 14,
    fontFamily: 'System',
    color: '#7F8C8D',
  },
  groupsList: {
    paddingBottom: 20,
  },
  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  platformIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  groupInfo: {
    flex: 1,
  },
  groupTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  groupName: {
    fontSize: 17,
    fontFamily: 'System',
    fontWeight: '600',
    color: '#2C3E50',
    flex: 1,
    marginRight: 6,
  },
  groupMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupPlatform: {
    fontSize: 13,
    fontFamily: 'System',
    color: '#7F8C8D',
    textTransform: 'capitalize',
  },
  separator: {
    width: 1,
    height: 12,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  memberCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberCountText: {
    fontSize: 13,
    fontFamily: 'System',
    color: '#7F8C8D',
    marginLeft: 4,
  },
  groupDescription: {
    fontSize: 15,
    fontFamily: 'System',
    color: '#5D6D7E',
    lineHeight: 22,
    marginBottom: 20,
  },
  groupFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  joinButtonText: {
    fontSize: 15,
    fontFamily: 'System',
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 6,
  },
  joinIcon: {
    marginTop: 1,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'System',
    fontWeight: '600',
    color: '#2C3E50',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    fontFamily: 'System',
    color: '#7F8C8D',
    textAlign: 'center',
  },
  safetyTip: {
    flexDirection: 'row',
    backgroundColor: '#E8F8F5',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 30,
    alignItems: 'flex-start',
  },
  safetyTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  safetyTitle: {
    fontSize: 15,
    fontFamily: 'System',
    fontWeight: '600',
    color: '#27AE60',
    marginBottom: 4,
  },
  safetyDescription: {
    fontSize: 14,
    fontFamily: 'System',
    color: '#27AE60',
    lineHeight: 20,
  },
});

export default CommunityGroupsScreen;