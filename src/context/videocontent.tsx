import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { AsyncStorage } from 'react-native';
interface Event {
  id: number;
  title: string;
  date: string;
  image: string;
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
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      const storedEvents = await AsyncStorage.getItem('events');
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      } else {
        // Seed default events on first load
        const defaultEvents: Event[] = [
          {
            id: 3,
            title: "2nd General Board Meeting",
            date: "2024-03-31",
            image: "https://example.com/nepali-snacks.jpg",
            location: "TBD",
            description: "Enjoy free Nepali snacks and hear from a special guest speaker from @bholikonepalfoundation."
          },
          {
            id: 4,
            title: "Holi Celebration",
            date: "2024-03-14",
            image: "https://example.com/holi-celebration.jpg",
            location: "The Green at College Park",
            description: "A parade of vibrant colors powdered The Green in celebration of Holi, brought by the Nepalese Students’ Association."
          }
        ];
        setEvents(defaultEvents);
        await AsyncStorage.setItem('events', JSON.stringify(defaultEvents));
      }
    };

    loadEvents();
  }, []);

  const addEvent = async (event: Event) => {
    const updatedEvents = [...events, event];
    setEvents(updatedEvents);
    await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
  };

  return (
    <EventContext.Provider value={{ events, addEvent }}>
      {children}
    </EventContext.Provider>
  );
};
