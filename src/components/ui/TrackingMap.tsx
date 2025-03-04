
import React, { useEffect, useState, useRef } from 'react';
import { MapPin, Navigation, Clock, CheckCircle } from 'lucide-react';
import { DeliveryStep, DeliveryDriverInfo } from '@/utils/types';

interface DeliveryStatus {
  status: string;
  eta?: string;
  driverName?: string;
  driverLocation?: string;
  driverId?: number;
}

interface TrackingMapProps {
  orderId: string;
  onStatusChange?: (status: string) => void;
  driverInfo?: DeliveryDriverInfo;
}

const TrackingMap: React.FC<TrackingMapProps> = ({ orderId, onStatusChange, driverInfo }) => {
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>({
    status: 'confirmed',
    driverName: driverInfo?.name || 'Assigned Driver',
    eta: driverInfo?.eta || '25-30 minutes'
  });
  
  const [statusSteps, setStatusSteps] = useState<DeliveryStep[]>([]);
  
  // Use a ref to track if delivery has been completed
  const deliveryCompletedRef = useRef(false);

  // Load tracking configuration
  useEffect(() => {
    try {
      const configData = localStorage.getItem('fuelninja-tracking-config');
      if (configData) {
        const config = JSON.parse(configData);
        if (config.steps && Array.isArray(config.steps)) {
          // Sort steps by order
          const sortedSteps = [...config.steps].sort((a, b) => a.order - b.order);
          setStatusSteps(sortedSteps);
        }
      }
    } catch (error) {
      console.error('Error loading tracking configuration:', error);
      // Fallback to default steps
      setStatusSteps([
        { key: 'pending', label: 'Order Placed', description: 'Your order has been received', order: 1 },
        { key: 'confirmed', label: 'Driver Assigned', description: 'A driver has been assigned to your order', order: 2 },
        { key: 'en-route', label: 'On The Way', description: 'Your driver is en route to your location', order: 3 },
        { key: 'arriving', label: 'Almost There', description: 'Your driver is arriving soon', order: 4 },
        { key: 'delivered', label: 'Delivered', description: 'Your fuel has been delivered', order: 5 }
      ]);
    }
  }, []);
  
  useEffect(() => {
    // Update driver info when it changes
    if (driverInfo) {
      setDeliveryStatus(prev => ({
        ...prev,
        driverName: driverInfo.name,
        eta: driverInfo.eta
      }));
    }
  }, [driverInfo]);
  
  useEffect(() => {
    // Notify parent of initial status
    if (onStatusChange) {
      onStatusChange(deliveryStatus.status);
    }
    
    // This would be an API call in a real app
    // Simulating delivery progress for demo - starting at 'en-route'
    const simulateDelivery = () => {
      // Skip the first two steps (pending & confirmed) as we start at confirmed
      const stepKeys = statusSteps.map(step => step.key);
      const startIndex = stepKeys.indexOf('confirmed');
      
      if (startIndex < 0 || statusSteps.length < 2) return;
      
      // Get steps after 'confirmed'
      const remainingSteps = stepKeys.slice(startIndex + 1);
      
      let index = 0;
      
      const interval = setInterval(() => {
        // Check if we've already reached the delivered state
        if (deliveryCompletedRef.current) {
          clearInterval(interval);
          return;
        }
        
        if (index < remainingSteps.length) {
          const newStatus = remainingSteps[index];
          
          let updatedStatus: DeliveryStatus = {
            status: newStatus,
            driverName: deliveryStatus.driverName
          };
          
          // Add specific details based on status
          if (newStatus === 'en-route') {
            updatedStatus = {
              ...updatedStatus,
              driverLocation: '3.2 miles away',
              eta: '15-20 minutes'
            };
          } else if (newStatus === 'arriving') {
            updatedStatus = {
              ...updatedStatus,
              driverLocation: '0.5 miles away',
              eta: '2-5 minutes'
            };
          }
          
          setDeliveryStatus(updatedStatus);
          
          // Notify parent component about status change
          if (onStatusChange) {
            onStatusChange(newStatus);
          }
          
          // Mark as completed if we've reached the delivered state
          if (newStatus === 'delivered') {
            deliveryCompletedRef.current = true;
          }
          
          index++;
        } else {
          clearInterval(interval);
        }
      }, 5000); // Update every 5 seconds for demo
      
      return () => clearInterval(interval);
    };
    
    if (statusSteps.length > 0) {
      simulateDelivery();
    }
  }, [orderId, onStatusChange, statusSteps, deliveryStatus.driverName]);
  
  const getCurrentStepIndex = () => {
    return statusSteps.findIndex(step => step.key === deliveryStatus.status);
  };
  
  // If no steps are loaded yet, show loading indicator
  if (statusSteps.length === 0) {
    return (
      <div className="glass-card p-5 animate-fade-in bg-white shadow-lg">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-blue"></div>
        </div>
      </div>
    );
  }
  
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
        {statusSteps.find(step => step.key === deliveryStatus.status)?.description || 
         'Tracking your delivery...'}
      </div>
    </div>
  );
};

export default TrackingMap;
