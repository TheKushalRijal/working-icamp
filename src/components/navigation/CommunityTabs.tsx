import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

type TabType = 'your-community' | 'campus-community';

interface CommunityTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const CommunityTabs: React.FC<CommunityTabsProps> = ({ activeTab, onTabChange }) => {
  const screenWidth = Dimensions.get('window').width;
  const tabWidth = (screenWidth - 32) / 2; // Full width minus margins

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            { width: tabWidth },
            activeTab === 'your-community' && styles.activeTab,
            activeTab === 'your-community' && styles.activeTabLeft
          ]}
          onPress={() => onTabChange('your-community')}
        >
          <Text 
            style={[
              styles.tabText,
              activeTab === 'your-community' && styles.activeTabText
            ]}
            numberOfLines={1}
          >
            Your Community
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            { width: tabWidth },
            activeTab === 'campus-community' && styles.activeTab,
            activeTab === 'campus-community' && styles.activeTabRight
          ]}
          onPress={() => onTabChange('campus-community')}
        >
          <Text 
            style={[
              styles.tabText,
              activeTab === 'campus-community' && styles.activeTabText
            ]}
            numberOfLines={1}
          >
            Campus Community
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 2,
    height: 36,
  },
  tab: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    height: '100%',
  },
  activeTab: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  activeTabLeft: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  activeTabRight: {
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4b5563',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#38B2AC',
  },
});

export default CommunityTabs; 