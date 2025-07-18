import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

interface TopNavProps {
  title?: React.ReactNode;
  rightAction?: React.ReactNode;
  animatedStyle?: any;
}

const TopNav: React.FC<TopNavProps> = ({ 
  title = 'Nepali Student Hub', 
  rightAction,
  animatedStyle
}) => {
  const navigation = useNavigation();

  return (
    <Animated.View style={[styles.header, animatedStyle]}>
      <View style={styles.navContent}>
        <View style={styles.leftGroup}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="chevron-left" size={24} color="white" />
          </TouchableOpacity>
          {typeof title === 'string' ? (
            <Text style={styles.title}>{title}</Text>
          ) : (
            <View style={styles.title}>{title}</View>
          )}
        </View>
        <View style={styles.rightActionContainer}>
          {rightAction || <View style={{ width: 24 }} />}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#11182e', // Dark background
    borderBottomWidth: 3,
    borderBottomColor: '#dc143c',
    paddingTop: 30, // Adjust for status bar
    paddingBottom: 15,
    paddingHorizontal: 16,
  },
  navContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 4,
  },
  rightActionContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
});

export default TopNav;