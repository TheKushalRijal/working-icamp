import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface EventCardProps {
  title: string;
  date: string;
  image: string;
  location: string;
  description: string;
}

const EventCard: React.FC<EventCardProps> = ({ title, date, image, location, description }) => {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
        <View style={styles.details}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.meta}>{new Date(date).toLocaleDateString()}</Text>
          <Text style={styles.meta}>{location}</Text>
          <Text style={styles.description}>{description}</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Join Event</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    margin: 12,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  image: {
    width: '100%',
    height: 200,
  },
  details: {
    padding: 16,
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2A4365',
    marginBottom: 8,
  },
  meta: {
    color: '#4A5568',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#4A5568',
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#38B2AC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default EventCard;
