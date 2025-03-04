
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { DeliveryStep } from '@/utils/types';

interface TrackingStatusProps {
  statusSteps: DeliveryStep[];
  currentStatus: string;
}

const TrackingStatus: React.FC<TrackingStatusProps> = ({ statusSteps, currentStatus }) => {
  const getCurrentStepIndex = () => {
    return statusSteps.findIndex(step => step.key === currentStatus);
  };
  
  return (
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
  );
};

export default TrackingStatus;
