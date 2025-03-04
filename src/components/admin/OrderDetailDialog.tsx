
import React from 'react';
import { OrderData } from '@/utils/DataService';
import { format } from 'date-fns';
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
import OrderStatusBadge from './OrderStatusBadge';
import { useDriverAssignment } from './orderDialog/useDriverAssignment';
import DriverAssignment from './orderDialog/DriverAssignment';
import StatusProgress from './orderDialog/StatusProgress';
import OrderInfoSection from './orderDialog/OrderInfoSection';

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
  const {
    availableDrivers,
    selectedDriverIndex,
    setSelectedDriverIndex,
    handleAddDriver,
    assignDriver
  } = useDriverAssignment(open, order);
  
  const formatTimestamp = (timestamp: number) => {
    return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
  };

  const handleAssignDriver = () => {
    const result = assignDriver();
    if (!result) return;
    
    // Import and use OrderService directly to assign driver
    import('@/utils/OrderService').then((OrderService) => {
      const success = OrderService.default.assignDriverToOrder(result.orderId, result.driver);
      if (success) {
        // Update order status to confirmed if it's still pending
        if (order?.status === 'pending') {
          onStatusChange(result.orderId, 'confirmed');
        }
      }
    });
  };

  if (!order) return null;

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
          <DriverAssignment 
            order={order}
            availableDrivers={availableDrivers}
            selectedDriverIndex={selectedDriverIndex}
            setSelectedDriverIndex={setSelectedDriverIndex}
            onDriverAdded={handleAddDriver}
            assignDriver={handleAssignDriver}
          />
          
          <Separator />
          
          {/* Manual Status Progress Controls */}
          <StatusProgress 
            currentStatus={order.status}
            onStatusChange={onStatusChange}
            orderId={order.orderId}
          />
          
          <Separator />
          
          <OrderInfoSection order={order} title="Fuel Information" type="fuel" />
          
          <Separator />
          
          <OrderInfoSection order={order} title="Delivery Information" type="delivery" />
          
          <Separator />
          
          <OrderInfoSection order={order} title="Vehicle Information" type="vehicle" />
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
