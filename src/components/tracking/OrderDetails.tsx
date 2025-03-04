
import React from 'react';
import { Fuel, CalendarClock, MapPin, Car } from 'lucide-react';
import { OrderData } from '@/utils/types';

interface OrderDetailsProps {
  orderData: OrderData | null;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ orderData }) => {
  if (!orderData) return null;
  
  return (
    <div className="glass-card p-5 space-y-4 animate-fade-in animation-delay-200 bg-white shadow-lg">
      <h2 className="text-lg font-semibold text-navy-blue">Order Details</h2>
      
      <div className="space-y-3">
        <div className="flex items-start">
          <Fuel className="w-5 h-5 text-ninja-orange mr-3" />
          <div>
            <div className="text-sm text-gray-500">Fuel</div>
            <div className="text-navy-blue">
              {`${orderData.fuelType}, ${orderData.amount} gallons`}
            </div>
          </div>
        </div>
        
        <div className="flex items-start">
          <CalendarClock className="w-5 h-5 text-ninja-orange mr-3" />
          <div>
            <div className="text-sm text-gray-500">Scheduled Time</div>
            <div className="text-navy-blue">
              {orderData.scheduledTime}
            </div>
          </div>
        </div>
        
        <div className="flex items-start">
          <MapPin className="w-5 h-5 text-ninja-orange mr-3" />
          <div>
            <div className="text-sm text-gray-500">Delivery Address</div>
            <div className="text-navy-blue">
              {orderData.deliveryAddress}
            </div>
          </div>
        </div>
        
        {orderData.carInfo && (
          <div className="flex items-start">
            <Car className="w-5 h-5 text-ninja-orange mr-3" />
            <div>
              <div className="text-sm text-gray-500">Vehicle</div>
              <div className="text-navy-blue">
                {`${orderData.carInfo.year} ${orderData.carInfo.make} ${orderData.carInfo.model}, ${orderData.carInfo.color}`}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
