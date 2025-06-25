import React from 'react';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';

const TopNav: React.FC = () => {
  return (
    <View style={styles.header}>
      {/* You can add logo, icons, or title here */}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#fff',
    zIndex: 40,
    justifyContent: 'center',
    paddingHorizontal: 16,
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
});

export default TopNav;
