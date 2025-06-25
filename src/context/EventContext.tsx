// context/EventContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getItem, setItem } from '../utils/asyncStorage';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
  isJoined: boolean;
}

interface EventContextType {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  addEvent: (event: Event) => Promise<void>;
  updateEvent: (eventId: number, updates: Partial<Event>) => Promise<void>;
  deleteEvent: (eventId: number) => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

// Sample initial events
const initialEvents: Event[] = [
  {
    id: 1,
    title: "TSA visa Revoked",
    description: "Around 7000 Nepali people's Temporary Visa got revoked",
    date: "2025-03-20",
    location: "",
    isJoined: false
  },
  {
    id: 2,
    title: "Career Fair",
    description: "Annual career fair with top companies",
    date: "2024-04-15",
    location: "Main Hall",
    isJoined: false
  }
];

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        console.log('🔄 EventContext: Loading events...');
        setIsLoading(true);
        
        const storedEvents = await getItem('events');
        console.log('📦 EventContext: Stored events:', storedEvents);
        
        if (storedEvents) {
          const parsedEvents = JSON.parse(storedEvents);
          console.log('📋 EventContext: Parsed events:', parsedEvents);
          setEvents(parsedEvents);
        } else {
          console.log('📋 EventContext: No stored events, using initial events');
          setEvents(initialEvents);
          const success = await setItem('events', JSON.stringify(initialEvents));
          console.log('💾 EventContext: Saved initial events:', success);
        }
        setError(null);
      } catch (err) {
        console.error('❌ EventContext: Error loading events:', err);
        setError('Failed to load events');
        console.log('📋 EventContext: Using fallback initial events');
        setEvents(initialEvents); // Fallback to initial events
      } finally {
        setIsLoading(false);
        console.log('✅ EventContext: Loading completed. Events count:', events.length);
      }
    };

    loadEvents();
  }, []);

  const addEvent = async (event: Event) => {
    try {
      console.log('➕ EventContext: Adding event:', event);
      const updatedEvents = [...events, event];
      setEvents(updatedEvents);
      const success = await setItem('events', JSON.stringify(updatedEvents));
      console.log('💾 EventContext: Event added successfully:', success);
      setError(null);
    } catch (err) {
      console.error('❌ EventContext: Error adding event:', err);
      setError('Failed to add event');
      throw err;
    }
  };

  const updateEvent = async (eventId: number, updates: Partial<Event>) => {
    try {
      console.log('🔄 EventContext: Updating event:', eventId, updates);
      const updatedEvents = events.map(event =>
        event.id === eventId ? { ...event, ...updates } : event
      );
      setEvents(updatedEvents);
      const success = await setItem('events', JSON.stringify(updatedEvents));
      console.log('💾 EventContext: Event updated successfully:', success);
      setError(null);
    } catch (err) {
      console.error('❌ EventContext: Error updating event:', err);
      setError('Failed to update event');
      throw err;
    }
  };

  const deleteEvent = async (eventId: number) => {
    try {
      console.log('🗑️ EventContext: Deleting event:', eventId);
      const updatedEvents = events.filter(event => event.id !== eventId);
      setEvents(updatedEvents);
      const success = await setItem('events', JSON.stringify(updatedEvents));
      console.log('💾 EventContext: Event deleted successfully:', success);
      setError(null);
    } catch (err) {
      console.error('❌ EventContext: Error deleting event:', err);
      setError('Failed to delete event');
      throw err;
    }
  };

  console.log('🎯 EventContext: Current state:', { 
    eventsCount: events.length, 
    isLoading, 
    error,
    events: events.map(e => ({ id: e.id, title: e.title }))
  });

  return (
    <EventContext.Provider value={{ events, isLoading, error, addEvent, updateEvent, deleteEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export default EventContext;
