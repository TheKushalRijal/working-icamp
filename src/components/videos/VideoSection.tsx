import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import YoutubePlayer from 'react-native-youtube-iframe';
import { DEV_BASE_URL } from '@env';
interface Video {
  id: string | number;
  url: string;
  thumbnail: string;
  author?: string;
}

interface VideoSectionProps {
  activeTab: 'your-community' | 'campus-community';
  videos?: Video[];
}

// Sample videos data with minimal info
const sampleVideos: Video[] = [
  {
    id: 1,
    url: 'https://www.youtube.com/embed/u5W0AJXsp4c',
    thumbnail: 'https://img.youtube.com/vi/u5W0AJXsp4c/maxresdefault.jpg',
    author: 'user'
  },
  {
    id: 2,
    url: 'https://www.youtube.com/embed/_2vFnFsu8B4',
    thumbnail: 'https://img.youtube.com/vi/_2vFnFsu8B4/maxresdefault.jpg',
    author: 'campus'
  }
];

const VideoSection: React.FC<VideoSectionProps> = ({ activeTab, videos: propVideos }) => {
  const [videos, setVideos] = useState<Video[]>(propVideos || sampleVideos);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | number | null>(null);
  const playerRefs = useRef<{ [key: string]: any }>({});
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = screenWidth - 24; // Full width minus margins (12px on each side)

  const handleVideoClick = (videoId: string | number) => {
    if (playingVideoId === videoId) {
      // If clicking the currently playing video, pause it
      if (playerRefs.current[videoId]) {
        playerRefs.current[videoId].pauseVideo();
      }
      setPlayingVideoId(null);
    } else {
      // If clicking a different video, pause the current one and play the new one
      if (playingVideoId && playerRefs.current[playingVideoId]) {
        playerRefs.current[playingVideoId].pauseVideo();
      }
      if (playerRefs.current[videoId]) {
        playerRefs.current[videoId].playVideo();
      }
      setPlayingVideoId(videoId);
    }
  };

  const onPlayerReady = (event: any, videoId: string | number) => {
    playerRefs.current[videoId] = event.target;
  };

  // Function to get videos based on active tab
  const getFilteredVideos = (videos: Video[]) => {
    return videos.filter((video: Video) => {
      if (activeTab === 'your-community') {
        return video.author === 'user';
      } else {
        return video.author === 'campus';
      }
    });
  };

  useEffect(() => {
    if (propVideos && Array.isArray(propVideos)) {
      setVideos(propVideos);
      setLoading(false);
      return;
    }
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const BASE_URL = DEV_BASE_URL;
          

        const response = await axios.get(`${BASE_URL}/videos/`, {
         // withCredentials: true,
          timeout: 1000
        });
        console.log(response.data)

         const communityresponse = await axios.get(`${BASE_URL}videos/community/`, {
         // withCredentials: true,
          timeout: 1000
        });
        console.log(response.data)

        if (response.data && Array.isArray(response.data)) {
          const filteredVideos = getFilteredVideos(response.data);
          if (filteredVideos.length > 0) {
            setVideos(filteredVideos);
          }
        }
console.log(response.data)
 if (communityresponse.data && Array.isArray(response.data)) {
          const filteredVideos = getFilteredVideos(response.data);
          if (filteredVideos.length > 0) {
            setVideos(filteredVideos);
          }
        }

      } catch (error) {
        console.log('Using sample videos (backend unavailable)');
        setVideos(sampleVideos);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [activeTab, propVideos]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading videos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
     
      {videos.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
          decelerationRate="fast"
          snapToInterval={cardWidth + 12}
          snapToAlignment="start"
          contentOffset={{ x: 0, y: 0 }}
        >
          {videos.map((video) => (
            <TouchableOpacity 
              key={video.id} 
              style={[styles.videoCard, { width: cardWidth }]}
              onPress={() => handleVideoClick(video.id)}
              activeOpacity={0.9}
            >
              <View style={styles.videoWrapper}>
                <View style={styles.thumbnailContainer}>
                  {playingVideoId === video.id ? (
                    <YoutubePlayer
                      height={200}
                      width={cardWidth}
                      play={true}
                      videoId={video.url.split('/embed/')[1]}
                      onChangeState={event => {
                        if (event === 'ended') setPlayingVideoId(null);
                      }}
                      webViewStyle={{ borderRadius: 12 }}
                    />
                  ) : (
                    <Image source={{ uri: video.thumbnail }} style={{ width: '100%', height: 200, borderRadius: 12 }} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>
            No videos available in {activeTab === 'your-community' ? 'your' : 'campus'} community yet
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: -32,
    paddingHorizontal: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2a4365',
    marginBottom: 16,
    paddingLeft: 0,
    paddingRight: 12,
  },
  scrollViewContent: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingVertical: 8,
  },
  videoCard: {
    marginRight: 12,
    marginLeft: 0,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'white',
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
  videoWrapper: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  thumbnailContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    width: '100%',
    height: '100%',
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2a4365',
    marginBottom: 8,
  },
  videoAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  videoDescription: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  emptyStateContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default VideoSection; 