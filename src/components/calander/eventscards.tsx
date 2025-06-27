import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

// Types
interface EventCardProps {
  title: string;
  description: string;
  location?: string;
  date: string;
}

interface EventBannerCardProps {
  image: string;
  title: string;
  date: string;
  location: string;
  onPress?: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32; // 32 for container padding

// Event Card Component
const EventCard: React.FC<EventCardProps> = ({
  title,
  description,
  location = 'Not specified',
  date,
}) => {
  return (
    <View style={styles.eventCardContainer}>
      <View style={styles.iconContainer}>
        <Icon name="book-open" size={16} color="white" />
      </View>

      <View style={styles.eventContent}>
        <Text style={styles.eventTitle} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.eventDescription} numberOfLines={2}>
          {description}
        </Text>
        
        <View style={styles.eventDetails}>
          <View style={styles.detailRow}>
            <Icon name="map-pin" size={12} color="rgba(255, 255, 255, 0.8)" />
            <Text style={styles.detailText} numberOfLines={1}>
              {location}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="calendar" size={12} color="rgba(255, 255, 255, 0.8)" />
            <Text style={styles.detailText}>
              {date}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// Event List Component
const EventList: React.FC = () => {
  const [events, setEvents] = useState<EventCardProps[]>([
    {
      title: 'Summer Vacation',
      description: 'Starting the summer vacation',
      date: 'May 5, 2025',
    },
  ]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetch('https://api.dreamnepal.xyz/events');
        console.log('Using default events after API failure');


        
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        }
      } catch (error) {
      }
    };

    loadEvents();
  }, []);

  return (
    <ScrollView style={styles.eventListContainer}>
      {events.map((event, index) => (
        <EventCard 
          key={`event-${index}`}
          {...event}
        />
      ))}
    </ScrollView>
  );
};

// Event Banner Card Component
const EventBannerCard: React.FC<EventBannerCardProps> = ({
  image,
  title,
  date,
  location,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.bannerContainer}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.bannerImageContainer}>
        <Image
          source={{ uri: image }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <View style={styles.bannerOverlay} />
      </View>
      <View style={styles.bannerContent}>
        <View style={styles.bannerHeader}>
          <Text style={styles.bannerTitle} numberOfLines={2}>
            {title}
          </Text>
        </View>
        <View style={styles.bannerDetails}>
          <View style={styles.bannerDetailItem}>
            <Icon name="calendar" size={16} color="white" />
            <Text style={styles.bannerDetailText}>{date}</Text>
          </View>
          <View style={styles.bannerDetailItem}>
            <Icon name="map-pin" size={16} color="white" />
            <Text style={styles.bannerDetailText}>{location}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Event Card Styles
  eventCardContainer: {
    flexDirection: 'row',
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#6366F1',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  iconContainer: {
    marginRight: 8,
    padding: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventDescription: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    marginBottom: 8,
  },
  eventDetails: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 6,
  },

  // Event List Styles
  eventListContainer: {
    padding: 16,
  },

  // Banner Card Styles
  bannerContainer: {
    width: CARD_WIDTH,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  bannerImageContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  bannerContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  bannerHeader: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bannerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bannerDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  bannerDetailText: {
    color: 'white',
    marginLeft: 6,
    fontSize: 14,
  },
});

export { EventCard, EventList, EventBannerCard };
export default EventList;