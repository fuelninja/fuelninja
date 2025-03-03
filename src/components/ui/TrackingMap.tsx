
import React, { useEffect, useState, useRef } from 'react';
import { MapPin, Navigation, Clock, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
    status: 'confirmed', // Changed initial status from 'pending' to 'confirmed'
    driverName: 'Michael Rodriguez',
    eta: '25-30 minutes'
  });
  
  // Use a ref to track if delivery has been completed
  const deliveryCompletedRef = useRef(false);
  
  useEffect(() => {
    // Notify parent of initial status
    if (onStatusChange) {
      onStatusChange(deliveryStatus.status);
    }
    
    // This would be an API call in a real app
    // Simulating delivery progress for demo - starting at 'en-route'
    const simulateDelivery = () => {
      const statuses: DeliveryStatus[] = [
        // 'pending' removed as we're starting at 'confirmed' now
        // 'confirmed' is now the initial state, so we start with 'en-route'
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
      
      // Show toast notification that order is confirmed
      toast({
        title: "Order Confirmed",
        description: "Your driver has been assigned and is preparing for delivery.",
      });
      
      const interval = setInterval(() => {
        // Check if we've already reached the delivered state
        if (deliveryCompletedRef.current) {
          clearInterval(interval);
          return;
        }
        
        if (index < statuses.length) {
          const newStatus = statuses[index];
          setDeliveryStatus(newStatus);
          
          // Notify parent component about status change
          if (onStatusChange) {
            onStatusChange(newStatus.status);
          }
          
          // Mark as completed if we've reached the delivered state
          if (newStatus.status === 'delivered') {
            deliveryCompletedRef.current = true;
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
    <div className="glass-card p-5 space-y-6 animate-fade-in bg-white shadow-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-navy-blue">Tracking Delivery</h2>
        <div className="text-xs font-medium bg-navy-blue/10 text-navy-blue px-2 py-1 rounded-full">
          Order #{orderId}
        </div>
      </div>
      
      {/* Delivery Status Progress Bar - Fixed to prevent glitching */}
      <div className="relative">
        <div className="flex justify-between mb-2">
          {statusSteps.map((step, index) => {
            const currentStepIndex = getCurrentStepIndex();
            const isCompleted = index < currentStepIndex;
            const isActive = index === currentStepIndex;
            
            return (
              <div key={step.key} className="flex flex-col items-center">
                <div 
                  className={`w-7 h-7 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                    isCompleted
                      ? 'bg-navy-blue text-white' 
                      : isActive
                        ? 'bg-ninja-orange text-white ring-4 ring-ninja-orange/20'
                        : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </div>
                <span className={`text-xs mt-1 text-center font-medium ${
                  isCompleted || isActive ? 'text-navy-blue' : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Progress line - background */}
        <div className="absolute top-3.5 left-0 w-full h-1 bg-gray-200 -z-10" />
        
        {/* Progress line - fill with darker blue */}
        <div 
          className="absolute top-3.5 left-0 h-1 bg-navy-blue transition-all duration-1000 -z-10" 
          style={{ 
            width: `${getCurrentStepIndex() === 0 ? 0 : getCurrentStepIndex() / (statusSteps.length - 1) * 100}%` 
          }}
        />
      </div>
      
      {/* Driver location and information - Updated with darker blue */}
      {deliveryStatus.driverName && (
        <div className="flex items-center bg-navy-blue/5 p-3 rounded-lg border border-navy-blue/10">
          <div className="w-10 h-10 bg-navy-blue text-white rounded-full flex items-center justify-center font-bold mr-3">
            {deliveryStatus.driverName.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="font-medium text-navy-blue">{deliveryStatus.driverName}</div>
            {deliveryStatus.status !== 'delivered' && (
              <div className="text-sm text-gray-600 flex items-center">
                <Clock className="w-3 h-3 mr-1 text-ninja-orange" /> 
                ETA: {deliveryStatus.eta}
              </div>
            )}
          </div>
          {deliveryStatus.driverLocation && (
            <div className="text-sm bg-navy-blue/10 text-navy-blue px-2 py-1 rounded-full flex items-center">
              <Navigation className="w-3 h-3 mr-1" />
              {deliveryStatus.driverLocation}
            </div>
          )}
        </div>
      )}
      
      {/* Status message - Updated with darker blue */}
      <div className="text-center text-sm p-2 bg-gray-50 rounded-lg border border-navy-blue/10 text-navy-blue">
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
