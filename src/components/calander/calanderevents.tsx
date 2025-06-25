import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

// Define the Event type
type Event = {
  title: string;
  description: string;
  date: string; // Format: 'YYYY-MM-DD'
};

interface EventCardsProps {
  selectedDate: string;
  events: Event[];
}

const EventCards: React.FC<EventCardsProps> = ({ selectedDate, events }) => {
  const selectedEvents = events.filter(event => event.date === selectedDate);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Events on {selectedDate}</Text>
      {selectedEvents.length > 0 ? (
        <FlatList
          data={selectedEvents}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noEvents}>No events for this day</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    marginTop: 16,
    marginHorizontal: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Android shadow
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  noEvents: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
});

export default EventCards;
