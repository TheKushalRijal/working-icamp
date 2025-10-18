import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface User {
  id: string;
  name: string;
}

interface UserPostProps {
  id: number | string;
  user: User;
  title: string;
  content: string;
  location?: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  onLike: () => void;
  children?: React.ReactNode;
}

// Simple time ago formatter (like date-fns formatDistanceToNow)
function timeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds} seconds ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;

  // For longer than a week, show date in Month Day format
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

const UserPost: React.FC<UserPostProps> = ({
  user,
  title,
  content,
  location,
  timestamp,
  likes,
  comments,
  shares,
  isLiked,
  isBookmarked,
  onLike,
  children,
}) => {
  const formattedTime = timeAgo(new Date(timestamp));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{title}</Text>
            <Text style={styles.timestamp}>{formattedTime}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Icon name="more-horizontal" size={20} color="#4a5568" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.postText}>{content}</Text>
        {location && (
          <View style={styles.locationContainer}>
            <Icon name="map-pin" size={14} color="#4a5568" />
            <Text style={styles.locationText}>{location}</Text>
          </View>
        )}
        {children}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        
        
        

        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginVertical: 8,
    padding: 16,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3182ce',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
  },
  timestamp: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
  },
  content: {
    marginBottom: 12,
  },
  postText: {
    fontSize: 15,
    color: '#2d3748',
    lineHeight: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  locationText: {
    fontSize: 13,
    color: '#4a5568',
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#4a5568',
    marginLeft: 4,
  },
  likedText: {
    color: '#e53e3e',
  },
});

export default UserPost;
