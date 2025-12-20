import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { EventBannerCard } from './eventscards';
import BottomNav from '../navigation/BottomNav';
import TopNav from '../navigation/TopNav';
import EventCard from '../EventCard';
// Types
type DateObject = { year: number; month: number; day: number };

type Event = {
  date: string;
  title: string;
  description?: string;
};

const events: Event[] = [
  { date: '2024-01-02', title: 'New Year' },
  { date: '2024-01-05', title: 'Market Fair' },
];

const ENGLISH_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const ENGLISH_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface CalendarProps {
  initialDate?: Date;
  onDateSelect?: (date: Date) => void;
  events?: Event[];
}



const Calendar: React.FC<CalendarProps> = ({
  events = [],
  initialDate = new Date(),
  onDateSelect,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [selectedDate, setSelectedDate] = useState<DateObject>({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
    day: currentDate.getDate()
  });

  // Get month info
  const getMonthInfo = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    return {
      year,
      month,
      monthName: ENGLISH_MONTHS[month],
      daysInMonth,
      firstDay
    };
  };

  const monthInfo = getMonthInfo();

  const changeMonth = (increment: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(monthInfo.year, monthInfo.month, day);
    setCurrentDate(newDate);
    setSelectedDate({
      year: newDate.getFullYear(),
      month: newDate.getMonth() + 1,
      day: newDate.getDate()
    });
    
    if (onDateSelect) {
      onDateSelect(newDate);
    }
  };

  const renderDays = () => {
    const days = [];
    const today = new Date();
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < monthInfo.firstDay; i++) {
      days.push(
        <View key={`empty-${i}`} style={[styles.calendarDay, styles.emptyDay]} />
      );
    }

    // Days of the month
    for (let day = 1; day <= monthInfo.daysInMonth; day++) {
      const date = new Date(monthInfo.year, monthInfo.month, day);
      const isToday = date.getDate() === today.getDate() && 
                     date.getMonth() === today.getMonth() && 
                     date.getFullYear() === today.getFullYear();
      const isSelected = date.getDate() === selectedDate.day && 
                        date.getMonth() === selectedDate.month - 1 && 
                        date.getFullYear() === selectedDate.year;

      days.push(
        <TouchableOpacity
          key={`day-${day}`}
          style={[
            styles.calendarDay,
            isToday && styles.today,
            isSelected && styles.selected
          ]}
          onPress={() => handleDateSelect(day)}
        >
          <Text style={[
            styles.dayNumber,
            isToday && styles.todayText,
            isSelected && styles.selectedText
          ]}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return days;
  };

 return (
  <View style={styles.container}>
    {/* Add TopNav component */}
    <TopNav 
      title={`${ENGLISH_MONTHS[monthInfo.month]} ${monthInfo.year}`}
      rightAction={
        <View style={styles.calendarNavButtons}>
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => changeMonth(-1)}
          >
            <Icon name="chevron-left" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => changeMonth(1)}
          >
            <Icon name="chevron-right" size={20} color="white" />
          </TouchableOpacity>
        </View>
      }
    />

    <ScrollView style={styles.scrollView}>
      {/* Removed the old header */}
      
      <View style={styles.weekdays}>
        {ENGLISH_WEEKDAYS.map(day => (
          <Text key={day} style={styles.weekdayText}>{day}</Text>
        ))}
      </View>

      <View style={styles.daysGrid}>
        {renderDays()}
      </View>
        <Text >Loading videos...</Text>

      <EventBannerCard
        image="https://source.unsplash.com/featured/?conference"
        title="Tech Talk 2025"
        date="May 10, 2025"
        location="Austin, TX"
      />
    </ScrollView>
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  scrollView: {
    flex: 1,
    marginTop: 0, // Adjust based on TopNav height
  },
  monthYearContainer: {
    backgroundColor: '#11182e',
    padding: 20,
    alignItems: 'center',
    paddingTop: 40, // Extra padding to account for TopNav
  },
  monthYear: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  navArrows: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    position: 'absolute',
    top: '50%',
  },
  navArrow: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekdays: {
    flexDirection: 'row',
    backgroundColor: '#2A4365',
    paddingVertical: 10,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  emptyDay: {
    backgroundColor: 'transparent',
  },
  dayNumber: {
    fontSize: 16,
    color: '#333',
  },
  today: {
    backgroundColor: '#3182ce',
    borderRadius: 8,
  },
  todayText: {
    color: 'white',
  },
  selected: {
    backgroundColor: '#2C5282',
    borderRadius: 8,
  },
  selectedText: {
    color: 'white',
    fontWeight: 'bold',
  },
  calendarNavButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Modify these existing styles:
 

});

export default Calendar;