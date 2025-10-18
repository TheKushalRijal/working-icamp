import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface TopNavProps {
  title: string;
  rightAction?: React.ReactNode;
}

const TopNav: React.FC<TopNavProps> = ({ title, rightAction }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.topNav}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.navButton}>←</Text>
      </TouchableOpacity>
      <Text style={styles.navTitle}>{title}</Text>
      {rightAction ? <View>{rightAction}</View> : <View style={{ width: 24 }} />}
    </View>
  );
};

const styles = StyleSheet.create({
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#11182e',
    paddingTop: 30,
    paddingBottom: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 3,
    borderBottomColor: '#dc143c',
  },
  navButton: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  navTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default TopNav;
