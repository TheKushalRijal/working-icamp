import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Dimensions,
  SafeAreaView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import TopNav from '../components/navigation/TopNav'; // Adjust path if needed

const { width } = Dimensions.get('window');

const Outside = () => {
  const openMap = () => {
    Linking.openURL('https://maps.google.com/maps?q=University%20of%20Texas%20at%20Arlington');
  };

  const handleEnrollPress = () => {
    // Add your enrollment logic here
    console.log('Enroll button pressed');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopNav title="UTA Info" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Welcome Section */}
        <LinearGradient
          colors={['#2563eb', '#3b82f6']}
          style={styles.welcomeSection}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.welcomeTitle}>Welcome to the University of Texas at Arlington</Text>
          <Text style={styles.welcomeText}>
            Discover everything you need to know before applying – from campus life to facilities, community, and more!
          </Text>
        </LinearGradient>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Founded</Text>
            <Text style={styles.statValue}>1895</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Nepali Students</Text>
            <Text style={styles.statValue}>300+</Text>
          </View>
          <View style={[styles.statCard, { width: width * 0.9 - 32 }]}>
            <Text style={styles.statLabel}>Campus Size</Text>
            <Text style={styles.statValue}>420 Acres</Text>
          </View>
        </View>

        {/* Campus Images */}
        <Text style={styles.sectionTitle}>Campus Images</Text>
        <View style={styles.imageGrid}>
          <Image
            source={{ uri: 'https://pa-hrsuite-production.s3.amazonaws.com/2918/docs/457750.jpg' }}
            style={styles.campusImage}
            resizeMode="cover"
          />
          <Image
            source={{ uri: 'https://utamavs.com/images/2021/9/2/College_Park_Center_District.jpg' }}
            style={styles.campusImage}
            resizeMode="cover"
          />
        </View>

        {/* Location Section */}
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.locationCard}>
          <Text style={styles.locationText}>
            701 S. Nedderman Drive, Arlington, TX 76019{'\n'}
            Dallas-Fort Worth Metroplex
          </Text>
          <TouchableOpacity 
            style={styles.mapContainer}
            onPress={openMap}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: 'https://maps.googleapis.com/maps/api/staticmap?center=University+of+Texas+at+Arlington&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7CUniversity+of+Texas+at+Arlington&key=YOUR_API_KEY' }}
              style={styles.mapImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>

        {/* Community Section */}
        <View style={styles.communityCard}>
          <Text style={styles.sectionTitle}>Community</Text>
          <Text style={styles.communityText}>
            Diverse community with students from 50 states and 100+ countries.{'\n'}
            300+ student organizations and 15:1 student-faculty ratio.
          </Text>
        </View>

        {/* Facilities Section */}
        <Text style={styles.sectionTitle}>Facilities</Text>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.facilitiesContainer}
        >
          <View style={styles.facilityCard}>
            <Image
              source={{ uri: 'https://henselphelps.com/wp-content/uploads/2017/08/UT-Arlington-ERC-3_cropped-1024x684-1024x684.jpg' }}
              style={styles.facilityImage}
              resizeMode="cover"
            />
            <Text style={styles.facilityLabel}>Advanced Research Labs</Text>
          </View>
          <View style={styles.facilityCard}>
            <Image
              source={{ uri: 'https://www.uta.edu/utamagazine/winter-2008/images/MAC_final.jpg' }}
              style={styles.facilityImage}
              resizeMode="cover"
            />
            <Text style={styles.facilityLabel}>Athletic Facilities</Text>
          </View>
          <View style={styles.facilityCard}>
            <Image
              source={{ uri: 'https://libraries.uta.edu/sites/default/files/styles/1920/public/2024-12/uta-aerial.jpg?itok=KWbwikid' }}
              style={styles.facilityImage}
              resizeMode="cover"
            />
            <Text style={styles.facilityLabel}>Modern Library</Text>
          </View>
        </ScrollView>

        {/* Enrollment Section */}
        <View style={styles.enrollmentCard}>
          <Text style={styles.sectionTitle}>Class Enrolment</Text>
          <View style={styles.enrollmentContent}>
            <View>
              <Text style={styles.enrollmentSubtitle}>Start date</Text>
              <Text style={styles.enrollmentItem}>• Fall: August 19</Text>
              <Text style={styles.enrollmentItem}>• Spring: January 8</Text>
            </View>
            <TouchableOpacity 
              style={styles.enrollButton}
              onPress={handleEnrollPress}
              activeOpacity={0.7}
            >
              <Text style={styles.enrollButtonText}>Enroll for classes as fast as possible</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  welcomeSection: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    width: width * 0.43,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
    marginTop: 8,
  },
  imageGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  campusImage: {
    width: width * 0.47,
    height: 120,
    borderRadius: 12,
  },
  locationCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  locationText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 12,
  },
  mapContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: 150,
  },
  communityCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  communityText: {
    fontSize: 14,
    color: '#374151',
  },
  facilitiesContainer: {
    paddingBottom: 8,
  },
  facilityCard: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    width: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  facilityImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  facilityLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  enrollmentCard: {
    backgroundColor: '#ebf5ff',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  enrollmentContent: {
    marginTop: 8,
  },
  enrollmentSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  enrollmentItem: {
    fontSize: 13,
    color: '#374151',
    marginLeft: 8,
  },
  enrollButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  enrollButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Outside;