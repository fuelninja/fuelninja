
import React from 'react';
import { OrderData } from '@/utils/types';
import { MapPin, Calendar } from 'lucide-react';

interface OrderInfoSectionProps {
  order: OrderData;
  title: string;
  type: 'fuel' | 'delivery' | 'vehicle';
}

const OrderInfoSection: React.FC<OrderInfoSectionProps> = ({ order, title, type }) => {
  return (
    <div>
      <h3 className="font-semibold mb-2">{title}</h3>
      
      {type === 'fuel' && (
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p className="text-gray-600">Fuel Type:</p>
          <p>{order.fuelType}</p>
          <p className="text-gray-600">Amount:</p>
          <p>{order.amount} gallons</p>
          <p className="text-gray-600">Price:</p>
          <p className="font-semibold">{order.price}</p>
        </div>
      )}
      
      {type === 'delivery' && (
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
      )}
      
      {type === 'vehicle' && (
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
      )}
    </div>
  );
};

export default OrderInfoSection;
