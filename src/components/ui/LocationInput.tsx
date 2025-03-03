
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface LocationInputProps {
  onChange: (location: string, isCurrentLocation: boolean) => void;
}

interface AddressSuggestion {
  id: string;
  text: string;
}

const LocationInput: React.FC<LocationInputProps> = ({ onChange }) => {
  const [location, setLocation] = useState<string>('');
  const [isCurrentLocation, setIsCurrentLocation] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Mock address suggestions - in a real app you would use a geocoding API
  const getMockSuggestions = (input: string): AddressSuggestion[] => {
    if (!input || input.length < 3) return [];
    
    const mockAddresses = [
      { id: '1', text: input + ' Main St, New York, NY' },
      { id: '2', text: input + ' Broadway Ave, New York, NY' },
      { id: '3', text: input + ' 5th Avenue, New York, NY' },
      { id: '4', text: input + ' Park Avenue, New York, NY' },
      { id: '5', text: input + ' Madison Ave, New York, NY' },
    ];
    
    return mockAddresses;
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocation = e.target.value;
    setLocation(newLocation);
    setIsCurrentLocation(false);
    onChange(newLocation, false);
    
    // Get address suggestions based on input
    if (newLocation.length >= 3) {
      const newSuggestions = getMockSuggestions(newLocation);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };
  
  const handleSelectSuggestion = (suggestion: AddressSuggestion) => {
    setLocation(suggestion.text);
    setIsCurrentLocation(false);
    onChange(suggestion.text, false);
    setSuggestions([]);
    setShowSuggestions(false);
  };
  
  const handleUseCurrentLocation = () => {
    // In a real app, this would use the Geolocation API
    setIsCurrentLocation(true);
    setLocation('Current Location');
    onChange('Current Location', true);
    setShowSuggestions(false);
  };
  
  return (
    <div className="glass-card p-5 space-y-4 animate-fade-in">
      <h2 className="text-lg font-semibold">Delivery Location</h2>
      
      <div className="relative" ref={suggestionRef}>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <MapPin className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-ninja-orange focus:border-ninja-orange block w-full pl-10 p-2.5"
          placeholder="Enter your delivery address"
          value={location}
          onChange={handleLocationChange}
          onFocus={() => {
            if (location.length >= 3 && suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
        />
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <Navigation className={`w-5 h-5 ${isCurrentLocation ? 'text-ninja-orange' : 'text-gray-400'}`} />
        </button>
        
        {/* Address suggestions dropdown - Updated with proper z-index and solid background */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{suggestion.text}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="text-xs text-gray-500">
        Enter your complete address for accurate delivery
      </div>
    </div>
  );
};

export default LocationInput;
