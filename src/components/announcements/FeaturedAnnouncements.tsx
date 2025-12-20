import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { DEV_BASE_URL } from '@env';

/* =======================
   TYPES
   ======================= */
type Announcement = {
  title: string;
  description: string;
};

/* =======================
   HARDCODED FALLBACK
   ======================= */
const FALLBACK_ANNOUNCEMENT: Announcement = {
  title: '📢 Welcome to Icamp',
  description: 'Stay tuned for important campus announcements.',
};

/* =======================
   COMPONENT
   ======================= */
const FeaturedAnnouncement: React.FC = () => {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    let isMounted = true;

    const syncAnnouncement = async () => {
      try {
        /* 1️⃣ READ FROM STORAGE */
        const cachedRaw = await AsyncStorage.getItem('announcement');
        let cached: Announcement | null = null;

        if (cachedRaw) {
          try {
            cached = JSON.parse(cachedRaw);
            if (isMounted) setAnnouncement(cached);
          } catch {
            // Corrupted cache → reset
            await AsyncStorage.removeItem('announcement');
          }
        }

        /* 2️⃣ IF NOTHING IN STORAGE → USE FALLBACK */
        if (!cached) {
          await AsyncStorage.setItem(
            'announcement',
            JSON.stringify(FALLBACK_ANNOUNCEMENT)
          );
          if (isMounted) setAnnouncement(FALLBACK_ANNOUNCEMENT);
        }

        /* 3️⃣ FETCH FROM BACKEND */
        const response = await axios.get(
          `${DEV_BASE_URL}/announcements/`,
          { timeout: 10000 }
        );

        const backend: Announcement | null =
          response?.data?.title && response?.data?.description
            ? response.data
            : null;

        if (!backend) return;

        /* 4️⃣ COMPARE WITH STORAGE */
        const isDifferent =
          !cached ||
          cached.title !== backend.title ||
          cached.description !== backend.description;

        if (isDifferent) {
          /* 5️⃣ UPDATE STORAGE */
          await AsyncStorage.setItem(
            'announcement',
            JSON.stringify(backend)
          );

          /* 6️⃣ RENDER UPDATED STORAGE DATA */
          if (isMounted) setAnnouncement(backend);

          console.log('🔄 Announcement updated from backend');
        }
      } catch (err: any) {
        console.error('❌ Announcement sync failed:', err?.message);
      }
    };

    syncAnnouncement();

    return () => {
      isMounted = false;
    };
  }, []);

  /* RENDER ONLY STORAGE DATA */
  if (!announcement) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{announcement.title}</Text>
      <Text style={styles.description}>{announcement.description}</Text>
    </View>
  );
};

export default FeaturedAnnouncement;

/* =======================
   STYLES
   ======================= */
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ECC94B',
    borderRadius: 8,
    padding: 6,
    marginBottom: 17,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2A4365',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#2A4365',
  },
});
