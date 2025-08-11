import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import TopNav from '../../components/navigation/TopNav'; // Adjust path as needed
import BottomNav from '../../components/navigation/BottomNav'; // Adjust path as needed

const DiscountApp = () => {
  // Sample data for discount cards
  const discountData = [
    { id: 1, store: 'Walmart', discount: '50% off', description: '50% off  of Walmart+ membership with valid student verification' },
    { id: 2, store: 'Amazon Prime', discount: '6 month free', description: 'Prime Student membership with exclusive deals and faster shipping' },
    { id: 8, store: 'Figma', discount: 'Free', description: 'Free Education Plan with unlimited files, editors, and projects for students and educators' },
{ id: 9, store: 'GitHub', discount: 'Free', description: 'GitHub Student Developer Pack with free access to premium developer tools and cloud services' },
{ id: 10, store: 'AutoCAD', discount: 'Free', description: 'Free 1-year educational access to AutoCAD and other Autodesk software with renewable license' },

    { id: 3, store: 'Spotify', discount: '50% off', description: 'Premium Student plan with ad-free music and podcasts' },
    { id: 4, store: 'Apple Education', discount: '10% off', description: 'Discount on Mac, iPad, and more with free AirPods' },
    { 
  id: 21, 
  store: 'Dell', 
  discount: 'Up to 10% off', 
  description: 'Student discount on select laptops, desktops, and accessories with academic email verification. Additional 2X Dell Rewards on eligible purchases. Also offers up to 15% off on refurbished products via Dell Outlet Student Program.' 
},
    { id: 5, store: 'Adobe Creative Cloud', discount: '60% off', description: 'All apps including Photoshop, Illustrator, and Premiere Pro' },
    { id: 6, store: 'Microsoft Office', discount: 'Free', description: 'Free access to Office 365 with your school email' },
    { id: 11, store: 'JetBrains', discount: 'Free', description: 'Free student license for professional IDEs like PyCharm, IntelliJ, etc., renewable annually with school email' },
{ id: 12, store: 'Notion', discount: 'Free', description: 'Free Notion Pro plan for students with .edu email for advanced note-taking & organization' },
{ id: 13, store: 'Lucidchart', discount: 'Free', description: 'Free access to Lucidchart diagramming tools for students' },
{ id: 14, store: 'Tableau', discount: 'Free', description: 'Free Tableau Desktop & Prep Builder for one year with student status' },
{ id: 15, store: 'AWS Educate', discount: 'Free Credits', description: 'Free cloud credits and educational resources from AWS for students' },
{ id: 16, store: 'DigitalOcean', discount: 'Free Credits', description: '$50 in credits for student cloud hosting through GitHub Student Pack' },
{ id: 17, store: 'Canva', discount: 'Free', description: 'Free Canva for Education with premium design tools for students' },
{ id: 18, store: 'Overleaf', discount: 'Free', description: 'Free premium features on Overleaf (LaTeX editor) for students' },
{ id: 19, store: 'Wolfram Alpha Pro', discount: 'Free', description: 'Free access to Wolfram Alpha Pro for step-by-step solutions for students' },
{ id: 20, store: 'GeoGebra', discount: 'Free', description: 'Free dynamic mathematics software for algebra and geometry educators and students' }

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