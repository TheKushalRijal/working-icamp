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
import RidersApp from '../../rideshare/rideshare';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import AsyncStorage from '@react-native-async-storage/async-storage';
import SQLite from 'react-native-sqlite-storage';
import type { SQLError } from 'react-native-sqlite-storage';

const IconSets = {
 AntDesign,
  Feather,
  Ionicons,
  MaterialIcons,
}as const;

const CommunityLinks: React.FC = () => {
  const navigation = useNavigation<any>(); // Add typing if you have defined your navigation types

  const links = [
    { name: 'Docs', iconSet: 'AntDesign', iconName: 'car', route: 'Docs' },
    { name: 'Ride Share', iconSet: 'AntDesign', iconName: 'car', route: 'Rides' },
    { name: 'Logout', iconSet: 'MaterialIcons', iconName: 'login', route: 'Login' },
    { name: 'Bills', iconSet: 'Feather', iconName: 'home', route: 'lawyers' },
  ]as const;

const clearAsyncStorage = async (): Promise<void> => {
  try {
    // Clear AsyncStorage
    await AsyncStorage.clear();
    console.log('AsyncStorage cleared successfully');

    // Clear SQLite database
    const db = await SQLite.openDatabase({ 
      name: 'university.db',
      location: 'default' 
    });

    // Drop all tables
    await new Promise<void>((resolve, reject) => {
      db.transaction((tx: SQLite.Transaction) => {
        // This query will get all table names in the database
        tx.executeSql(
          "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'",
          [],
          (_: SQLite.Transaction, result: SQLite.ResultSet) => {
            // For each table found, drop it
            for (let i = 0; i < result.rows.length; i++) {
              const tableName = result.rows.item(i).name;
              tx.executeSql(
                `DROP TABLE IF EXISTS ${tableName}`,
                [],
                () => console.log(`Table ${tableName} dropped`),
                (_, error) => {
                  console.error(`Error dropping table ${tableName}:`, error);
                  return false;
                }
              );
            }
          }
        );
      },
      (error: SQLite.SQLError) => {
        console.error('Database clear error:', error);
        reject(error);
      },
      () => {
        console.log('Database completely cleared');
        resolve();
      });
    });

  } catch (error) {
    console.error('Error clearing data:', error);
  }
};




  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {links.map((link, index) => {
  const IconComponent = IconSets[link.iconSet] || Feather; // fallback
  return (
    <TouchableOpacity
      key={index}
      style={styles.linkButton}
      onPress={() => {
        if (link.name === 'Logout') {
          clearAsyncStorage();
        }
        navigation.navigate(link.route);
      }}
      activeOpacity={0.7}
    >
      <IconComponent name={link.iconName} size={16} color="#fff" style={styles.icon} />
      <Text style={styles.linkText}>{link.name}</Text>
    </TouchableOpacity>
  );
})}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: '#11182e',
  },

  container: {
    flexGrow: 0,
  },

  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 5,
  },

  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    marginRight: 10,

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },

  icon: {
    marginRight: 6,
  },

  linkText: {
    color: '#e5e7eb',
    fontSize: 13,
    fontWeight: '600',
  },

  /* Logout */
  dangerButton: {
    backgroundColor: 'rgba(220,38,38,0.15)',
    borderColor: 'rgba(220,38,38,0.35)',
  },

  dangerText: {
    color: '#fca5a5',
  },
});


export default CommunityLinks;
