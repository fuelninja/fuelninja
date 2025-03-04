
import React from 'react';
import { OrderData } from '@/utils/DataService';
import { format } from 'date-fns';
import { MapPin, Calendar } from 'lucide-react';
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
  const formatTimestamp = (timestamp: number) => {
    return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
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

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {order.status === 'pending' && (
            <Button 
              onClick={() => onStatusChange(order.orderId, 'in_progress')}
              className="w-full sm:w-auto"
            >
              Start Delivery
            </Button>
          )}
          
          {order.status === 'in_progress' && (
            <Button 
              onClick={() => onStatusChange(order.orderId, 'delivered')}
              className="w-full sm:w-auto"
            >
              Mark as Delivered
            </Button>
          )}
          
          {order.status === 'delivered' && (
            <Button 
              variant="outline" 
              disabled
              className="w-full sm:w-auto"
            >
              Order Completed
            </Button>
          )}
          
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
