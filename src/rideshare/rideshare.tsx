import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
//import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TopNav from '../components/TopNav';
import BottomNav from '../components/navigation/BottomNav';


const RidersApp = () => {
  const nearbyLocations = [
    { from: 'University Center', to: 'College Park', distance: '1.2 mi', available: true },
    { from: 'Central Library', to: 'Engineering Research', distance: '0.8 mi', available: false },
    { from: 'Maverick Stadium', to: 'Science Hall', distance: '1.5 mi', available: true },
    { from: 'The Commons', to: 'Fine Arts Building', distance: '0.6 mi', available: true },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>RIde Help</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add-circle" size={32} color="#4A90E2" />
          </TouchableOpacity>
        </View>

        <View style={styles.warningContainer}>
          <MaterialIcons name="warning" size={16} color="#FF6B6B" />
          <Text style={styles.warningText}>
            Use of this app is forbidden for commercial income purpose. For UTA students only.
          </Text>
        </View>

        {/* Map Section */}
        <View style={styles.mapContainer}>
          <Image
            source={{ uri: 'https://maps.googleapis.com/maps/api/staticmap?center=University+of+Texas+Arlington&zoom=15&size=800x400&maptype=roadmap&markers=color:red%7CUniversity+of+Texas+Arlington&key=YOUR_API_KEY' }}
            style={styles.mapImage}
            resizeMode="cover"
          />
          
        </View>

        {/* Nearby Locations Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.subheading}>Recent Request</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.locationsList}>
          {nearbyLocations.map((location, index) => (
            <View key={index} style={styles.locationCard}>
              <View style={styles.locationInfo}>
                <View style={styles.locationPin}>
                  <Ionicons name="location" size={20} color="#4A90E2" />
                </View>
                <View>
                  <Text style={styles.routeText}>
                    {location.from} to {location.to}
                  </Text>
                  <Text style={styles.distanceText}>
                    {location.distance} away from here
                  </Text>
                </View>
              </View>
              {location.available && (
                <TouchableOpacity style={styles.joinButton}>
                  <Text style={styles.joinButtonText}>Accept</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.privacyButton}>
          <Text style={styles.privacyText}>Privacy Policy</Text>
        </TouchableOpacity>
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2C3E50',
  },
  addButton: {
    padding: 4,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3F3',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  warningText: {
    fontSize: 12,
    color: '#FF6B6B',
    marginLeft: 8,
    flex: 1,
  },
  mapContainer: {
  height: 500, // or whatever taller height you want
  borderRadius: 5,
  overflow: 'hidden',
  marginBottom: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},
mapImage: {
  width: '100%',
  height: '100%', // match container height
},

  mapOverlayText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subheading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
  },
  seeAllText: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '600',
  },
  locationsList: {
    marginBottom: 20,
  },
   locationCard: {
  backgroundColor: '#fff',
  borderRadius: 10,
  paddingVertical: 10,
  paddingHorizontal: 14,
  marginBottom: 10,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 2, // Slightly higher for Android depth
  borderWidth: 0.3,
  borderColor: '#e0e0e0',
  minHeight: 60,
},
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationPin: {
    marginRight: 12,
  },
  routeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  distanceText: {
    fontSize: 14,
    color: 'black',
  },
  joinButton: {
    backgroundColor: '#11182e',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  privacyButton: {
    alignSelf: 'center',
    marginTop: -15,
  },
  privacyText: {
    color: 'black',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});

export default RidersApp;