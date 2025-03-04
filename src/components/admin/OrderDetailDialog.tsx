import React, { useState, useEffect } from 'react';
import { OrderData } from '@/utils/DataService';
import { DeliveryDriverInfo } from '@/utils/types';
import { format } from 'date-fns';
import { MapPin, Calendar, User, Truck, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OrderStatusBadge from './OrderStatusBadge';
import DriverManagement from './DriverManagement';

interface OrderDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderData | null;
  onStatusChange: (orderId: string, newStatus: string) => void;
}

const OrderDetailDialog: React.FC<OrderDetailDialogProps> = ({ 
  open, 
  onOpenChange, 
  order, 
  onStatusChange 
}) => {
  const [availableDrivers, setAvailableDrivers] = useState<DeliveryDriverInfo[]>([]);
  const [selectedDriverIndex, setSelectedDriverIndex] = useState<string>("");
  
  // Load available drivers from system config
  useEffect(() => {
    if (open) {
      try {
        const configData = localStorage.getItem('fuelninja-tracking-config');
        if (configData) {
          const config = JSON.parse(configData);
          if (config.activeDrivers && Array.isArray(config.activeDrivers)) {
            setAvailableDrivers(config.activeDrivers);
            
            // If order has a driver assigned, try to find and select that driver
            if (order?.driverInfo) {
              const driverIndex = config.activeDrivers.findIndex(
                (d: DeliveryDriverInfo) => d.name === order.driverInfo?.name
              );
              if (driverIndex >= 0) {
                setSelectedDriverIndex(driverIndex.toString());
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading drivers:', error);
      }
    }
  }, [open, order]);

  const handleAddDriver = (newDriver: DeliveryDriverInfo) => {
    try {
      const configData = localStorage.getItem('fuelninja-tracking-config') || '{}';
      const config = JSON.parse(configData);
      const updatedDrivers = [...(config.activeDrivers || []), newDriver];
      
      localStorage.setItem('fuelninja-tracking-config', JSON.stringify({
        ...config,
        activeDrivers: updatedDrivers
      }));
      
      setAvailableDrivers(updatedDrivers);
    } catch (error) {
      console.error('Error adding driver:', error);
    }
  };
  
  const formatTimestamp = (timestamp: number) => {
    return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
  };

  const assignDriver = () => {
    if (!selectedDriverIndex || !order) return;
    
    const driverIndex = parseInt(selectedDriverIndex);
    if (isNaN(driverIndex) || driverIndex < 0 || driverIndex >= availableDrivers.length) return;
    
    const selectedDriver = availableDrivers[driverIndex];
    
    // Import and use OrderService directly to assign driver
    import('@/utils/OrderService').then((OrderService) => {
      const success = OrderService.default.assignDriverToOrder(order.orderId, selectedDriver);
      if (success) {
        // Update order status to confirmed if it's still pending
        if (order.status === 'pending') {
          onStatusChange(order.orderId, 'confirmed');
        }
      }
    });
  };

  if (!order) return null;

  const canProgress = (currentStatus: string): boolean => {
    const statusOrder = ['pending', 'confirmed', 'en-route', 'arriving', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    return currentIndex >= 0 && currentIndex < statusOrder.length - 1;
  };

  const getNextStatus = (currentStatus: string): string => {
    const statusOrder = ['pending', 'confirmed', 'en-route', 'arriving', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    return statusOrder[currentIndex + 1];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Order #{order.orderId.substring(0, 8)}</DialogTitle>
          <DialogDescription>
            Created on {formatTimestamp(order.createdAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Order Status</h3>
            <OrderStatusBadge status={order.status} />
          </div>
          
          <Separator />
          
          {/* Driver Assignment Section */}
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
              
              <DriverManagement onDriverAdded={handleAddDriver} />
              
              {order.driverInfo && (
                <div className="mt-2 text-sm bg-green-50 text-green-700 p-2 rounded flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Currently assigned: {order.driverInfo.name}
                </div>
              )}
            </div>
          </div>
          
          <Separator />
          
          {/* Manual Status Progress Controls */}
          <div>
            <h3 className="font-semibold mb-2">Update Delivery Status</h3>
            {canProgress(order.status) ? (
              <Button 
                onClick={() => onStatusChange(order.orderId, getNextStatus(order.status))}
                className="w-full"
              >
                <Navigation className="mr-2 h-4 w-4" />
                Progress to {getNextStatus(order.status)}
              </Button>
            ) : (
              <Button disabled className="w-full">
                Order Complete
              </Button>
            )}
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-semibold mb-2">Fuel Information</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p className="text-gray-600">Fuel Type:</p>
              <p>{order.fuelType}</p>
              <p className="text-gray-600">Amount:</p>
              <p>{order.amount} gallons</p>
              <p className="text-gray-600">Price:</p>
              <p className="font-semibold">{order.price}</p>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-semibold mb-2">Delivery Information</h3>
            <div className="text-sm space-y-2">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-1 text-gray-500" />
                <p>{order.deliveryAddress}</p>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <p>{order.scheduledTime}</p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-semibold mb-2">Vehicle Information</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p className="text-gray-600">Make:</p>
              <p>{order.carInfo.make}</p>
              <p className="text-gray-600">Model:</p>
              <p>{order.carInfo.model}</p>
              <p className="text-gray-600">Color:</p>
              <p>{order.carInfo.color}</p>
              <p className="text-gray-600">Year:</p>
              <p>{order.carInfo.year}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
