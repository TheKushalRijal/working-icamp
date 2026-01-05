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
  title: string;
  content: string;
}

const UserPost: React.FC<UserPostProps> = ({
  id,
  title,
  content,
}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {title?.charAt(0)?.toUpperCase() ?? '?'}
            </Text>
          </View>

          <View style={styles.userDetails}>
            <Text style={styles.userName}>{title}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.moreButton}>
          <Icon name="more-horizontal" size={20} color="#4a5568" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.postText}>{content}</Text>
      </View>
    </View>
  );
};

export default UserPost;

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
  moreButton: {
    padding: 4,
  },
  content: {
    marginTop: 8,
  },
  postText: {
    fontSize: 15,
    color: '#2d3748',
    lineHeight: 20,
  },
});
