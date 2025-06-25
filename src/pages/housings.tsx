import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, FlatList, StyleSheet, Linking, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Feather from 'react-native-vector-icons/Feather';

const UTAHousingApp = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [campusFilter, setCampusFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchedPosts = [
      {
        id: 1,
        name: "Zen Apartments",
        image: "https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=MGpFE55u0nckzeo4ZkqOZQ&cb_client=search.gws-prod.gps&w=408&h=240&yaw=73.23328&pitch=0&thumbfov=100",
        price: 1300,
        website: "https://www.apartments.com/zen-arlington-tx/6k53hst/",
        campusType: "offcampus"
      },
      {
        id: 2,
        name: "Woodcrest Apartments",
        image: "https://picturescdn.alndata.com/?pid=6d9f7710-ec8e-4a0e-a83c-4f84e838a96d",
        price: 1300,
        website: "https://www.apartments.com/woodcrest-apartments-arlington-tx/xrhlc8m/",
        campusType: "offcampus"
      },
      {
        id: 3,
        name: "University Village",
        image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
        price: 1200,
        website: "https://www.uta.edu/campus-ops/housing/apartments/university-village",
        campusType: "oncampus"
      },
      {
        id: 4,
        name: "Rose Street Apartments",
        image: "https://images1.apartments.com/i2/Az5Dsna6XrRFUNiVxCNZs5l4YY0eWsRFaISw83lMXew/111/309-rose-st-arlington-tx-building-photo.jpg",
        price: 1375,
        website: "https://www.apartments.com/309-rose-st-arlington-tx/5dxb78q/",
        campusType: "offcampus"
      },
      {
        id: 5,
        name: "South Campus",
        image: "https://images1.apartments.com/i2/2BX8p4eWlSJrBojuwW0yT7YU9kWv3AGm1jswHPSoSsc/111/south-campus-apartments-arlington-tx-building-photo.jpg",
        price: 1375,
        website: "https://www.apartments.com/south-campus-apartments-arlington-tx/4y8bysj/",
        campusType: "offcampus"
      },
    ];

    setPosts(fetchedPosts);
    setFilteredPosts(fetchedPosts);
  }, []);

  useEffect(() => {
    let result = posts;

    if (searchTerm) {
      result = result.filter(post =>
        post.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (campusFilter !== 'all') {
      result = result.filter(post => post.campusType === campusFilter);
    }

    if (priceFilter !== 'all') {
      if (priceFilter === 'under1000') {
        result = result.filter(post => post.price < 1000);
      } else if (priceFilter === '1000to1500') {
        result = result.filter(post => post.price >= 1000 && post.price <= 1500);
      } else if (priceFilter === 'over1500') {
        result = result.filter(post => post.price > 1500);
      }
    }

    setFilteredPosts(result);
  }, [searchTerm, campusFilter, priceFilter, posts]);

  const openLink = (url) => {
    Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
  };

  const Post = ({ post }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Text style={styles.postTitle}>{post.name}</Text>
        <View style={[
          styles.campusBadge,
          post.campusType === 'oncampus' ? styles.onCampus : styles.offCampus
        ]}>
          <Text style={[
            styles.campusBadgeText,
            post.campusType === 'oncampus' ? styles.onCampusText : styles.offCampusText
          ]}>
            {post.campusType === 'oncampus' ? 'On-Campus' : 'Off-Campus'}
          </Text>
        </View>
      </View>

      {post.image ? (
        <Image source={{ uri: post.image }} style={styles.postImage} />
      ) : null}

      <View style={styles.postFooter}>
        <Text style={styles.priceText}>${post.price}/month</Text>
        {post.website ? (
          <TouchableOpacity onPress={() => openLink(post.website)} style={styles.visitLink}>
            <Text style={styles.visitText}>Visit</Text>
            <Feather name="external-link" size={16} color="#2563EB" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>UTA Housing Options</Text>
          <Text style={styles.subtitle}>Find your perfect student accommodation</Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowFilters(!showFilters)}
          style={styles.filterButton}
        >
          <Feather name={showFilters ? "x" : "filter"} size={18} color="#fff" />
          <Text style={styles.filterButtonText}>Filters</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        {/* Search bar */}
        <TextInput
          placeholder="Search housing by name..."
          style={styles.searchInput}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />

        {/* Filters */}
        {showFilters && (
          <View style={styles.filtersContainer}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Campus Type</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={campusFilter}
                  onValueChange={(itemValue) => setCampusFilter(itemValue)}
                  mode="dropdown"
                >
                  <Picker.Item label="All Types" value="all" />
                  <Picker.Item label="On-Campus" value="oncampus" />
                  <Picker.Item label="Off-Campus" value="offcampus" />
                </Picker>
              </View>
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Price Range</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={priceFilter}
                  onValueChange={(itemValue) => setPriceFilter(itemValue)}
                  mode="dropdown"
                >
                  <Picker.Item label="All Prices" value="all" />
                  <Picker.Item label="Under $1000" value="under1000" />
                  <Picker.Item label="$1000 - $1500" value="1000to1500" />
                  <Picker.Item label="Over $1500" value="over1500" />
                </Picker>
              </View>
            </View>
          </View>
        )}

        {/* List of posts */}
        {filteredPosts.length > 0 ? (
          <FlatList
            data={filteredPosts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <Post post={item} />}
            contentContainerStyle={styles.postsList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.noResults}>
            <Text style={styles.noResultsTitle}>No housing options found</Text>
            <Text style={styles.noResultsSubtitle}>Try adjusting your filters or search term</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Tailwind gray-100
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937', // gray-800
  },
  subtitle: {
    fontSize: 14,
    color: '#4B5563', // gray-600
  },
  filterButton: {
    flexDirection: 'row',
    backgroundColor: '#2563EB', // blue-600
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 12,
    borderColor: '#D1D5DB', // gray-300
    borderWidth: 1,
  },
  filtersContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  filterGroup: {
    marginBottom: 12,
  },
  filterLabel: {
    fontWeight: '600',
    color: '#374151', // gray-700
    marginBottom: 4,
  },
  pickerWrapper: {
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 6,
    overflow: 'hidden',
  },
  postsList: {
    paddingBottom: 100,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 12,
    alignItems: 'center',
  },
  postTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#1F2937',
    flex: 1,
    paddingRight: 8,
  },
  campusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  onCampus: {
    backgroundColor: '#D1FAE5', // green-100
  },
  offCampus: {
    backgroundColor: '#DBEAFE', // blue-100
  },
  campusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  onCampusText: {
    color: '#065F46', // green-700
  },
  offCampusText: {
    color: '#1D4ED8', // blue-700
  },
  postImage: {
    width: '100%',
    height: 160,
    marginTop: 8,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  visitLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  visitText: {
    color: '#2563EB',
    fontWeight: '600',
    marginRight: 4,
  },
  noResults: {
    marginTop: 40,
    alignItems: 'center',
  },
  noResultsTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#6B7280', // gray-500
  },
  noResultsSubtitle: {
    marginTop: 4,
    color: '#9CA3AF', // gray-400
  },
});

export default UTAHousingApp;
