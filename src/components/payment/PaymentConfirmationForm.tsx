
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/utils/stripe';
import OrderSummary from './OrderSummary';
import CardPaymentForm from './CardPaymentForm';

export interface BookingData {
  fuelAmount: number;
  fuelType: string;
  location: string;
  deliveryTime: Date;
  carMake: string;
  carModel: string;
  carColor: string;
  carYear: string;
}

export interface PriceDetails {
  subtotal: string;
  serviceFee: string;
  total: string;
}

interface PaymentConfirmationFormProps {
  bookingData: BookingData;
  priceDetails: PriceDetails;
  onPaymentSuccess: (orderId: string) => void;
}

const PaymentConfirmationForm: React.FC<PaymentConfirmationFormProps> = ({
  bookingData,
  priceDetails,
  onPaymentSuccess
}) => {
  return (
    <div className="space-y-6">
      <OrderSummary 
        bookingData={bookingData} 
        priceDetails={priceDetails} 
      />
      
      <Elements stripe={stripePromise}>
        <CardPaymentForm
          bookingData={bookingData}
          priceDetails={priceDetails}
          onPaymentSuccess={onPaymentSuccess}
        />
      </Elements>
    </div>
  );
};

export default PaymentConfirmationForm;
