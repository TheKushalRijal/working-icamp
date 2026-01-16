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
import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import axios from 'axios';
const { width } = Dimensions.get('window');
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

interface ScamData {
  id: number;
  name: string;
  description: string;
  reports: number;
}

interface ReportForm {
  name: string;
  description: string;
  phonenumber:string;
}

// Single default data entry that will be used for all scam reports
const DEFAULT_SCAM_DATA = {
  id: 'default',
  name: 'Reported Scam',
  description: 'This is a reported scam. Click to view details and report.',
  reports: 1
};

const ScamShieldApp = () => {
  const [scammerProfiles, setScammerProfiles] = useState<ScamData[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState<ReportForm>({
    name: '',
    description: '',
   phonenumber:'',
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
useEffect(() => {
  fetchScamProfiles();
}, []);







const DEV_BASE_URL = 'http://10.0.2.2:8000';



const fetchScamProfiles = async () => {
  try {
    setLoading(true);
    setError(null);

    const response = await axios.get(
  `${DEV_BASE_URL}/scam/`,
  { timeout: 5000 }
);
console.log("this is the scam data response",response.data)


setScammerProfiles(
  response.data.cases.map((item: any) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    reports: item.repoted, // map typo safely
  }))
);

} catch (err) {
    console.error(err);
    setError('Unable to load scam reports');
  } finally {
    setLoading(false);
  }
};

  const handleReportSubmit = () => {
    // Handle form submission
    console.log('Report submitted:', reportForm);
    setShowReportModal(false);
    setReportForm({
        name: '',
        description: '',
        phonenumber: '',
      });

  };

  const renderProfileItem = ({ item }: { item: ScamData }) => (
    <TouchableOpacity 
      style={styles.profileItem} 
      onPress={() => setSelectedProfile(item)}
      activeOpacity={0.7}
    >
     
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
          { (
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
        
<AnimatedFlatList
  data={scammerProfiles}
  renderItem={renderScammerCard}
  keyExtractor={(item) => item.id.toString()}
  numColumns={2}
  columnWrapperStyle={styles.cardRow}
  contentContainerStyle={styles.listContent}
  showsVerticalScrollIndicator={false}
  ListHeaderComponent={
    <Text style={styles.sectionTitle}>Avoid These Situations</Text>
  }
  ListEmptyComponent={
    <Text style={styles.emptyText}>
      No scam reports available at the moment.
    </Text>
  }
/>




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
  <Text style={styles.label}>Your Phone Number</Text>
  <TextInput
    style={styles.input}
    placeholder="Enter your number so we can contact you"
    keyboardType="phone-pad"
    value={reportForm.phonenumber}
    onChangeText={(text) =>
      setReportForm({ ...reportForm, phonenumber: text })
    }
  />
</View>

             <Text style={styles.disclaimer}>
  <Text style={styles.disclaimerBold}>DISCLAIMER:</Text>{' '}
  Do not make false or misleading claims of fraud or scam cases. Only report{' '}
  <Text style={styles.disclaimerBold}>genuine incidents</Text>{' '}
  so others in the community can stay informed and cautious. This platform is
  intended to help and protect our community.{'\n\n'}
  If you wish to contact us or discuss a report, please reach out at{' '}
  <Text style={styles.disclaimerBold}>9812121212</Text>.
</Text>


                
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
  justifyContent: 'flex-start', // ⬅ align to left
  alignItems: 'center',
  width: '100%',
  paddingHorizontal: 16,
},

disclaimer: {
  marginTop: 10,
  paddingVertical: 10,
  paddingHorizontal: 12,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: 'rgba(255,0,0,0.35)',
  backgroundColor: 'rgba(255,0,0,0.08)',

  color: '#ff3b30',
  fontSize: 12,
  fontWeight: '700',
  lineHeight: 16,
},

disclaimerBold: {
  color: '#ff3b30',
  fontWeight: '900',
},
  appTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 24,
    fontWeight: '600',
    color: '#2c3e50',
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
listContent: {
  paddingHorizontal: 16,
  paddingBottom: 24,
}
,

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
  emptyText: {
  textAlign: 'center',
  marginTop: 40,
  color: '#7f8c8d',
  fontSize: 14,
},

});

export default ScamShieldApp;