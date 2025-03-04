
import React, { useState } from 'react';
import { DeliveryDriverInfo, OrderData } from '@/utils/types';
import { Button } from '@/components/ui/button';
import { Truck, User } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DriverManagement from '../DriverManagement';

interface DriverAssignmentProps {
  order: OrderData;
  availableDrivers: DeliveryDriverInfo[];
  selectedDriverIndex: string;
  setSelectedDriverIndex: (value: string) => void;
  onDriverAdded: (driver: DeliveryDriverInfo) => void;
  assignDriver: () => void;
}

const DriverAssignment: React.FC<DriverAssignmentProps> = ({
  order,
  availableDrivers,
  selectedDriverIndex,
  setSelectedDriverIndex,
  onDriverAdded,
  assignDriver
}) => {
  return (
    <div>
      <h3 className="font-semibold mb-2">Manage Driver</h3>
      <div className="space-y-4">
        <div className="flex gap-2">
          <Select 
            value={selectedDriverIndex} 
            onValueChange={setSelectedDriverIndex}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select a driver" />
            </SelectTrigger>
            <SelectContent>
              {availableDrivers.length === 0 ? (
                <SelectItem value="none" disabled>
                  No drivers available
                </SelectItem>
              ) : (
                availableDrivers.map((driver, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {driver.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <Button onClick={assignDriver} disabled={!selectedDriverIndex}>
            <Truck className="mr-2 h-4 w-4" />
            Assign
          </Button>
        </div>
        
        <DriverManagement onDriverAdded={onDriverAdded} />
        
        {order.driverInfo && (
          <div className="mt-2 text-sm bg-green-50 text-green-700 p-2 rounded flex items-center">
            <User className="h-4 w-4 mr-2" />
            Currently assigned: {order.driverInfo.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverAssignment;
