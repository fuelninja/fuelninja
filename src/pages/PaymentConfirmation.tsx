import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { Button } from '@/components/ui/button';
import { ChevronLeft, CreditCard, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PaymentConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
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
  
  const [paymentData, setPaymentData] = useState({
    cardName: '',
    cardNumber: '',
    expDate: '',
    cvv: '',
    billingAddress: '',
    billingZip: '',
  });
  
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentData({ ...paymentData, [name]: value });
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

  const validateForm = () => {
    const errors = [];
    
    if (!paymentData.cardName) {
      errors.push('Please enter the name on card');
    }
    
    if (!paymentData.cardNumber || paymentData.cardNumber.length < 16) {
      errors.push('Please enter a valid card number');
    }
    
    if (!paymentData.expDate) {
      errors.push('Please enter expiration date');
    }
    
    if (!paymentData.cvv || paymentData.cvv.length < 3) {
      errors.push('Please enter a valid CVV');
    }
    
    if (!paymentData.billingAddress) {
      errors.push('Please enter billing address');
    }
    
    if (!paymentData.billingZip || paymentData.billingZip.length < 5) {
      errors.push('Please enter a valid zip code');
    }
    
    return errors;
  };
  
  const handleSubmit = () => {
    const errors = validateForm();
    setValidationErrors(errors);
    
    if (errors.length === 0) {
      const orderId = Math.floor(100000 + Math.random() * 900000).toString();
      
      toast({
        title: "Payment Successful!",
        description: "Your fuel delivery has been scheduled.",
        className: "bg-green-50 border-green-200 text-green-800",
      });
      
      navigate(`/track?orderId=${orderId}`);
    }
  };
  
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
        
        <div className="space-y-6">
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
          
          <div className="glass-card p-5 animate-fade-in animation-delay-100">
            <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="cardName" className="block text-sm text-gray-600 mb-1">Name on Card</label>
                <input 
                  type="text" 
                  id="cardName" 
                  name="cardName" 
                  value={paymentData.cardName} 
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-ninja-red focus:border-transparent" 
                  placeholder="John Smith"
                />
              </div>
              
              <div>
                <label htmlFor="cardNumber" className="block text-sm text-gray-600 mb-1">Card Number</label>
                <input 
                  type="text" 
                  id="cardNumber" 
                  name="cardNumber" 
                  value={paymentData.cardNumber} 
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-ninja-red focus:border-transparent" 
                  placeholder="4242 4242 4242 4242"
                  maxLength={16}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expDate" className="block text-sm text-gray-600 mb-1">Expiration Date</label>
                  <input 
                    type="text" 
                    id="expDate" 
                    name="expDate" 
                    value={paymentData.expDate} 
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-ninja-red focus:border-transparent" 
                    placeholder="MM/YY"
                  />
                </div>
                
                <div>
                  <label htmlFor="cvv" className="block text-sm text-gray-600 mb-1">CVV</label>
                  <input 
                    type="text" 
                    id="cvv" 
                    name="cvv" 
                    value={paymentData.cvv} 
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-ninja-red focus:border-transparent" 
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-5 animate-fade-in animation-delay-200">
            <h2 className="text-lg font-semibold mb-4">Billing Information</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="billingAddress" className="block text-sm text-gray-600 mb-1">Billing Address</label>
                <input 
                  type="text" 
                  id="billingAddress" 
                  name="billingAddress" 
                  value={paymentData.billingAddress} 
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-ninja-red focus:border-transparent" 
                  placeholder="123 Main St"
                />
              </div>
              
              <div>
                <label htmlFor="billingZip" className="block text-sm text-gray-600 mb-1">City, State, Zip Code</label>
                <input 
                  type="text" 
                  id="billingZip" 
                  name="billingZip" 
                  value={paymentData.billingZip} 
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-ninja-red focus:border-transparent" 
                  placeholder="Houston, TX 77001"
                  maxLength={20}
                />
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
            Confirm Payment - ${priceDetails.total}
          </button>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default PaymentConfirmation;
