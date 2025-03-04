
import { useState, useEffect, useRef } from 'react';
import { DeliveryStep, DeliveryDriverInfo } from '@/utils/types';

interface DeliveryStatus {
  status: string;
  eta?: string;
  driverName?: string;
  driverLocation?: string;
  driverId?: number;
}

interface UseDeliverySimulationProps {
  orderId: string;
  onStatusChange?: (status: string) => void;
  driverInfo?: DeliveryDriverInfo;
  statusSteps: DeliveryStep[];
}

export const useDeliverySimulation = ({
  orderId,
  onStatusChange,
  driverInfo,
  statusSteps
}: UseDeliverySimulationProps) => {
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>({
    status: 'confirmed',
    driverName: driverInfo?.name || 'Assigned Driver',
    eta: driverInfo?.eta || '25-30 minutes'
  });
  
  // Use a ref to track if delivery has been completed
  const deliveryCompletedRef = useRef(false);
  
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
  
  return { deliveryStatus };
};
