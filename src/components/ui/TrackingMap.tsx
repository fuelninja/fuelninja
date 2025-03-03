import React, { useEffect, useState } from 'react';
import { MapPin, Navigation, Clock, CheckCircle } from 'lucide-react';

interface DeliveryStatus {
  status: 'pending' | 'confirmed' | 'en-route' | 'arriving' | 'delivered';
  eta?: string;
  driverName?: string;
  driverLocation?: string;
}

interface TrackingMapProps {
  orderId: string;
  onStatusChange?: (status: string) => void;
}

const TrackingMap: React.FC<TrackingMapProps> = ({ orderId, onStatusChange }) => {
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>({
    status: 'pending'
  });
  
  useEffect(() => {
    // This would be an API call in a real app
    // Simulating delivery progress for demo
    const simulateDelivery = () => {
      const statuses: DeliveryStatus[] = [
        { status: 'pending' },
        { 
          status: 'confirmed', 
          driverName: 'Michael Rodriguez',
          eta: '25-30 minutes' 
        },
        { 
          status: 'en-route', 
          driverName: 'Michael Rodriguez',
          driverLocation: '3.2 miles away',
          eta: '15-20 minutes' 
        },
        { 
          status: 'arriving', 
          driverName: 'Michael Rodriguez',
          driverLocation: '0.5 miles away',
          eta: '2-5 minutes' 
        },
        { 
          status: 'delivered', 
          driverName: 'Michael Rodriguez',
        }
      ];
      
      let index = 0;
      
      const interval = setInterval(() => {
        if (index < statuses.length) {
          const newStatus = statuses[index];
          setDeliveryStatus(newStatus);
          
          // Notify parent component about status change
          if (onStatusChange) {
            onStatusChange(newStatus.status);
          }
          
          index++;
        } else {
          clearInterval(interval);
        }
      }, 5000); // Update every 5 seconds for demo
      
      return () => clearInterval(interval);
    };
    
    simulateDelivery();
  }, [orderId, onStatusChange]);
  
  const statusSteps = [
    { key: 'pending', label: 'Order Placed' },
    { key: 'confirmed', label: 'Driver Assigned' },
    { key: 'en-route', label: 'On The Way' },
    { key: 'arriving', label: 'Almost There' },
    { key: 'delivered', label: 'Delivered' },
  ];
  
  const getCurrentStepIndex = () => {
    return statusSteps.findIndex(step => step.key === deliveryStatus.status);
  };
  
  return (
    <div className="glass-card p-5 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Tracking Delivery</h2>
        <div className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-full">
          Order #{orderId}
        </div>
      </div>
      
      {/* Delivery Status Progress Bar */}
      <div className="relative">
        <div className="flex justify-between mb-2">
          {statusSteps.map((step, index) => (
            <div key={step.key} className="flex flex-col items-center">
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${
                  index <= getCurrentStepIndex() 
                    ? 'bg-ninja-orange text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {index < getCurrentStepIndex() ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <span className="text-xs">{index + 1}</span>
                )}
              </div>
              <span className="text-xs mt-1 text-center">{step.label}</span>
            </div>
          ))}
        </div>
        
        {/* Progress line */}
        <div className="absolute top-3 left-0 w-full h-0.5 bg-gray-200 -z-10" />
        <div 
          className="absolute top-3 left-0 h-0.5 bg-ninja-orange transition-all duration-1000 -z-10" 
          style={{ 
            width: `${getCurrentStepIndex() === 0 ? 0 : getCurrentStepIndex() / (statusSteps.length - 1) * 100}%` 
          }}
        />
      </div>
      
      {/* Placeholder for the map */}
      <div className="bg-gray-100 h-40 rounded-lg flex items-center justify-center overflow-hidden relative">
        <div className="text-gray-400">Map View</div>
        
        {/* Map pins - would be replaced with actual map */}
        <div className="absolute left-1/4 top-1/3">
          <MapPin className="w-6 h-6 text-ninja-green" />
        </div>
        
        {(deliveryStatus.status === 'en-route' || deliveryStatus.status === 'arriving') && (
          <div className="absolute right-1/3 bottom-1/3 animate-pulse">
            <Navigation className="w-6 h-6 text-ninja-orange" />
          </div>
        )}
      </div>
      
      {/* Driver information */}
      {deliveryStatus.driverName && (
        <div className="flex items-center bg-gray-50 p-3 rounded-lg">
          <div className="w-10 h-10 bg-ninja-black text-white rounded-full flex items-center justify-center font-bold mr-3">
            {deliveryStatus.driverName.charAt(0)}
          </div>
          <div>
            <div className="font-medium">{deliveryStatus.driverName}</div>
            {deliveryStatus.status !== 'delivered' && (
              <div className="text-sm text-gray-500 flex items-center">
                <Clock className="w-3 h-3 mr-1" /> 
                ETA: {deliveryStatus.eta}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Status message */}
      <div className="text-center text-sm">
        {deliveryStatus.status === 'pending' && 'Confirming your order...'}
        {deliveryStatus.status === 'confirmed' && 'Driver has been assigned and is preparing for delivery.'}
        {deliveryStatus.status === 'en-route' && `Driver is ${deliveryStatus.driverLocation} from your location.`}
        {deliveryStatus.status === 'arriving' && 'Driver is arriving soon!'}
        {deliveryStatus.status === 'delivered' && 'Fuel has been delivered. Thank you!'}
      </div>
    </div>
  );
};

export default TrackingMap;
