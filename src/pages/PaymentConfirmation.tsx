
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import PaymentConfirmationForm from '@/components/payment/PaymentConfirmationForm';
import { calculatePrice } from '@/utils/priceCalculator';

// Main component
const PaymentConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const bookingData = {
    fuelAmount: Number(queryParams.get('amount') || 2),
    fuelType: queryParams.get('type') || 'Regular Unleaded',
    location: queryParams.get('location') || '',
    deliveryTime: new Date(queryParams.get('time') || new Date()),
    carMake: queryParams.get('make') || '',
    carModel: queryParams.get('model') || '',
    carColor: queryParams.get('color') || '',
    carYear: queryParams.get('year') || '',
  };
  
  const priceDetails = calculatePrice(bookingData.fuelType, bookingData.fuelAmount);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      
      <main className="container max-w-md mx-auto px-4 pb-24">
        <div className="flex items-center mb-6 pt-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/book')}
            className="mr-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Confirm & Pay</h1>
        </div>
        
        <PaymentConfirmationForm 
          bookingData={bookingData} 
          priceDetails={priceDetails}
          onPaymentSuccess={(orderId) => navigate(`/track?orderId=${orderId}`)}
        />
      </main>
      
      <BottomNav />
    </div>
  );
};

export default PaymentConfirmation;
