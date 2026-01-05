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
}

const UserPost: React.FC<UserPostProps> = ({
  user,
  title,
  content,
}) => {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
          </Text>
        </View>

        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>

        <TouchableOpacity style={styles.moreBtn}>
          <Icon name="more-horizontal" size={18} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Body */}
      <Text style={styles.content}>{content}</Text>
    </View>
  );
};



export default UserPost;
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
    }),
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4b80b3ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  avatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  headerText: {
    flex: 1,
    marginRight: 6,
  },

  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },

  moreBtn: {
    padding: 4,
  },

  content: {
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
  },
});
