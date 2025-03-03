
import React, { useState } from 'react';
import { Clock, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isToday, addDays, isBefore, startOfDay } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DeliverySchedulerProps {
  onChange: (date: Date) => void;
}

const DeliveryScheduler: React.FC<DeliverySchedulerProps> = ({ onChange }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  // Generate available delivery times for the selected day
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
  
  const handleCalendarSelect = (date: Date | undefined) => {
    if (!date) return;
    
    // Ensure we don't select dates in the past
    const today = startOfDay(new Date());
    if (isBefore(date, today)) {
      date = today;
    }
    
    setSelectedDate(date);
    setSelectedTime(''); // Reset time when date changes
    setCalendarOpen(false); // Close calendar after selection
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
  
  const timeSlots = generateTimeSlots();
  
  // Function to format date display
  const formatDateDisplay = (date: Date) => {
    if (isToday(date)) {
      return 'Today';
    } else if (isToday(addDays(date, -1))) {
      return 'Tomorrow';
    } else {
      return format(date, 'EEE, MMM d');
    }
  };

  // Get days for the quick date selection
  const getQuickDateOptions = () => {
    const today = new Date();
    return [
      { label: 'Today', days: 0, date: today },
      { label: 'Tomorrow', days: 1, date: addDays(today, 1) },
      { label: format(addDays(today, 2), 'EEE, MMM d'), days: 2, date: addDays(today, 2) },
      { label: format(addDays(today, 3), 'EEE, MMM d'), days: 3, date: addDays(today, 3) },
    ];
  };
  
  const dateOptions = getQuickDateOptions();
  
  const handleQuickDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(''); // Reset time when date changes
  };
  
  // Date constraints for the calendar
  const today = new Date();
  const fourWeeksFromNow = addDays(today, 28);
  
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
        {/* Calendar Popover */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Selected Date:</span>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? formatDateDisplay(selectedDate) : "Select date"}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleCalendarSelect}
                disabled={(date) => isBefore(date, today) || isBefore(fourWeeksFromNow, date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Quick date selection */}
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          {dateOptions.map((option) => (
            <button
              key={option.days}
              onClick={() => handleQuickDateSelect(option.date)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm transition-all duration-300 ${
                selectedDate && isToday(selectedDate) && option.days === 0
                  ? 'bg-ninja-orange text-white'
                  : selectedDate && 
                    selectedDate.getDate() === option.date.getDate() &&
                    selectedDate.getMonth() === option.date.getMonth() &&
                    selectedDate.getFullYear() === option.date.getFullYear()
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
        
        <div className="border-t border-gray-200 my-3"></div>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Available Times:</span>
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
