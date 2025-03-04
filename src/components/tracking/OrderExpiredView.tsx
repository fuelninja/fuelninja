
import React from 'react';
import { CheckCircle, CalendarClock } from 'lucide-react';
import { format } from 'date-fns';

interface OrderExpiredViewProps {
  orderExpired: boolean;
  deliveryTimestamp: number | null;
}

const OrderExpiredView: React.FC<OrderExpiredViewProps> = ({ orderExpired, deliveryTimestamp }) => {
  return (
    <div className="text-center py-10 glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-center mb-4">
        {orderExpired ? (
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
        ) : (
          <CalendarClock className="w-16 h-16 text-navy-blue/30 mx-auto" />
        )}
      </div>
      <h3 className="text-xl font-semibold text-navy-blue mb-2">
        {orderExpired ? 'Order Completed' : 'No Active Orders'}
      </h3>
      <p className="text-gray-600 mb-6">
        {orderExpired 
          ? 'This order has been completed and is no longer available for tracking.' 
          : 'Current fuel orders will display here.'}
      </p>
      {orderExpired && deliveryTimestamp && (
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 text-green-600 font-medium mb-2">
            <CheckCircle className="w-5 h-5" />
            <span>Delivery Successful</span>
          </div>
          <p className="text-sm text-gray-500">
            Delivered on {format(new Date(deliveryTimestamp), 'MMM d, yyyy')} at {format(new Date(deliveryTimestamp), 'h:mm a')}
          </p>
        </div>
      )}
      <a 
        href="/book" 
        className="inline-block px-4 py-2 bg-ninja-orange text-white rounded-lg hover:bg-ninja-orange/90 transition-colors"
      >
        Book A New Delivery
      </a>
    </div>
  );
};

export default OrderExpiredView;
