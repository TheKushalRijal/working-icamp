import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Platform, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import YoutubePlayer from 'react-native-youtube-iframe';
import { DEV_BASE_URL } from '../../config/config';

import SQLite from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    id: 3,
    url: 'https://www.youtube.com/watch?v=u5W0AJXsp4c',
    thumbnail: 'https://img.youtube.com/vi/u5W0AJXsp4c/maxresdefault.jpg',
    author: 'user'
  },

  
  {
    id: 2,
    url: 'https://www.youtube.com/_2vFnFsu8B4',
    thumbnail: 'https://img.youtube.com/vi/_2vFnFsu8B4/maxresdefault.jpg',
    author: 'campus'
  }


];



const fetchVideosFromSQLite = async (): Promise<Video[]> => {
  const db = await SQLite.openDatabase({ name: 'university.db', location: 'default' });
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT id, url, thumbnail, author FROM videos`,
        [],
        (txObj, { rows }) => {
          const result: Video[] = [];
          for (let i = 0; i < rows.length; i++) {
            result.push(rows.item(i));
          }
          resolve(result);
        },
        (txObj, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};



const extractYouTubeId = (url: string) => {
  const regex = /(?:v=|\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};




const VideoSection: React.FC<VideoSectionProps> = ({ activeTab, videos: propVideos }) => {
  const [videos, setVideos] = useState<Video[]>(propVideos || sampleVideos);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | number | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);
  const playerRefs = useRef<{ [key: string]: any }>({});
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = screenWidth - 28;// Full width minus margins (12px on each side)

  const handleVideoClick = (videoId: string | number) => {
    if (playingVideoId === videoId) {
      // Same video clicked again: do nothing, let native controls show
      return;
    }
    // Different video clicked: pause previous and play new
    if (playingVideoId && playerRefs.current[playingVideoId]) {
      playerRefs.current[playingVideoId].pauseVideo?.();
    }
    setPlayingVideoId(videoId);
  };

  const onPlayerReady = (event: any, videoId: string | number) => {
    playerRefs.current[videoId] = event.target;
  };

  // Function to get videos based on active tab
const getFilteredVideos = (videos: Video[]) => {
  return videos; // 👈 no filtering, just pass-through
};


  // Add university fetch effect
  useEffect(() => {
    const getUniversity = async () => {
      const uni = await AsyncStorage.getItem("@selected_university");
      setSelectedUniversity(uni);
    };
    getUniversity();
  }, []);

  // -------------------------
  // EFFECT 1: IMMEDIATE LOCAL LOAD
  // -------------------------
  useEffect(() => {
    let mounted = true;

    const loadLocalVideos = async () => {
      // If parent passed videos, use them immediately
      if (propVideos && Array.isArray(propVideos)) {
        setVideos(getFilteredVideos(propVideos));
        return;
      }

      // Try SQLite
      try {
        const sqliteData = await fetchVideosFromSQLite();
        if (mounted && sqliteData.length > 0) {
          setVideos(getFilteredVideos(sqliteData));
          console.log("⚡ Videos loaded immediately from SQLite");
        }
      } catch (e) {
        console.log("SQLite load failed, keeping fallback videos");
      }
    };

    loadLocalVideos();

    return () => {
      mounted = false;
    };
  }, [activeTab, propVideos]);

  // -------------------------
  // EFFECT 2: BACKEND SYNC (BACKGROUND)
  // -------------------------
  useEffect(() => {
    let mounted = true;

    const fetchBackendVideos = async () => {
      try {
        const BASE_URL = 'http://10.0.2.2:8000';
        const universityId = await AsyncStorage.getItem("@selected_university");

        const response = await axios.get(`${BASE_URL}/videos/`, );
console.log("[VideoSection] DEV_BASE_URL:===================================", BASE_URL)
console.log('📡 Raw Axios response:', response.data);
        if (!mounted) return;

        if (Array.isArray(response.data) && response.data.length > 0) {
          setVideos(prev => {
            const map = new Map(prev.map(v => [v.id, v]));
            response.data.forEach(v => map.set(v.id, v));
            return getFilteredVideos(Array.from(map.values()));
          });

          console.log("🔄 Videos merged from backend");
        }
      } catch (error) {
        console.log("Backend fetch failed silently");
      }
    };

    fetchBackendVideos();

    return () => {
      mounted = false;
    };
  }, [activeTab]);











  /* Function to fetch community videos (to be used later on click)
  const fetchCommunityVideos = async () => {
    try {
      setLoading(true);
      const BASE_URL = DEV_BASE_URL;
      const communityresponse = await axios.get(`${BASE_URL}/videos/community/`, {
        // withCredentials: true,
        timeout: 1000
      });
      console.log(communityresponse.data);
      if (communityresponse.data && Array.isArray(communityresponse.data)) {
        const filteredVideos = getFilteredVideos(communityresponse.data);
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
*/
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
        {videos.map((video) => {
          // ✅ FIX: extract YouTube ID safely HERE
          const videoId = extractYouTubeId(video.url);

          return (
            <TouchableOpacity
              key={video.id}
              style={[styles.videoCard, { width: cardWidth }]}
              onPress={() => handleVideoClick(video.id)}
              activeOpacity={0.9}
            >
              <View style={styles.videoWrapper}>
                <View style={styles.thumbnailContainer}>
                  {playingVideoId === video.id && videoId ? (
                    <YoutubePlayer
                      height={200}
                      width={cardWidth}
                      play={true}
                      videoId={videoId}
                      onChangeState={(event) => {
                        if (event === 'ended') setPlayingVideoId(null);
                      }}
                      webViewStyle={{ borderRadius: 12 }}
                    />
                  ) : (
                    <Image
                      source={{ uri: video.thumbnail }}
                      style={{
                        width: '100%',
                        height: 200,
                        borderRadius: 12,
                      }}
                    />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    ) : (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateText}>No videos available</Text>
      </View>
    )}
  </View>
);
  
};

const styles = StyleSheet.create({
  container: {
    marginTop: -32,
    paddingHorizontal: -0,
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
    marginRight: 14,
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
    height: 150,
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