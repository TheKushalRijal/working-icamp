import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface TopNavProps {
  setModalVisible: (visible: boolean) => void;
  setNewExpenseModalVisible: (visible: boolean) => void;
}

const TopNav: React.FC<TopNavProps> = ({ setModalVisible, setNewExpenseModalVisible }) => {
  const navigation = useNavigation();

  return (
    <View>
      {/* App Navigation Bar */}
      
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.navButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Split Bills</Text>
        <View style={{ width: 24 }} />
      </View>
      
      {/* Split Bills Action Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.icon}>👤</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>Split the bills with friends</Text>
        
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.icon}>🔄</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={() => setNewExpenseModalVisible(true)}
        >
          <Text style={styles.icon}>➕</Text>
        </TouchableOpacity>
      </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  iconButton: {
    padding: 10,
  },
  icon: {
    fontSize: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
});

export default TopNav;
