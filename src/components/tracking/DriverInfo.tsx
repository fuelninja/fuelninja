
import React from 'react';
import { Clock, Navigation } from 'lucide-react';

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
    <div className="flex items-center bg-navy-blue/5 p-3 rounded-lg border border-navy-blue/10">
      <div className="w-10 h-10 bg-navy-blue text-white rounded-full flex items-center justify-center font-bold mr-3">
        {driverName.charAt(0)}
      </div>
      <div className="flex-1">
        <div className="font-medium text-navy-blue">{driverName}</div>
        {status !== 'delivered' && eta && (
          <div className="text-sm text-gray-600 flex items-center">
            <Clock className="w-3 h-3 mr-1 text-ninja-orange" /> 
            ETA: {eta}
          </div>
        )}
      </div>
      {driverLocation && (
        <div className="text-sm bg-navy-blue/10 text-navy-blue px-2 py-1 rounded-full flex items-center">
          <Navigation className="w-3 h-3 mr-1" />
          {driverLocation}
        </div>
      )}
    </div>
  );
};

export default DriverInfo;
