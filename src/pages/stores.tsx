import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  FlatList,
  Dimensions
} from 'react-native';
//import { MaterialIcons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

interface Store {
  id: number;
  name: string;
  image?: string;
  location: string;
  distance: string;
  rating: number;
  reviewCount: number;
  categories: string[];
  openStatus: string;
  phone: string;
  hours: string;
  featured?: boolean;
}

const StoresNearMe = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortOption, setSortOption] = useState<string>('distance');
  const [currentLocation, setCurrentLocation] = useState<string>('');

  useEffect(() => {
    const fetchStores = async () => {
      setIsLoading(true);
      try {
        const fetchedStores: Store[] = [
          {
            id: 0,
            name: 'Nepali mandir/ Nepali society of texas',
            image: 'https://lh3.googleusercontent.com/p/AF1QipP-eD1EgjBl1WF86n-QPTFrKOerpS23_pvlSBbk=w143-h143-n-k-no',
            location: '1212 Royal Pkwy, Euless, TX 76040',
            distance: '0.5 miles',
            rating: 4.5,
            reviewCount: 124,
            categories: ['Nepali Mandir', 'Nepali society'],
            openStatus: 'Open now',
            phone: '(555) 123-4567',
            hours: 'Mon-Fri: 8AM-9PM, Sat-Sun: 9AM-8PM',
            featured: true
          },
          {
            id: 1,
            name: 'Corner Stone',
            image: 'https://lh3.googleusercontent.com/p/AF1QipN0S1kPVh486_BdprFHkL-bNmteWhXwq2HfySB6=s1360-w1360-h1020',
            location: '312 College St, Arlington, TX 76010',
            distance: '0.5 miles',
            rating: 4.5,
            reviewCount: 124,
            categories: ['Free Coffee', 'Festival celebration'],
            openStatus: 'Open now',
            phone: '(555) 123-4567',
            hours: 'Mon-Fri: 8AM-9PM, Sat-Sun: 9AM-8PM',
            featured: true
          },
          {
            id: 2,
            name: 'Taipo',
            image: 'https://lh3.googleusercontent.com/p/AF1QipOB1z4QvEEkk6otpY2h_TSZMYsOEB73HUPzonJ1=w408-h297-k-no',
            location: '200 E Abram St Suite 140, Arlington TX 76010',
            distance: '0.5 miles',
            rating: 4.2,
            reviewCount: 89,
            categories: ['Nepali Restuarent', 'Foods'],
            openStatus: 'Open now',
            phone: '(555) 987-6543',
            hours: 'Mon-Sun: 7AM-10PM'
          },
          {
            id: 3,
            name: 'Royal Texas nepali grill',
            image: 'https://lh3.googleusercontent.com/p/AF1QipP_va-c3te6J4yQC1rf6_XGjVL0F_aovDlImFkP=w408-h724-k-no',
            location: '789 Elm Blvd, Dallas, TX',
            distance: '2.3 miles',
            rating: 4.8,
            reviewCount: 215,
            categories: ['Nepali foods'],
            openStatus: 'Closes at 8PM',
            phone: '(555) 456-7890',
            hours: 'Mon-Sat: 7AM-8PM, Sun: 8AM-7PM'
          },
          {
            id: 4,
            name: 'Cafe Everest',
            image: 'https://lh3.googleusercontent.com/p/AF1QipMs8g-kIE8FcGdQPg-Tn9OxFjwEax3xjCp33-IS=w426-h240-k-no',
            location: '3901 W Arkansas Ln #107A, Arlington, TX 76016',
            distance: '3.1 miles',
            rating: 3.9,
            reviewCount: 42,
            categories: ['Nepali food'],
            openStatus: 'Closed - Opens at 7AM',
            phone: '(555) 789-0123',
            hours: 'Mon-Fri: 7AM-7PM, Sat: 8AM-5PM'
          },
          {
            id: 5,
            name: 'Deshi Store',
            image: 'https://lh3.googleusercontent.com/p/AF1QipNA89KlfXE0Lr3GfqdZIENKrssa9ww61dRNZZQA=w408-h306-k-no',
            location: '1215 S Cooper St, Arlington, TX 76010',
            distance: '3.1 miles',
            rating: 3.9,
            reviewCount: 42,
            categories: ['Asian items','indian store'],
            openStatus: 'Closed - Opens at 7AM',
            phone: '(555) 789-0123',
            hours: 'Mon-Fri: 7AM-7PM, Sat: 8AM-5PM'
          },
        ];
        
        // Simulate location detection
        setCurrentLocation('Arlington, TX');
        setStores(fetchedStores);
      } catch (error) {
        console.error('Error fetching stores:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();
  }, []);

  // Get all unique categories
  const allCategories = ['All', ...new Set(stores.flatMap(store => store.categories))];
  const filteredStores = stores
    .filter(store => 
      store.name.toLowerCase().includes(query.toLowerCase()) ||
      store.location.toLowerCase().includes(query.toLowerCase()) ||
      store.categories.some(cat => cat.toLowerCase().includes(query.toLowerCase()))
    )
    .filter(store => 
      selectedCategory === 'All' || store.categories.includes(selectedCategory)
    )
    .sort((a, b) => {
        switch (sortOption) {
          case 'rating':
            return b.rating - a.rating;
          case 'name':
            return a.name.localeCompare(b.name);
          case 'reviewCount':
            return b.reviewCount - a.reviewCount;
          case 'distance':
          default:
            return parseFloat(a.distance) - parseFloat(b.distance);
        }
      });

  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FontAwesome key={i} name="star" size={16} color="#f59e0b" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FontAwesome key={i} name="star-half-full" size={16} color="#f59e0b" />);
      } else {
        stars.push(<FontAwesome key={i} name="star-o" size={16} color="#f59e0b" />);
      }
    }
    
    return <View style={{flexDirection: 'row'}}>{stars}</View>;
  };

  const renderStoreItem = ({ item }: { item: Store }) => (
    <View style={[styles.storeCard, item.featured && styles.featuredStore]}>
      {item.image && (
        <View style={styles.storeImageContainer}>
          <Image 
            source={{ uri: item.image }} 
            style={styles.storeImage}
            onError={() => console.log('Error loading image')}
          />
          {item.featured && (
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredBadgeText}>Featured</Text>
            </View>
          )}
          <View style={styles.distanceBadge}>
            <Text style={styles.distanceBadgeText}>{item.distance} away</Text>
          </View>
        </View>
      )}
      
      <View style={styles.storeInfo}>
        <View style={styles.storeHeader}>
          <Text style={styles.storeName}>{item.name}</Text>
        </View>
        
        <View style={styles.locationContainer}>
          <MaterialIcons name="location-on" size={16} color="#6b7280" />
          <Text style={styles.storeLocation}>{item.location}</Text>
        </View>
        
      
        
        <View style={styles.categoriesContainer}>
          {item.categories.map(category => (
            <View key={category} style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Just The Nepali Vibes</Text>
            {currentLocation && (
              <View style={styles.locationRow}>
                <MaterialIcons name="location-on" size={16} color="#6b7280" />
                <Text style={styles.locationText}>{currentLocation}</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <MaterialIcons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search stores by name, location, or category..."
              placeholderTextColor="#9ca3af"
              value={query}
              onChangeText={setQuery}
            />
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        ) : filteredStores.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No stores found matching your criteria</Text>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={() => {
                setQuery('');
                setSelectedCategory('All');
              }}
            >
              <Text style={styles.resetButtonText}>Reset filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredStores}
            renderItem={renderStoreItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={1}
            scrollEnabled={false}
            contentContainerStyle={styles.storesList}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  searchContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: '#111827',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    color: '#6b7280',
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  storesList: {
    paddingBottom: 16,
  },
  storeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  featuredStore: {
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  storeImageContainer: {
    height: 180,
    position: 'relative',
  },
  storeImage: {
    width: '100%',
    height: '100%',
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#3b82f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  featuredBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  distanceBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  distanceBadgeText: {
    color: 'white',
    fontSize: 12,
  },
  storeInfo: {
    padding: 16,
  },
  storeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  storeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flexShrink: 1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  storeLocation: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  categoryBadge: {
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#4b5563',
  },
});

export default StoresNearMe;