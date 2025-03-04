
import { useState, useEffect } from 'react';
import { DeliveryStep } from '@/utils/types';

export const useTrackingSteps = () => {
  const [statusSteps, setStatusSteps] = useState<DeliveryStep[]>([]);
  
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
  
  return { statusSteps };
};
