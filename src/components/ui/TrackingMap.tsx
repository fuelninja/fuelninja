
import React from 'react';
import { DeliveryDriverInfo } from '@/utils/types';
import TrackingStatus from '@/components/tracking/TrackingStatus';
import DriverInfo from '@/components/tracking/DriverInfo';
import StatusMessage from '@/components/tracking/StatusMessage';
import { useTrackingSteps } from '@/hooks/useTrackingSteps';
import { useDeliverySimulation } from '@/hooks/useDeliverySimulation';

interface TrackingMapProps {
  orderId: string;
  onStatusChange?: (status: string) => void;
  driverInfo?: DeliveryDriverInfo;
}

const TrackingMap: React.FC<TrackingMapProps> = ({ orderId, onStatusChange, driverInfo }) => {
  const { statusSteps } = useTrackingSteps();
  const { deliveryStatus } = useDeliverySimulation({
    orderId,
    onStatusChange,
    driverInfo,
    statusSteps
  });
  
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
      
      {/* Delivery Status Progress Bar */}
      <TrackingStatus 
        statusSteps={statusSteps} 
        currentStatus={deliveryStatus.status} 
      />
      
      {/* Driver location and information */}
      {deliveryStatus.driverName && (
        <DriverInfo 
          driverName={deliveryStatus.driverName}
          eta={deliveryStatus.eta}
          driverLocation={deliveryStatus.driverLocation}
          status={deliveryStatus.status}
        />
      )}
      
      {/* Status message */}
      <StatusMessage 
        statusSteps={statusSteps} 
        currentStatus={deliveryStatus.status} 
      />
    </div>
  );
};

export default TrackingMap;
