
import React from 'react';

interface OrderSummaryProps {
  bookingData: {
    fuelType: string;
    fuelAmount: number;
    carYear: string;
    carMake: string;
    carModel: string;
    carColor: string;
    deliveryTime: Date;
    location: string;
  };
  priceDetails: {
    subtotal: string;
    serviceFee: string;
    total: string;
  };
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ bookingData, priceDetails }) => {
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="glass-card p-5 animate-fade-in">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Fuel Type</span>
          <span className="font-medium">{bookingData.fuelType}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Amount</span>
          <span className="font-medium">{bookingData.fuelAmount} gallons</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Vehicle</span>
          <span className="font-medium">
            {bookingData.carYear} {bookingData.carMake} {bookingData.carModel}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Color</span>
          <span className="font-medium">{bookingData.carColor}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Delivery Time</span>
          <span className="font-medium">{formatDate(bookingData.deliveryTime)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Location</span>
          <span className="font-medium">{bookingData.location}</span>
        </div>
      </div>
      
      <div className="border-t border-gray-200 my-4"></div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span>${priceDetails.subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Service Fee</span>
          <span>${priceDetails.serviceFee}</span>
        </div>
        <div className="border-t border-gray-200 my-2"></div>
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>${priceDetails.total}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
