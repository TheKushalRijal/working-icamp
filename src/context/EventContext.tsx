import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  const [events, setEvents] = useState<Event[]>([
    {
      id: 3,
    title: "TSA visa Revoked",
      date: "2024-03-31",
      image: "https://example.com/nepali-snacks.jpg",
    location: "",
    description: "Around 7000 Nepali people's Temporary Visa got revoked",
    },
    {
      id: 4,
    title: "Career Fair",
      date: "2024-03-14",
      image: "https://example.com/holi-celebration.jpg",
      location: "The Green at College Park",
    description: "Annual career fair with top companies",
    }








  ]);

  const addEvent = (event: Event) => {
    setEvents([...events, event]);
  };

  return (
    <EventContext.Provider value={{ events, addEvent }}>
      {children}
    </EventContext.Provider>
  );
};