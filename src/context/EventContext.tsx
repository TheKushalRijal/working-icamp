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
    id: 1,
    title: "UTA Fall Classes",
    date: "2025-08-18",
    image: "https://example.com/nepali-snacks.jpg",
    location: "",
    description: "Fall classes are regularly starting from August 18 2025",
  },
  {
    id: 2,
    title: "TSA visa Revoked",
    date: "2024-03-31",
    image: "https://example.com/nepali-snacks.jpg",
    location: "",
    description: "Around 7000 Nepali people's Temporary Visa got revoked",
  },
  {
    id: 3,
    title: "Career Fair",
    date: "2024-03-14",
    image: "https://example.com/holi-celebration.jpg",
    location: "The Green at College Park",
    description: "Annual career fair with top companies",
  },
  {
    id: 4,
    title: "2nd General Board Meeting",
    date: "2024-03-31",
    image: "https://example.com/nepali-snacks.jpg",
    location: "TBD",
    description: "Enjoy free Nepali snacks and hear from a special guest speaker from @bholikonepalfoundation."
  },
  {
    id: 5,
    title: "Holi Celebration",
    date: "2024-03-14",
    image: "https://example.com/holi-celebration.jpg",
    location: "The Green at College Park",
    description: "A parade of vibrant colors powdered The Green in celebration of Holi, brought by the Nepalese Students’ Association."
  },
  {
    id: 6,
    title: "When to Apply for summer Internship 2026?",
    date: "2024-03-14",
    image: "https://example.com/holi-celebration.jpg",
    location: "The Green at College Park",
    description: "Apply the internship in the month of September 2025 for summer 2026 internship. This is the best time to apply as most of the companies start recruiting in this month.After reading countless reddit posts and doing my own research, I have compiled a list of the best times to apply for internships based on the type of internship you are looking for. So apply as soon as possible."
  },












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