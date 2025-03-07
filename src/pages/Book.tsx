
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import FuelAmountSelector from '@/components/ui/FuelAmountSelector';
import LocationInput from '@/components/ui/LocationInput';
import DeliveryScheduler from '@/components/ui/DeliveryScheduler';
import CarInfoInput from '@/components/ui/CarInfoInput';
import { CreditCard, AlertCircle } from 'lucide-react';

const Book: React.FC = () => {
  const navigate = useNavigate();
  
  const [bookingData, setBookingData] = useState({
    fuelAmount: 2,
    fuelType: 'Regular Unleaded',
    location: '',
    isCurrentLocation: false,
    deliveryTime: new Date(),
    carMake: '',
    carModel: '',
    carColor: '',
    carYear: '',
  });
  
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  const handleFuelAmountChange = (amount: number, isFull: boolean, fuelType: string) => {
    setBookingData({
      ...bookingData,
      fuelAmount: amount,
      fuelType,
    });
  };
  
  const handleLocationChange = (location: string, isCurrentLocation: boolean) => {
    setBookingData({
      ...bookingData,
      location,
      isCurrentLocation,
    });
  };
  
  const handleDeliveryTimeChange = (date: Date) => {
    setBookingData({
      ...bookingData,
      deliveryTime: date,
    });
  };
  
  const handleCarInfoChange = (make: string, model: string, color: string, year: string) => {
    setBookingData({
      ...bookingData,
      carMake: make,
      carModel: model,
      carColor: color,
      carYear: year,
    });
  };
  
  const handleSubmit = () => {
    const errors = [];
    
    if (bookingData.location === '') {
      errors.push('Please enter a delivery location');
    }
    
    if (bookingData.fuelAmount < 2 || bookingData.fuelAmount > 20) {
      errors.push('Please select a valid fuel amount');
    }
    
    if (bookingData.carMake === '' || bookingData.carModel === '') {
      errors.push('Please enter your vehicle information');
    }
    
    if (bookingData.carColor === '') {
      errors.push('Please select your vehicle color');
    }
    
    if (bookingData.carYear === '') {
      errors.push('Please select your vehicle year');
    }
    
    setValidationErrors(errors);
    
    if (errors.length === 0) {
      console.log('Booking submitted:', bookingData);
      
      // Create query params for payment confirmation page
      const params = new URLSearchParams();
      params.set('amount', bookingData.fuelAmount.toString());
      params.set('type', bookingData.fuelType);
      params.set('location', bookingData.location);
      params.set('time', bookingData.deliveryTime.toISOString());
      params.set('make', bookingData.carMake);
      params.set('model', bookingData.carModel);
      params.set('color', bookingData.carColor);
      params.set('year', bookingData.carYear);
      
      // Navigate to payment confirmation page
      navigate(`/payment-confirmation?${params.toString()}`);
    }
  };
  
  const calculatePrice = () => {
    const pricePerGallon = {
      'Regular Unleaded': 3.49,
      'Supreme': 3.99,
      'Diesel': 3.79
    }[bookingData.fuelType] || 3.49;
    
    const serviceFee = 6.99;
    const gallons = bookingData.fuelAmount;
    
    const subtotal = gallons * pricePerGallon;
    const total = subtotal + serviceFee;
    
    return {
      subtotal: subtotal.toFixed(2),
      serviceFee: serviceFee.toFixed(2),
      total: total.toFixed(2),
    };
  };
  
  const priceDetails = calculatePrice();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      
      <main className="container max-w-md mx-auto px-4 pb-24">
        <h1 className="text-2xl font-bold my-6 animate-fade-in">Book Fuel Delivery</h1>
        
        <div className="space-y-6">
          <FuelAmountSelector onChange={handleFuelAmountChange} />
          
          <LocationInput onChange={handleLocationChange} />
          
          <CarInfoInput onChange={handleCarInfoChange} />
          
          <DeliveryScheduler onChange={handleDeliveryTimeChange} />
          
          <div className="glass-card p-5 space-y-4 animate-fade-in animation-delay-300">
            <h2 className="text-lg font-semibold">Price Summary</h2>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {bookingData.fuelType} ({bookingData.fuelAmount} gal)
                </span>
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
          
          {validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Please fix the following errors:</p>
                  <ul className="list-disc list-inside text-sm">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          <button 
            onClick={handleSubmit}
            className="button-primary w-full py-4 flex items-center justify-center"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Proceed to Payment
          </button>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Book;
