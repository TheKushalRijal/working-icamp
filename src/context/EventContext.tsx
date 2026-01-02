import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '@env';
interface Event {
  id: number;
  title: string;
  date: string;
  image?: string;
  location: string;
  description: string;
}

interface EventContextType {
  events: Event[];
  addEvent: (event: Event) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) throw new Error('useEvents must be used within an EventProvider');
  return context;
};

const LOCAL_STORAGE_KEY = 'events';

// ✅ Backend fetch function
const getFromBackend = async () => {
  try {
    const homeResponse = await axios.get(`${BASE_URL}/home/`, {
      timeout: 10000, // 10 second timeout
      // withCredentials: true, // uncomment if needed
    });
    return homeResponse.data;
  } catch (error) {
    console.error('Error fetching home data from backend:', error);
    return [];
  }
};

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);

  const addEvent = (event: Event) => {
    setEvents((prev) => [...prev, event]);
    AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...events, event]));
  };

  // ✅ Fetch backend events and store in local storage
  useEffect(() => {
    const fetchAndStoreEvents = async () => {
      try {
        // 1️⃣ Load events from local storage first
        const storedEvents = await AsyncStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedEvents) setEvents(JSON.parse(storedEvents));

        // 2️⃣ Fetch backend events
        const backendData = await getFromBackend();
        if (backendData && Array.isArray(backendData)) {
          // Map backend data to Event interface if needed
          const backendEvents: Event[] = backendData.map((e: any) => ({
            id: e.id,
            title: e.title,
            date: e.date,
            image: e.image,
            location: e.location,
            description: e.description,
          }));

          // 3️⃣ Compare with local storage to avoid duplicates
          const localIds = storedEvents ? JSON.parse(storedEvents).map((e: Event) => e.id) : [];
          const newEvents = backendEvents.filter((e) => !localIds.includes(e.id));

          if (newEvents.length > 0) {
            const updatedEvents = [...(storedEvents ? JSON.parse(storedEvents) : []), ...newEvents];
            setEvents(updatedEvents);
            await AsyncStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedEvents));
            console.log('✅ Fetched new events from backend and saved to local storage.');
          } else {
            console.log('✅ No new events from backend.');
          }
        }
      } catch (error) {
        console.error('❌ Error fetching events:', error);
      }
    };

    fetchAndStoreEvents();
  }, []);

  return (
    <EventContext.Provider value={{ events, addEvent }}>
      {children}
    </EventContext.Provider>
  );
};
