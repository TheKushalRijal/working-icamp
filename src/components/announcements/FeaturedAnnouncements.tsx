import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type FeaturedAnnouncementProps = {
  title: string;
  description: string;
};

const FeaturedAnnouncement: React.FC<FeaturedAnnouncementProps> = ({ title, description }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  // Main container styles - Creates a card-like container for the announcement
  container: {
    backgroundColor: '#ECC94B', // Sets a yellow background color for the announcement card
    borderRadius: 8,           // Rounds the corners of the container by 8 points
    padding: 24,               // Adds 24 points of space between content and container edges
    marginBottom: 32,          // Adds 32 points of space below the announcement card
  },

  // Title text styles - Styles the announcement title text
  title: {
    fontSize: 20,              // Sets the title text size to 20 points
    fontWeight: 'bold',        // Makes the title text bold
    color: '#2A4365',          // Sets the title text color to a dark blue shade
    marginBottom: 8,           // Adds 8 points of space below the title
  },

  // Description text styles - Styles the announcement description text
  description: {
    color: '#2A4365',          // Sets the description text color to match the title
    fontSize: 16,              // Sets the description text size to 16 points
  },
});

export default FeaturedAnnouncement;