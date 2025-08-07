import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import TopNav from '../../components/navigation/TopNav'; // Adjust path as needed
import BottomNav from '../../components/navigation/BottomNav'; // Adjust path as needed

const DiscountApp = () => {
  // Sample data for discount cards
  const discountData = [
    { id: 1, store: 'Walmart', discount: '6 months free', description: 'Get 6 months of Walmart+ membership free with valid student verification' },
    { id: 2, store: 'Amazon Prime', discount: '50% off', description: 'Prime Student membership with exclusive deals and faster shipping' },
    { id: 3, store: 'Spotify', discount: '50% off', description: 'Premium Student plan with ad-free music and podcasts' },
    { id: 4, store: 'Apple Education', discount: '10% off', description: 'Discount on Mac, iPad, and more with free AirPods' },
    { id: 5, store: 'Adobe Creative Cloud', discount: '60% off', description: 'All apps including Photoshop, Illustrator, and Premiere Pro' },
    { id: 6, store: 'Microsoft Office', discount: 'Free', description: 'Free access to Office 365 with your school email' },
    { id: 7, store: 'UNiDAYS', discount: 'Various', description: 'Exclusive student discounts across hundreds of brands' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <TopNav title="Student Discounts" />
      <ScrollView style={styles.scrollView}>
        <Text style={styles.sectionTitle}>Student Discounts</Text>
        {discountData.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => alert(`Applying ${item.store} discount\n${item.description}`)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.storeName}>{item.store}</Text>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{item.discount}</Text>
              </View>
            </View>
            <Text style={styles.description}>{item.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginVertical: 16,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  storeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  discountBadge: {
    backgroundColor: '#4caf50',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  discountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default DiscountApp;