import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, Text, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';
import UserPost from '../components/UserPost'; // Ensure this is a React Native version

const Test = () => {
  const [backendPosts, setBackendPosts] = useState([]);

  const getFromBackend = async () => {
    const BASE_URL = __DEV__
      ? 'http://localhost:8000'
      : 'https://api.sapana.xyz';

    try {
      console.log('Requesting posts from backend...');
      const response = await axios.get(`${BASE_URL}/home`, {
        withCredentials: true,
        headers: {
          Accept: 'application/json',
        },
      });
      console.log('Fetched from backend:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching from backend:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getFromBackend();
      setBackendPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {backendPosts.map((post, index) => (
        <View key={`backend-${index}`} style={styles.postContainer}>
          <UserPost
            id={`backend-${index}`}
            user={{ id: 'backendUser', name: 'Admin' }}
            title={post.text || 'Backend Post'}
            content={post.text || ''}
            location={''}
            timestamp={post.created_at || new Date().toISOString()}
            likes={0}
            comments={0}
            shares={0}
            isLiked={false}
            isBookmarked={false}
            onLike={() => {}}
          >
            {(post.video || post.image) && (
              <View style={styles.mediaContainer}>
                {post.video ? (
                  // Use a video player like react-native-video
                  <Text style={styles.placeholder}>
                    🔴 Video: Use `react-native-video` to show this
                  </Text>
                ) : (
                  <Image
                    source={{ uri: post.image }}
                    style={styles.media}
                    resizeMode="cover"
                  />
                )}
              </View>
            )}
          </UserPost>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  postContainer: {
    marginBottom: 20,
  },
  mediaContainer: {
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  media: {
    width: Dimensions.get('window').width - 32,
    height: 200,
    borderRadius: 8,
  },
  placeholder: {
    color: '#888',
    fontStyle: 'italic',
    fontSize: 14,
    marginTop: 8,
  },
});

export default Test;
