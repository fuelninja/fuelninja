
import React from 'react';
import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';

interface StatusProgressProps {
  currentStatus: string;
  onStatusChange: (orderId: string, newStatus: string) => void;
  orderId: string;
}

const StatusProgress: React.FC<StatusProgressProps> = ({ currentStatus, onStatusChange, orderId }) => {
  const canProgress = (status: string): boolean => {
    const statusOrder = ['pending', 'confirmed', 'en-route', 'arriving', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);
    return currentIndex >= 0 && currentIndex < statusOrder.length - 1;
  };

  const getNextStatus = (status: string): string => {
    const statusOrder = ['pending', 'confirmed', 'en-route', 'arriving', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);
    return statusOrder[currentIndex + 1];
  };

  return (
    <div>
      <h3 className="font-semibold mb-2">Update Delivery Status</h3>
      {canProgress(currentStatus) ? (
        <Button 
          onClick={() => onStatusChange(orderId, getNextStatus(currentStatus))}
          className="w-full"
        >
          <Navigation className="mr-2 h-4 w-4" />
          Progress to {getNextStatus(currentStatus)}
        </Button>
      ) : (
        <Button disabled className="w-full">
          Order Complete
        </Button>
      )}
    </div>
  );
};

export default StatusProgress;
