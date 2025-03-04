
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { Button } from '@/components/ui/button';
import { ChevronLeft, CreditCard, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import DataService from '@/utils/DataService';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise, getCardType, processStripePayment } from '@/utils/stripe';

// Stripe Card Input Styling
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

// Payment Form Component that uses Stripe Elements
const PaymentForm = ({ bookingData, priceDetails, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardName: '',
    billingAddress: '',
    billingZip: '',
  });
  
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentData({ ...paymentData, [name]: value });
  };
  
  const validateForm = () => {
    const errors = [];
    
    if (!paymentData.cardName) {
      errors.push('Please enter the name on card');
    }
    
    if (!cardComplete) {
      errors.push('Please complete the credit card information');
    }
    
    if (!paymentData.billingAddress) {
      errors.push('Please enter billing address');
    }
    
    if (!paymentData.billingZip || paymentData.billingZip.length < 5) {
      errors.push('Please enter a valid zip code');
    }
    
    return errors;
  };
  
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
  
  const handleSubmit = async () => {
    const errors = validateForm();
    setValidationErrors(errors);
    
    if (errors.length === 0) {
      setIsProcessing(true);
      
      try {
        // Process payment with Stripe
        const paymentAmount = parseFloat(priceDetails.total) * 100; // Stripe requires amount in cents
        
        const paymentResult = await processStripePayment(
          stripe, 
          elements, 
          paymentAmount, 
          {
            fuelType: bookingData.fuelType,
            gallons: bookingData.fuelAmount,
            delivery: formatDate(bookingData.deliveryTime)
          }
        );
        
        if (paymentResult.success) {
          const orderId = Math.floor(100000 + Math.random() * 900000).toString();
          
          // Create order record with payment ID
          const orderData = {
            orderId,
            fuelType: bookingData.fuelType,
            amount: bookingData.fuelAmount,
            price: priceDetails.total,
            scheduledTime: formatDate(bookingData.deliveryTime),
            deliveryAddress: bookingData.location,
            carInfo: {
              make: bookingData.carMake,
              model: bookingData.carModel,
              color: bookingData.carColor,
              year: bookingData.carYear
            },
            status: 'pending',
            createdAt: Date.now(),
            paymentId: paymentResult.paymentId
          };
          
          DataService.saveOrder(orderData);
          
          // Save billing address to user preferences
          if (paymentData.billingAddress) {
            DataService.addSavedAddress(paymentData.billingAddress);
          }
          
          // Get last 4 digits from card element
          const cardElement = elements?.getElement(CardElement);
          const cardInfo = cardElement?._implementation?._frame?.state?.value || '';
          const last4 = cardInfo.slice(-4) || '****';
          
          // Determine card type
          const cardType = cardInfo.startsWith('4') ? 'Visa' : 
                          cardInfo.startsWith('5') ? 'Mastercard' :
                          cardInfo.startsWith('3') ? 'American Express' : 
                          'Credit Card';
          
          // Save payment method with Stripe card info
          DataService.addPaymentMethod({
            cardName: cardType,
            cardNumberLast4: last4,
            expDate: new Date().getMonth() + 1 + '/' + (new Date().getFullYear() % 100 + 1)
          });
          
          toast({
            title: "Payment Successful!",
            description: "Your fuel delivery has been scheduled.",
            className: "bg-green-50 border-green-200 text-green-800",
          });
          
          // Navigate to tracking page
          navigate(`/track?orderId=${orderId}`);
        } else {
          toast({
            title: "Payment Failed",
            description: paymentResult.error || "There was an issue processing your payment.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Payment error:', error);
        toast({
          title: "Payment Failed",
          description: "There was an issue processing your payment.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };
  
  return (
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
            <label htmlFor="card" className="block text-sm text-gray-600 mb-1">Card Information</label>
            <div className="w-full rounded-md border border-gray-300 p-3 focus-within:ring-2 focus-within:ring-ninja-red focus-within:border-transparent">
              <CardElement 
                options={CARD_ELEMENT_OPTIONS} 
                onChange={(e) => setCardComplete(e.complete)}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Test cards: 4242 4242 4242 4242 (Visa), 5555 5555 5555 4444 (MC), 3782 822463 10005 (Amex)
            </p>
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
        disabled={isProcessing}
        className="button-primary w-full py-4 flex items-center justify-center"
      >
        <CreditCard className="w-5 h-5 mr-2" />
        {isProcessing ? 'Processing...' : `Confirm Payment - $${priceDetails.total}`}
      </button>
    </div>
  );
};

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
        
        <Elements stripe={stripePromise}>
          <PaymentForm 
            bookingData={bookingData} 
            priceDetails={priceDetails}
            onPaymentSuccess={(orderId) => navigate(`/track?orderId=${orderId}`)}
          />
        </Elements>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default PaymentConfirmation;
