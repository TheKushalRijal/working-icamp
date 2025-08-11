import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

const universities = [
  "University of Texas at Arlington",
  "Texas State University",
  "Dallas Community College",
  "Texas A&M University",
  "Texas Tech University",
];

const selectableUniversities = [
  "University of Texas at Arlington",
 
];

interface UniversitySelectorProps {
  selectedUniversity: string;
  onSelectUniversity: (university: string) => void;
}

const UniversitySelector: React.FC<UniversitySelectorProps> = ({
  selectedUniversity,
  onSelectUniversity,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

 
const handleSelect = async (uni: string) => {
  if (selectableUniversities.includes(uni)) {
    try {
      await AsyncStorage.setItem('@selected_university', uni);
    } catch (error) {
      console.error('Failed to save selected university', error);
    }
    onSelectUniversity(uni);
    setModalVisible(false);
  }
};








  return (
    <View>
      <Text style={styles.label}>University</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.inputText, !selectedUniversity && styles.placeholder]}>
          {selectedUniversity || "Select a university"}
        </Text>
        <Icon name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={universities}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const disabled = !selectableUniversities.includes(item);
                return (
                  <TouchableOpacity
                    style={[styles.modalItem, disabled && styles.disabledItem]}
                    disabled={disabled}
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={[styles.modalItemText, disabled && styles.disabledText]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={{ color: 'red', textAlign: 'center' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  label: { fontSize: 14, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: { fontSize: 16 },
  placeholder: { color: '#999' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 12,
    maxHeight: '60%',
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  disabledItem: {
    backgroundColor: '#f9f9f9',
  },
  modalItemText: {
    fontSize: 16,
  },
  disabledText: {
    color: '#999',
  },
  closeButton: {
    padding: 12,
  },
});

export default UniversitySelector;
