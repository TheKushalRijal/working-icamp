import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
  Dimensions,
  KeyboardAvoidingView,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

type RootStackParamList = {
  Outside: undefined;
  // Add other screen params as needed
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width, height } = Dimensions.get('window');

const universities = [
  "University of Texas at Arlington",
  "Texas State University",
  "Dallas Community College",
  "University of Texas at Austin",
  "University of Texas at Dallas",
  "Texas A&M University",
  "Texas Tech University",
];

const selectableUniversities = [
  "University of Texas at Arlington",
];

const UniversitySelection: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelection = () => {
    if (selectableUniversities.includes(selectedUniversity)) {
      navigation.navigate('Outside');
    }
  };

  const handleUniversitySelect = (uni: string) => {
    if (selectableUniversities.includes(uni)) {
      setSelectedUniversity(uni);
    }
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.card}>
              <Text style={styles.title}>Select Your University</Text>
              
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.pickerButtonText,
                    !selectedUniversity && styles.placeholderText
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {selectedUniversity || "Select a university"}
                </Text>
                <Icon name="chevron-down" size={24} color="#6b7280" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  !selectableUniversities.includes(selectedUniversity) && styles.buttonDisabled
                ]}
                onPress={handleSelection}
                disabled={!selectableUniversities.includes(selectedUniversity)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.buttonText,
                  !selectableUniversities.includes(selectedUniversity) && styles.buttonTextDisabled
                ]}>
                  Continue
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select University</Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                  activeOpacity={0.7}
                >
                  <Icon name="x" size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>
              <ScrollView 
                style={styles.modalList}
                keyboardShouldPersistTaps="handled"
              >
                {universities.map((uni) => (
                  <TouchableOpacity
                    key={uni}
                    style={[
                      styles.modalItem,
                      !selectableUniversities.includes(uni) && styles.modalItemDisabled
                    ]}
                    onPress={() => handleUniversitySelect(uni)}
                    disabled={!selectableUniversities.includes(uni)}
                    activeOpacity={0.7}
                  >
                    <Text 
                      style={[
                        styles.modalItemText,
                        !selectableUniversities.includes(uni) && styles.modalItemTextDisabled
                      ]}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {uni}
                    </Text>
                    {selectedUniversity === uni && (
                      <Icon name="check" size={20} color="#2563eb" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#93c5fd',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#93c5fd',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    minHeight: height - (Platform.OS === 'android' ? 25 : 0), // Adjust for Android status bar
  },
  card: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'white',
    minHeight: 56, // Better touch target
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  placeholderText: {
    color: '#9ca3af',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 16, // Increased padding for better touch
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  buttonDisabled: {
    backgroundColor: '#d1d5db',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextDisabled: {
    color: '#4b5563',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: height * 0.7, // Better dynamic sizing
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 8, // Larger touch area
  },
  modalList: {
    paddingHorizontal: 16,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16, // Increased padding
    paddingHorizontal: 16,
    borderRadius: 8,
    minHeight: 56, // Better touch target
  },
  modalItemDisabled: {
    opacity: 0.5,
  },
  modalItemText: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
    marginRight: 12,
  },
  modalItemTextDisabled: {
    color: '#6b7280',
  },
});

export default UniversitySelection;