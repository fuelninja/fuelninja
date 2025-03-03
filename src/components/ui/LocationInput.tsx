
import React, { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface LocationInputProps {
  onChange: (location: string, isCurrentLocation: boolean) => void;
}

const LocationInput: React.FC<LocationInputProps> = ({ onChange }) => {
  const [location, setLocation] = useState<string>('');
  const [isCurrentLocation, setIsCurrentLocation] = useState<boolean>(false);
  
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocation = e.target.value;
    setLocation(newLocation);
    setIsCurrentLocation(false);
    onChange(newLocation, false);
  };
  
  const handleUseCurrentLocation = () => {
    // In a real app, this would use the Geolocation API
    setIsCurrentLocation(true);
    setLocation('Current Location');
    onChange('Current Location', true);
  };
  
  return (
    <div className="glass-card p-5 space-y-4 animate-fade-in">
      <h2 className="text-lg font-semibold">Delivery Location</h2>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <MapPin className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-ninja-orange focus:border-ninja-orange block w-full pl-10 p-2.5"
          placeholder="Enter your delivery address"
          value={location}
          onChange={handleLocationChange}
        />
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <Navigation className={`w-5 h-5 ${isCurrentLocation ? 'text-ninja-orange' : 'text-gray-400'}`} />
        </button>
      </div>
      
      <div className="text-xs text-gray-500">
        Enter your complete address for accurate delivery
      </div>
    </div>
  );
};

export default LocationInput;
