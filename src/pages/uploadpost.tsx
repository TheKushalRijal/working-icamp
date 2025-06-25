import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import * as ImagePicker from 'expo-image-picker';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
//import { AsyncStorage } from 'react-native';
interface FileData {
  uri: string;
  type: string;
  fileName: string;
}

const UploadPost = () => {
  const [file, setFile] = useState<FileData | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const loadName = async () => {
      const savedName = await AsyncStorage.getItem('fullName');
      if (savedName) setFirstName(savedName);
    };
    loadName();
  }, []);

  const pickMedia = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your media library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 0.8,
        videoMaxDuration: 60,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const fileData: FileData = {
          uri: asset.uri,
          type: asset.type === 'video' ? 'video/mp4' : 'image/jpeg',
          fileName: asset.uri.split('/').pop() || 'media'
        };
        setFile(fileData);
        setPreview(asset.uri);
      }
    } catch (error) {
      console.error('Error picking media:', error);
      Alert.alert('Error', 'Failed to pick media');
    }
  };

  const removeMedia = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async () => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      if (file) {
        const response = await fetch(file.uri);
        const blob = await response.blob();
        formData.append('file', blob, file.fileName);
      }
      formData.append('caption', caption);

      const BASE_URL = __DEV__
        ? "http://localhost:8000"
        : "https://api.sapana.xyz";

      const response = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Upload failed');
      }

      const newPost = {
        firstName,
        caption,
        preview,
        file,
      };

      const existingPosts = await AsyncStorage.getItem('posts');
      const posts = existingPosts ? JSON.parse(existingPosts) : [];
      await AsyncStorage.setItem('posts', JSON.stringify([...posts, newPost]));

      navigation.goBack();
    } catch (error) {
      console.error('Upload failed:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to upload post');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Post</Text>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={(!file && !caption.trim()) || isUploading}
        >
          {isUploading ? (
            <ActivityIndicator color="#3B82F6" />
          ) : (
            <Text style={[
              styles.shareButton,
              (!file && !caption.trim()) && styles.shareButtonDisabled
            ]}>
              Share
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.captionContainer}>
          <View style={styles.avatar} />
          <TextInput
            placeholder="What's on your mind?"
            value={caption}
            onChangeText={setCaption}
            multiline
            style={styles.captionInput}
            maxLength={2200}
            autoFocus
          />
        </View>
        <View style={styles.captionBottom}>
          <Text style={[styles.charCount, caption.length > 2000 && styles.charCountWarning]}>
            {caption.length}/2200
          </Text>
        </View>

        {preview ? (
          <View style={styles.previewContainer}>
            {file?.type?.startsWith('image') ? (
              <Image source={{ uri: preview }} style={styles.media} resizeMode="contain" />
            ) : (
              <View style={styles.media}>
                <Image 
                  source={{ uri: preview }} 
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="contain"
                />
                <TouchableOpacity 
                  style={styles.playButton}
                  onPress={() => {
                    Alert.alert('Video Preview', 'Video playback will be implemented in a separate view');
                  }}
                >
                  <Text style={styles.playButtonText}>▶️</Text>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity onPress={removeMedia} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={pickMedia} style={styles.uploadArea}>
            <Text style={styles.uploadIcon}>📤</Text>
            <Text style={styles.uploadText}>Tap to add photos or videos</Text>
          </TouchableOpacity>
        )}

        <View style={styles.optionsContainer}>
          <Text style={styles.optionsTitle}>Add to post</Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity style={styles.optionButton} onPress={pickMedia}>
              <Text style={[styles.optionIcon, styles.mediaIcon]}>🖼️</Text>
              <Text style={styles.optionText}>Media</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <Text style={[styles.optionIcon, styles.feelingIcon]}>😊</Text>
              <Text style={styles.optionText}>Feeling</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: 'white',
  },
  cancelButton: {
    color: '#6c757d',
    fontSize: 16,
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#212529',
  },
  shareButton: {
    color: '#3B82F6',
    fontWeight: '600',
    fontSize: 16,
  },
  shareButtonDisabled: {
    color: '#a5d8ff',
  },
  scrollContainer: {
    flex: 1,
    padding: 15,
  },
  captionContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f3f5',
    marginRight: 10,
  },
  captionInput: {
    flex: 1,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  captionBottom: {
    alignSelf: 'flex-end',
    marginBottom: 15,
  },
  charCount: {
    color: '#adb5bd',
    fontSize: 12,
  },
  charCountWarning: {
    color: '#ff6b6b',
  },
  previewContainer: {
    height: 300,
    backgroundColor: 'black',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 20,
    lineHeight: 30,
  },
  uploadArea: {
    height: 150,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  uploadIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  uploadText: {
    color: '#495057',
    fontSize: 16,
  },
  optionsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  optionsTitle: {
    color: '#6c757d',
    fontSize: 12,
    marginBottom: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  optionIcon: {
    marginRight: 5,
  },
  mediaIcon: {
    color: '#3B82F6',
  },
  feelingIcon: {
    color: '#ffd43b',
  },
  optionText: {
    color: '#495057',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    fontSize: 24,
  },
});

export default UploadPost;