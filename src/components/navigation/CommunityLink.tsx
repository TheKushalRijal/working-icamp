import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

const CommunityLinks: React.FC = () => {
  const navigation = useNavigation<any>(); // Add typing if you have defined your navigation types

  const links = [
    { name: 'Ride Share', icon: 'home', route: 'Rides' },
    { name: 'Events', icon: 'calendar', route: 'Events' },
    { name: 'Housing', icon: 'home', route: 'Housing' },
    { name: 'Jobs', icon: 'briefcase', route: 'Jobs' },
    { name: 'Marketplace', icon: 'shopping-bag', route: 'Marketplace' },
    { name: 'Resources', icon: 'book', route: 'Resources' },
  ];

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {links.map((link, index) => (
          <TouchableOpacity
            key={index}
            style={styles.linkButton}
            onPress={() => navigation.navigate(link.route)}
            activeOpacity={0.7}
          >
            <Icon name={link.icon} size={16} color="#fff" style={styles.icon} />
            <Text style={styles.linkText}>{link.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: '#11182e', // Dark background to match header
  },
  container: {
    flexGrow: 0,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent white
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  icon: {
    marginRight: 6,
  },
  linkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CommunityLinks;
