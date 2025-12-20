import React, { useEffect, useState } from "react";
import { View, Text, Button, Modal, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MMKV } from "react-native-mmkv";
import { BASE_URL } from "@env";
import axios from "axios";
import SQLite from 'react-native-sqlite-storage';
import Icon from 'react-native-vector-icons/FontAwesome';


//const db = initDB();
// University data with IDs
const universities = [
  { id: 1, name: "University of Texas at Arlington" },
  { id: 2, name: "Texas State University" },
  { id: 3, name: "Dallas Community College" },
  { id: 4, name: "Texas A&M University" },
  { id: 5, name: "Texas Tech University" },
];

// Only certain universities are selectable (by ID)
const selectableUniversities = [1]; // IDs of selectable universities

interface UniversitySelectorProps {
  selectedUniversityId: number;
  onSelectUniversity: (universityId: number) => void;
}

const UniversitySelector: React.FC<UniversitySelectorProps> = ({
  selectedUniversityId,
  onSelectUniversity,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUniversity, setCurrentUniversity] = useState<string>("");

  // Load selected university name from AsyncStorage on mount
  useEffect(() => {
    const loadSelectedUniversity = async () => {
      try {
        const storedId = await AsyncStorage.getItem("@selected_university");
        if (storedId) {
          const uniId = parseInt(storedId, 10);
          const uni = universities.find(u => u.id === uniId);
          if (uni) setCurrentUniversity(uni.name);
        }
      } catch (error) {
        console.error("Error loading selected university", error);
      }
    };

    loadSelectedUniversity();
  }, []);

  // Handle selection + save in AsyncStorage
  const handleSelect = async (uniId: number) => {
    if (selectableUniversities.includes(uniId)) {
      try {
        await AsyncStorage.setItem("@selected_university", uniId.toString());
        const uni = universities.find(u => u.id === uniId);
        if (uni) setCurrentUniversity(uni.name);
        onSelectUniversity(uniId);
        setModalVisible(false);
      } catch (error) {
        console.error("Error saving university selection", error);
      }
    } else {
      console.log("This university is not selectable.");
    }
  };

  // Function for saving university data

  
  return (
    <View>
      <Text style={styles.label}>University</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[
              styles.inputText,
              !currentUniversity && styles.placeholder,
             ]}>
              {currentUniversity || "Select a university"}
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
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => {
    const disabled = !selectableUniversities.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.modalItem, disabled && styles.disabledItem]}
        disabled={disabled}
        onPress={() => handleSelect(item.id)}
      >
        <Text style={[styles.modalItemText, disabled && styles.disabledText]}>
          {item.name}
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
  label: { fontSize: 14, marginBottom: 2 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 4,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: { fontSize: 14 },
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