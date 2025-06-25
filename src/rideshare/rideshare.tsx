import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
//import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
          <Text style={styles.title}>Riders</Text>
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
          <View style={styles.mapOverlay}>
            <Text style={styles.mapOverlayText}>UTA Campus Map</Text>
          </View>
        </View>

        {/* Nearby Locations Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.subheading}>Nearby Locations</Text>
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
                  <Text style={styles.joinButtonText}>Join</Text>
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
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
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
    marginBottom: 24,
  },
  locationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  distanceText: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  joinButton: {
    backgroundColor: '#4A90E2',
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
    marginTop: 8,
  },
  privacyText: {
    color: '#7F8C8D',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});

export default RidersApp;