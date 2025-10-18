import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList,
  Image,
  TextInput,
  Modal,
  SafeAreaView,
  Dimensions,
  Animated
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TopNav from '../../components/navigation/TopNav';

const { width } = Dimensions.get('window');

interface ScamData {
  id: string;
  name: string;
  description: string;
  status: 'review' | 'confirmed' | 'low';
  avatar: string | null;
  type: string;
  lastReported: string;
  reports: number;
}

interface ReportForm {
  name: string;
  description: string;
  tags: string[];
  image: string | null;
}

// Single default data entry that will be used for all scam reports
const DEFAULT_SCAM_DATA = {
  id: 'default',
  name: 'Reported Scam',
  description: 'This is a reported scam. Click to view details and report.',
  status: 'review',
  avatar: null,
  type: 'general',
  lastReported: 'Just now',
  reports: 1
};

const ScamShieldApp = () => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState<ReportForm>({
    name: '',
    description: '',
    tags: [],
    image: null,
  });
  const [selectedProfile, setSelectedProfile] = useState<ScamData | null>(null);
  
  // Animation setup for TopNav
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, -80],
    extrapolate: 'clamp',
  });
  
  // Use the default data for all entries
  const scammerProfiles: ScamData[] = Array(6).fill(DEFAULT_SCAM_DATA).map((item, index) => ({
    ...item,
    id: `default-${index + 1}` // Give each entry a unique ID
  }));

  const handleReportSubmit = () => {
    // Handle form submission
    console.log('Report submitted:', reportForm);
    setShowReportModal(false);
    setReportForm({
      name: '',
      description: '',
      tags: [],
      image: null,
    });
  };

  const renderProfileItem = ({ item }: { item: ScamData }) => (
    <TouchableOpacity 
      style={styles.profileItem} 
      onPress={() => setSelectedProfile(item)}
      activeOpacity={0.7}
    >
      <View style={[
        styles.avatarContainer,
        item.status === 'confirmed' && styles.confirmedBorder,
        item.status === 'review' && styles.reviewBorder,
        item.status === 'low' && styles.lowBorder,
      ]}>
        <MaterialIcons name="account-circle" size={40} color="#95a5a6" />
      </View>
    </TouchableOpacity>
  );

  const renderScammerCard = ({ item }: { item: ScamData }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.8}
      onPress={() => setSelectedProfile(item)}
    >
      <View style={styles.cardContent}>
       
        <View style={styles.cardText}>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
          <Text style={styles.cardReports}>{item.reports} report</Text>
        </View>
        <View style={styles.cardFlag}>
          {item.status === 'confirmed' && (
            <FontAwesome name="flag" size={16} color="#e74c3c" />
          )}
        </View>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.viewReportText}>View Full Report</Text>
        <Ionicons name="chevron-forward" size={16} color="#3498db" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Navigation Bar */}
        <TopNav
          title={
            <View style={styles.headerContent}>
              <Text style={styles.appTitle}>Scams Case</Text>
              <TouchableOpacity 
                style={styles.reportButton}
                onPress={() => setShowReportModal(true)}
              >
                <Ionicons name="add" size={20} color="white" />
                <Text style={styles.reportButtonText}>Report</Text>
              </TouchableOpacity>
            </View>
          }
          animatedStyle={{ transform: [{ translateY: headerTranslateY }] }}
        />

        {/* Informational Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            Help Protect other students from getting scammed.
          </Text>
        </View>

        <Animated.ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16 }}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } }}],
            { useNativeDriver: true }
          )}
        >
          <View style={{ paddingTop: 0 }}>
            {/* Profile Strip */}
            <View style={styles.profileStrip}>
          <Text style={styles.sectionTitle}>Recent Reports</Text>
          <FlatList
            horizontal
            data={scammerProfiles}
            renderItem={renderProfileItem}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.profileList}
          />
        </View>

        {/* Scammer Cards */}
        <View style={styles.scammerCards}>
          <Text style={styles.sectionTitle}>Avoid These Stores</Text>
          <FlatList
            data={scammerProfiles}
            renderItem={renderScammerCard}
            keyExtractor={item => item.id}
            numColumns={2}
            columnWrapperStyle={styles.cardRow}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Report Modal */}
        <Modal
          visible={showReportModal}
          animationType="slide"
          transparent={false}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Report a Scammer</Text>
              <TouchableOpacity onPress={() => setShowReportModal(false)}>
                <Ionicons name="close" size={24} color="#7f8c8d" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Name / Alias</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter scammer's name or alias"
                  value={reportForm.name}
                  onChangeText={(text) => setReportForm({...reportForm, name: text})}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe the scam"
                  multiline
                  numberOfLines={4}
                  value={reportForm.description}
                  onChangeText={(text) => setReportForm({...reportForm, description: text})}
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Upload Screenshot</Text>
                <TouchableOpacity style={styles.uploadButton}>
                  <Ionicons name="cloud-upload" size={24} color="#3498db" />
                  <Text style={styles.uploadText}>Tap to upload</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Tags</Text>
                <View style={styles.tagsContainer}>
                  {['Crypto', 'Phishing', 'Job', 'Romance'].map(tag => (
                    <TouchableOpacity 
                      key={tag} 
                      style={[
                        styles.tag,
                        reportForm.tags.includes(tag) && styles.tagSelected
                      ]}
                      onPress={() => {
                        if (reportForm.tags.includes(tag)) {
                          setReportForm({
                            ...reportForm,
                            tags: reportForm.tags.filter(t => t !== tag)
                          });
                        } else {
                          setReportForm({
                            ...reportForm,
                            tags: [...reportForm.tags, tag]
                          });
                        }
                      }}
                    >
                      <Text style={styles.tagText}>{tag}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[
                  styles.submitButton,
                  (!reportForm.name || !reportForm.description) && styles.submitButtonDisabled
                ]}
                onPress={handleReportSubmit}
                disabled={!reportForm.name || !reportForm.description}
              >
                <Text style={styles.submitButtonText}>Submit Report</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>

        {/* Profile Preview Modal */}
        <Modal
          visible={!!selectedProfile}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.profileModalContainer}>
            <View style={styles.profileModalContent}>
              <TouchableOpacity 
                style={styles.closeModalButton}
                onPress={() => setSelectedProfile(null)}
              >
                <Ionicons name="close" size={24} color="#7f8c8d" />
              </TouchableOpacity>
              
              {selectedProfile && (
                <>
                  <View style={styles.profileModalAvatarContainer}>
                    <MaterialIcons name="account-circle" size={80} color="#95a5a6" />
                  </View>
                  
                  <Text style={styles.profileName}>{selectedProfile.name}</Text>
                  
                  
                  <View style={styles.profileDetails}>
                    <Text style={styles.detailTitle}>Report Summary</Text>
                    <Text style={styles.detailText}>{selectedProfile.description}</Text>
                    
                  </View>
                  
                  
                </>
              )}
            </View>
              </View>
            </Modal>
          </View>
        </Animated.ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  container: {
    flex: 1,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  appTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 24,
    fontWeight: '600',
    color: '#2c3e50',
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  reportButtonText: {
    color: 'white',
    marginLeft: 6,
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
  },
  banner: {
    backgroundColor: '#d6eaf8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  bannerText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#2c3e50',
    lineHeight: 22,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  profileStrip: {
    marginBottom: 24,
  },
  profileList: {
    paddingRight: 16,
  },
  profileItem: {
    marginRight: 12,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f5f6fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  confirmedBorder: {
    borderWidth: 3,
    borderColor: '#e74c3c',
  },
  reviewBorder: {
    borderWidth: 3,
    borderColor: '#f39c12',
  },
  lowBorder: {
    borderWidth: 3,
    borderColor: '#95a5a6',
  },
  scammerCards: {
    flex: 1,
  },
  cardRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: (width - 48) / 2,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardAvatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f5f6fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardText: {
    flex: 1,
  },
  cardName: {
    fontFamily: 'Roboto-Bold',
    fontSize: 14,
    color: '#2c3e50',
  },
  cardDescription: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: '#7f8c8d',
  },
  cardFlag: {
    marginLeft: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  viewReportText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: '#3498db',
    marginRight: 4,
  },
  cardReports: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: '#e74c3c',
    marginTop: 4
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  modalTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  uploadButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ecf0f1',
    borderStyle: 'dashed',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: '#3498db',
    marginTop: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#ecf0f1',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagSelected: {
    backgroundColor: '#3498db',
  },
  tagText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: '#2c3e50',
  },
  tagTextSelected: {
    color: 'white',
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  submitButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  submitButtonText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: 'white',
  },
  // Profile modal styles
  profileModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  profileModalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    alignItems: 'center',
  },
  closeModalButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  profileModalAvatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f5f6fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
  },
  profileName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  profileStatus: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 16,
  },
  profileDetails: {
    width: '100%',
    marginBottom: 16,
  },
  detailTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 4,
  },
  detailText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
  },
  viewFullButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    alignItems: 'center',
  },
  viewFullButtonText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: 'white',
  },
});

export default ScamShieldApp;