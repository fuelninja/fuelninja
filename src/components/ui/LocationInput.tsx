
import React, { useState } from 'react';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';

interface LocationInputProps {
  onChange: (location: string, isCurrentLocation: boolean) => void;
}

const LocationInput: React.FC<LocationInputProps> = ({ onChange }) => {
  const [location, setLocation] = useState<string>('');
  const [isCurrentLocation, setIsCurrentLocation] = useState<boolean>(false);
  const [isInServiceArea, setIsInServiceArea] = useState<boolean | null>(null);
  
  // Houston area zip codes (simplified for demo)
  const serviceAreaZips = [
    '77001', '77002', '77003', '77004', '77005', 
    '77006', '77007', '77008', '77009', '77010',
    // more Houston and surrounding area zip codes would be added here
  ];
  
  const checkServiceArea = (zip: string) => {
    return serviceAreaZips.includes(zip);
  };
  
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocation = e.target.value;
    setLocation(newLocation);
    setIsCurrentLocation(false);
    
    // Simple validation - check if input contains a valid ZIP code
    const zipMatch = newLocation.match(/\b\d{5}\b/);
    if (zipMatch) {
      const isValid = checkServiceArea(zipMatch[0]);
      setIsInServiceArea(isValid);
    } else {
      setIsInServiceArea(null);
    }
    
    onChange(newLocation, false);
  };
  
  const handleUseCurrentLocation = () => {
    // In a real app, this would use the Geolocation API
    setIsCurrentLocation(true);
    setLocation('Current Location');
    setIsInServiceArea(true); // Assuming current location is valid
    
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
          placeholder="Enter your address"
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
      
      {isInServiceArea === false && (
        <div className="flex items-center text-red-500 text-sm">
          <AlertCircle className="w-4 h-4 mr-1" />
          <span>Sorry, we don't service this area yet.</span>
        </div>
      )}
      
      {isInServiceArea === true && (
        <div className="flex items-center text-ninja-green text-sm">
          <MapPin className="w-4 h-4 mr-1" />
          <span>Great! We service this area.</span>
        </div>
      )}
      
      <div className="text-xs text-gray-500">
        Currently serving Houston, TX and surrounding areas only
      </div>
    </div>
  );
};

export default LocationInput;
