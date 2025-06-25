import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather'; // Feather has similar icons like lucide-react

const tabs = [
  { name: 'Home', icon: 'home', route: 'ZZ' },
  { name: 'Housings', icon: 'message-circle', route: 'Housings' },
  { name: 'UTA seniors', icon: 'calendar', route: 'Events' },
  { name: 'Profile', icon: 'user', route: 'Profile' },
];

const BottomNav = () => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={styles.container}>
      {tabs.map(({ name, icon, route: tabRoute }) => {
        const isActive = route.name === tabRoute;

        return (
          <TouchableOpacity
            key={tabRoute}
            onPress={() => navigation.navigate(tabRoute)}
            style={styles.tabButton}
          >
            <Icon
              name={icon}
              size={24}
              color={isActive ? '#38B2AC' : '#6B7280'} // teal or gray
            />
            <Text style={[styles.tabText, isActive && { color: '#38B2AC' }]}>
              {name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB', // gray-200
    paddingVertical: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  tabButton: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: '#6B7280', // gray-600
  },
});

export default BottomNav;
