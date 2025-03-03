
import React, { useState } from 'react';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface DeliverySchedulerProps {
  onChange: (date: Date) => void;
}

const DeliveryScheduler: React.FC<DeliverySchedulerProps> = ({ onChange }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  // Generate available delivery times for the current day
  const generateTimeSlots = () => {
    const currentHour = new Date().getHours();
    const slots = [];
    
    // Start from next available hour or 9AM for future dates
    const startHour = isToday(selectedDate) ? Math.max(currentHour + 1, 9) : 9;
    const endHour = 20; // Until 8PM
    
    for (let hour = startHour; hour <= endHour; hour++) {
      const timeString = `${hour % 12 || 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
      slots.push(timeString);
    }
    
    return slots;
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  const handleDateSelect = (daysToAdd: number) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + daysToAdd);
    setSelectedDate(newDate);
    setSelectedTime(''); // Reset time when date changes
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    
    // Combine date and time for onChange
    const [hourMinute, meridiem] = time.split(' ');
    const [hourStr] = hourMinute.split(':');
    let hour = parseInt(hourStr);
    
    // Convert to 24-hour format
    if (meridiem === 'PM' && hour !== 12) hour += 12;
    if (meridiem === 'AM' && hour === 12) hour = 0;
    
    const dateWithTime = new Date(selectedDate);
    dateWithTime.setHours(hour, 0, 0, 0);
    
    onChange(dateWithTime);
  };
  
  const dateOptions = [
    { label: 'Today', days: 0 },
    { label: 'Tomorrow', days: 1 },
    { label: format(new Date().setDate(new Date().getDate() + 2), 'EEE, MMM d'), days: 2 },
    { label: format(new Date().setDate(new Date().getDate() + 3), 'EEE, MMM d'), days: 3 },
  ];
  
  const timeSlots = generateTimeSlots();
  
  return (
    <div className="glass-card p-5 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Delivery Time</h2>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          <span>Select a time slot</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          {dateOptions.map((option) => (
            <button
              key={option.days}
              onClick={() => handleDateSelect(option.days)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm transition-all duration-300 ${
                selectedDate && isToday(selectedDate) && option.days === 0
                  ? 'bg-ninja-orange text-white'
                  : selectedDate && 
                    selectedDate.getDate() === new Date().getDate() + option.days &&
                    selectedDate.getMonth() === new Date().getMonth() &&
                    selectedDate.getFullYear() === new Date().getFullYear()
                    ? 'bg-ninja-orange text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center gap-1">
                <CalendarIcon className="w-3 h-3" />
                <span>{option.label}</span>
              </div>
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {timeSlots.map((time) => (
            <button
              key={time}
              onClick={() => handleTimeSelect(time)}
              className={`py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedTime === time
                  ? 'bg-ninja-orange text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
        
        {timeSlots.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No delivery times available for today. Please select another day.
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryScheduler;
