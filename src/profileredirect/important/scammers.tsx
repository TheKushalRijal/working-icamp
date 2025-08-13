// NameDescriptionList.js
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput } from 'react-native';

const initialData = [
  { id: '1', name: 'Apple', description: 'A sweet red fruit', location: 'California, USA' },
  { id: '2', name: 'Banana', description: 'A long yellow fruit', location: 'Ecuador' },
  { id: '3', name: 'Carrot', description: 'An orange crunchy vegetable', location: 'Texas, USA' },
  { id: '4', name: 'Dragonfruit', description: 'A tropical fruit with vibrant skin', location: 'Vietnam' },
  { id: '5', name: 'Eggplant', description: 'A purple vegetable', location: 'India' },
];

const NameDescriptionList = () => {
  const [search, setSearch] = useState('');

  // Filter list based on search query
  const filteredData = initialData.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase()) ||
    item.location.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.location}>📍 {item.location}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.input}
        placeholder="Search by name, description, or location..."
        value={search}
        onChangeText={setSearch}
      />

      {/* List */}
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.noResults}>No matching results</Text>
        }
      />
    </View>
  );
};

export default NameDescriptionList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 12,
  },
  item: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  location: {
    fontSize: 13,
    color: '#007AFF',
    marginTop: 4,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    color: '#777',
  },
});
