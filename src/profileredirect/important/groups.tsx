import React, { useState } from 'react';
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
import { Ionicons, Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CommunityGroupsScreen = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Expanded group data with categories
  const groupsData = {
    featured: [
      {
        id: 'f1',
        name: 'Nepali community DFW',
        platform: 'facebook',
        members: '58.2k',
        description: 'Dallas, Fortworth, Arlington, Irving help Group',
        link: 'https://www.facebook.com/groups/800092676804143',
        icon: 'facebook',
        verified: true,
        category: 'official'
      },
      {
        id: 'f2',
        name: 'Helpful Nepali Community Groups',
        platform: 'telegram',
        members: '142.7k',
        description: 'Worldwide scam alerts in multiple languages',
        link: 'https://www.facebook.com/groups/usnepalhelpnetwork',
        icon: 'telegram',
        verified: true,
        category: 'international'
      },
      {
        id: 'f3',
        name: 'US-Nepal Help Network',
        platform: 'facebook',
        members: '142.7k',
        description: 'Nepali Help Group All Over USA',
        link: 'https://www.facebook.com/groups/usnepalhelpnetwork',
        icon: 'facebook',
        verified: true,
        category: 'international'
      }
    ],
    all: [
      {
        id: '1',
        name: 'Singapore Fraud Watch',
        platform: 'facebook',
        members: '32.5k',
        description: 'Local scam alerts and prevention tips',
        link: 'https://facebook.com/groups/SGFraudWatch',
        icon: 'facebook',
        category: 'local'
      },
      {
        id: '2',
        name: 'Cyber Security SG',
        platform: 'whatsapp',
        members: '8.7k',
        description: 'Cybersecurity professionals sharing latest threats',
        link: 'https://chat.whatsapp.com/CyberSecuritySG',
        icon: 'whatsapp',
        category: 'technical'
      },
      {
        id: '3',
        name: 'Elderly Scam Prevention',
        platform: 'facebook',
        members: '15.3k',
        description: 'Protecting seniors from financial scams',
        link: 'https://facebook.com/groups/ElderlyScamPrevention',
        icon: 'facebook',
        category: 'seniors'
      },
      {
        id: '4',
        name: 'Crypto Scam Alert',
        platform: 'discord',
        members: '24.6k',
        description: 'Identifying cryptocurrency and NFT scams',
        link: 'https://discord.gg/CryptoScamAlert',
        icon: 'discord',
        category: 'crypto'
      },
      {
        id: '5',
        name: 'Online Shopping Scams',
        platform: 'facebook',
        members: '18.9k',
        description: 'Spotting fake e-commerce and marketplace scams',
        link: 'https://facebook.com/groups/OnlineShoppingScams',
        icon: 'facebook',
        category: 'ecommerce'
      },
      {
        id: '6',
        name: 'Job Scam Watch',
        platform: 'telegram',
        members: '12.4k',
        description: 'Identifying fake job offers and recruitment scams',
        link: 'https://t.me/JobScamWatch',
        icon: 'telegram',
        category: 'employment'
      },
      {
        id: '7',
        name: 'Romance Scam Victims',
        platform: 'facebook',
        members: '22.1k',
        description: 'Support group for dating scam victims',
        link: 'https://facebook.com/groups/RomanceScamVictims',
        icon: 'facebook',
        category: 'dating'
      },
      {
        id: '8',
        name: 'Banking Scam Alerts',
        platform: 'whatsapp',
        members: '9.3k',
        description: 'Real-time alerts about banking and phishing scams',
        link: 'https://chat.whatsapp.com/BankingScamAlerts',
        icon: 'whatsapp',
        category: 'financial'
      }
    ]
  };

  const categories = [
    { id: 'all', name: 'All Groups' },
    { id: 'official', name: 'Official', icon: 'verified' },
    { id: 'local', name: 'Local', icon: 'map-marker' },
    { id: 'financial', name: 'Financial', icon: 'currency-usd' },
    { id: 'technical', name: 'Technical', icon: 'shield-lock' },
    { id: 'crypto', name: 'Crypto', icon: 'bitcoin' }
  ];

  const filteredGroups = groupsData.all.filter(group => {
    const matchesCategory = activeFilter === 'all' || group.category === activeFilter;
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         group.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleGroupPress = (link) => {
    Linking.openURL(link).catch(err => {
      console.error("Failed to open URL:", err);
      alert("Couldn't open the group link. Please try again later.");
    });
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'facebook': return <Feather name="facebook" size={20} color="#1877F2" />;
      case 'whatsapp': return <Feather name="whatsapp" size={20} color="#25D366" />;
      case 'telegram': return <Feather name="send" size={20} color="#0088CC" />;
      case 'instagram': return <Feather name="instagram" size={20} color="#E4405F" />;
      case 'discord': return <MaterialCommunityIcons name="discord" size={20} color="#5865F2" />;
      default: return <Feather name="users" size={20} color="#3498db" />;
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'facebook': return '#1877F2';
      case 'whatsapp': return '#25D366';
      case 'telegram': return '#0088CC';
      case 'instagram': return '#E4405F';
      case 'discord': return '#5865F2';
      default: return '#3498db';
    }
  };

  const renderGroupItem = ({ item }) => (
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
              {item.platform.charAt(0).toUpperCase() + item.platform.slice(1)}
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
      <ScrollView 
        style={styles.container}
        stickyHeaderIndices={[1]} // Makes the filter bar sticky
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Helpful Nepali Community Groups</Text>
          <Text style={styles.subtitle}>
            Connect with {groupsData.all.length}+ Nepali communities in USA
          </Text>
        </View>

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
              {groupsData.featured.map(group => (
                <TouchableOpacity
                  key={group.id}
                  style={[
                    styles.featuredCard,
                    { borderColor: getPlatformColor(group.platform) }
                  ]}
                  onPress={() => handleGroupPress(group.link)}
                >
                  <View style={styles.featuredHeader}>
                    <View style={[
                      styles.featuredIconContainer,
                      { backgroundColor: `${getPlatformColor(group.platform)}20` }
                    ]}>
                      {getPlatformIcon(group.platform)}
                    </View>
                    {group.verified && (
                      <View style={styles.featuredVerifiedBadge}>
                        <MaterialIcons name="verified" size={12} color="white" />
                      </View>
                    )}
                  </View>
                  <Text style={styles.featuredName} numberOfLines={2}>{group.name}</Text>
                  <Text style={styles.featuredMembers}>{group.members} members</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Category Filters */}
        <View style={styles.filterContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.filterButton,
                  activeFilter === category.id && styles.activeFilter
                ]}
                onPress={() => setActiveFilter(category.id)}
              >
                {category.icon && (
                  <MaterialCommunityIcons 
                    name={category.icon} 
                    size={16} 
                    color={activeFilter === category.id ? 'white' : '#3498db'} 
                    style={styles.filterIcon} 
                  />
                )}
                <Text style={[
                  styles.filterText,
                  activeFilter === category.id && styles.activeFilterText
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* All Groups */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {activeFilter === 'all' ? 'All Communities' : `${categories.find(c => c.id === activeFilter).name} Communities`}
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