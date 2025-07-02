import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import TopNav from '../../components/navigation/TopNav';

interface Resource {
  icon: string;
  title: string;
  description: string;
  link?: string;
}

const resources: Resource[] = [
  {
    icon: 'book-open',
    title: 'Mav Mover',
    description: 'Book a ride for free and move around the campus',
    link: 'https://play.google.com/store/apps/details?id=ridewithvia.uota.arlingtonunilatenight&hl=en_US&pli=1',
  },
  {
    icon: 'book-open',
    title: 'Library Services',
    description: 'Access academic journals, borrow books, or use study spaces.',
    link: 'https://library.uta.edu',
  },
  {
    icon: 'map-pin',
    title: 'Campus Map',
    description: 'Find buildings, departments, parking spots, and more.',
    link: 'https://www.uta.edu/maps',
  },
  {
    icon: 'users',
    title: 'Student Organizations',
    description: 'Join clubs and student groups to connect and collaborate.',
    link: 'https://mavorgs.uta.edu',
  },
  {
    icon: 'globe',
    title: 'International Student Office',
    description: 'Support for international students including visa and immigration help.',
    link: 'https://www.uta.edu/oie',
  },
  {
    icon: 'message-circle',
    title: 'Counseling & Mental Health',
    description: 'Talk to professionals for mental health, stress, or emotional support.',
    link: 'https://www.uta.edu/student-affairs/caps',
  },
];

const UniversityResourcesPage = () => {
  const handleResourcePress = (link?: string) => {
    if (link) {
      Linking.openURL(link);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <TopNav title="University Resources" showBackButton={true} />
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>University Resources</Text>
      </View> */}

      <ScrollView style={styles.scrollView}>
        <Text style={styles.intro}>
          Here are some of the most helpful resources available to all UTA students.
        </Text>

        <View style={styles.resourceList}>
          {resources.map((resource, index) => (
            <TouchableOpacity
              key={index}
              style={styles.resourceCard}
              onPress={() => handleResourcePress(resource.link)}
            >
              <FeatherIcon name={resource.icon} size={24} color="#1e3a8a" style={styles.resourceIcon} />
              <View style={styles.resourceContent}>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                <Text style={styles.resourceDesc}>{resource.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1e3a8a',
    padding: 24,
    borderBottomWidth: 3,
    borderBottomColor: '#dc143c',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  intro: {
    fontSize: 16,
    color: '#2a4365',
    marginVertical: 24,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  resourceList: {
    padding: 16,
    gap: 16,
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: 'white',
    borderLeftWidth: 5,
    borderLeftColor: '#1e3a8a',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  resourceIcon: {
    marginTop: 3,
  },
  resourceContent: {
    flex: 1,
    marginLeft: 12,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#111827',
  },
  resourceDesc: {
    fontSize: 14,
    color: '#4a5568',
  },
});

export default UniversityResourcesPage;
