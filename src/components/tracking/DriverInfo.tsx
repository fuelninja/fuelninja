
import React from 'react';
import { Clock, Navigation, User } from 'lucide-react';

interface DriverInfoProps {
  driverName: string;
  eta?: string;
  driverLocation?: string;
  status: string;
}

const DriverInfo: React.FC<DriverInfoProps> = ({ 
  driverName, 
  eta, 
  driverLocation, 
  status 
}) => {
  return (
    <div className="flex flex-col bg-navy-blue/5 p-3 rounded-lg border border-navy-blue/10">
      <div className="flex items-center mb-2">
        <div className="w-10 h-10 bg-navy-blue text-white rounded-full flex items-center justify-center font-bold mr-3">
          {driverName.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="font-medium text-navy-blue">{driverName}</div>
          <div className="text-sm text-gray-600 flex items-center">
            <User className="w-3 h-3 mr-1 text-navy-blue" /> 
            Your delivery driver
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-1">
        {status !== 'delivered' && eta && (
          <div className="text-sm text-gray-600 flex items-center">
            <Clock className="w-3 h-3 mr-1 text-ninja-orange" /> 
            ETA: {eta}
          </div>
        )}
        
        {driverLocation && (
          <div className="text-sm bg-navy-blue/10 text-navy-blue px-2 py-1 rounded-full flex items-center">
            <Navigation className="w-3 h-3 mr-1" />
            {driverLocation}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverInfo;
