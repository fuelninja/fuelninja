
import React from 'react';
import { DeliveryStep } from '@/utils/types';

interface StatusMessageProps {
  statusSteps: DeliveryStep[];
  currentStatus: string;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ statusSteps, currentStatus }) => {
  const currentDescription = statusSteps.find(step => step.key === currentStatus)?.description || 'Tracking your delivery...';
  
  return (
    <div className="text-center text-sm p-2 bg-gray-50 rounded-lg border border-navy-blue/10 text-navy-blue">
      {currentDescription}
    </div>
  );
};

export default StatusMessage;
