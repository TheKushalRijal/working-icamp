import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

interface TopNavProps {
  title?: string;
  showBackButton?: boolean;
  rightAction?: React.ReactNode;
}

const TopNav: React.FC<TopNavProps> = ({ 
  title = 'Nepali Student Hub', 
  showBackButton = false,
  rightAction 
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <View style={styles.navContent}>
        {showBackButton && (
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="chevron-left" size={24} color="white" />
          </TouchableOpacity>
        )}

        <Text style={styles.title}>{title}</Text>

        <View style={styles.rightActionContainer}>
          {rightAction || <View style={{ width: 24 }} />}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#11182e', // Dark background
    borderBottomWidth: 3,
    borderBottomColor: '#dc143c',
    paddingTop: 70, // Adjust for status bar
    paddingBottom: 15,
    paddingHorizontal: 16,
  },
  navContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: -110,  // This will shift everything slightly left
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  rightActionContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
});

export default TopNav;