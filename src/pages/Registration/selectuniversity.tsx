import React, { useEffect, useState } from "react";
import { View, Text, Button, Modal, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MMKV } from "react-native-mmkv";
import { BASE_URL } from "@env";
import axios from "axios";
import SQLite from 'react-native-sqlite-storage';
import Icon from 'react-native-vector-icons/FontAwesome';


//const db = initDB();


const universities = [
  "University of Texas at Arlington",
  "Texas State University",
  "Dallas Community College",
  "Texas A&M University",
  "Texas Tech University",
];

const selectableUniversities = ["University of Texas at Arlington"];








interface UniversitySelectorProps {
  selectedUniversity: string;
  onSelectUniversity: (university: string) => void;
}

const UniversitySelector: React.FC<UniversitySelectorProps> = ({
  selectedUniversity,
  onSelectUniversity,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

 

  // Handle selection + save in AsyncStorage
  const handleSelect = async (uni: string) => {
    if (selectableUniversities.includes(uni)) {
      try {
        await AsyncStorage.setItem("@selected_university", uni);
        onSelectUniversity(uni);
        setModalVisible(false);
      } catch (error) {
        console.error("Error saving university selection", error);
      }
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