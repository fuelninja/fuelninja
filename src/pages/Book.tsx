
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
    isFullTank: false,
    fuelType: 'Regular Unleaded',
    location: '',
    isCurrentLocation: false,
    deliveryTime: new Date(),
    carMake: '',
    carModel: '',
  });
  
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  const handleFuelAmountChange = (amount: number, isFull: boolean, fuelType: string) => {
    setBookingData({
      ...bookingData,
      fuelAmount: amount,
      isFullTank: isFull,
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
  
  const handleCarInfoChange = (make: string, model: string) => {
    setBookingData({
      ...bookingData,
      carMake: make,
      carModel: model,
    });
  };
  
  const handleSubmit = () => {
    const errors = [];
    
    if (bookingData.location === '') {
      errors.push('Please enter a delivery location');
    }
    
    if (!bookingData.isFullTank && (bookingData.fuelAmount < 2 || bookingData.fuelAmount > 20)) {
      errors.push('Please select a valid fuel amount');
    }
    
    if (bookingData.carMake === '' || bookingData.carModel === '') {
      errors.push('Please enter your vehicle information');
    }
    
    setValidationErrors(errors);
    
    if (errors.length === 0) {
      // In a real app, this would send the booking to an API
      console.log('Booking submitted:', bookingData);
      // Generate a fake order ID
      const orderId = Math.floor(100000 + Math.random() * 900000).toString();
      // Navigate to tracking page
      navigate(`/track?orderId=${orderId}`);
    }
  };
  
  // Calculate price - this is a simplified example
  const calculatePrice = () => {
    // Different prices based on fuel type
    const pricePerGallon = {
      'Regular Unleaded': 3.49,
      'Supreme': 3.99,
      'Diesel': 3.79
    }[bookingData.fuelType] || 3.49;
    
    const serviceFee = 5.99;
    const gallons = bookingData.isFullTank ? 12 : bookingData.fuelAmount;
    
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
          
          {/* Price Summary */}
          <div className="glass-card p-5 space-y-4 animate-fade-in animation-delay-300">
            <h2 className="text-lg font-semibold">Price Summary</h2>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {bookingData.fuelType} ({bookingData.isFullTank ? 'Full Tank' : `${bookingData.fuelAmount} gal`})
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
          
          {/* Validation Errors */}
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
          
          {/* Submit Button */}
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
