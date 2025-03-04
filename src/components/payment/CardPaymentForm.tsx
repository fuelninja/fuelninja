
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { AlertCircle, CreditCard } from 'lucide-react';
import { StripeCardElement } from '@/utils/stripe';

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

export interface PaymentFormData {
  cardName: string;
  billingAddress: string;
  billingZip: string;
}

interface PaymentFormProps {
  bookingData: {
    fuelType: string;
    fuelAmount: number;
    deliveryTime: Date;
    location: string;
    carMake: string;
    carModel: string;
    carColor: string;
    carYear: string;
  };
  priceDetails: {
    total: string;
  };
  onPaymentSuccess: (orderId: string) => void;
}

const CardPaymentForm: React.FC<PaymentFormProps> = ({ 
  bookingData, 
  priceDetails, 
  onPaymentSuccess 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentFormData>({
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
    
    if (errors.length === 0 && stripe && elements) {
      setIsProcessing(true);
      
      try {
        // Process payment with Stripe
        const paymentAmount = parseFloat(priceDetails.total) * 100; // Stripe requires amount in cents
        
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          throw new Error('Card element not found');
        }
        
        // For demo purposes, we'll simulate success for test cards
        // Get card details - note: this is a safe way to check card info without accessing sensitive data
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });
        
        if (error) {
          throw new Error(error.message);
        }
        
        // Simulate successful payment with a fake payment intent ID
        const paymentResult = {
          success: true,
          paymentId: `pi_${Math.random().toString(36).substring(2, 15)}`
        };
        
        if (paymentResult.success) {
          const orderId = Math.floor(100000 + Math.random() * 900000).toString();
          
          // Import here to avoid circular dependency
          const DataService = (await import('@/utils/DataService')).default;
          
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
          
          // Get last 4 digits from payment method
          const last4 = paymentMethod.card?.last4 || '****';
          const cardType = paymentMethod.card?.brand || 'Credit Card';
          
          // Save payment method
          DataService.addPaymentMethod({
            cardName: cardType,
            cardNumberLast4: last4,
            expDate: `${paymentMethod.card?.exp_month || '12'}/${paymentMethod.card?.exp_year?.toString().slice(-2) || '25'}`
          });
          
          // Show success toast
          const { toast } = (await import('@/components/ui/use-toast'));
          toast({
            title: "Payment Successful!",
            description: "Your fuel delivery has been scheduled.",
            className: "bg-green-50 border-green-200 text-green-800",
          });
          
          // Navigate to tracking page
          onPaymentSuccess(orderId);
        }
      } catch (error) {
        console.error('Payment error:', error);
        const { toast } = (await import('@/components/ui/use-toast'));
        toast({
          title: "Payment Failed",
          description: error instanceof Error ? error.message : "There was an issue processing your payment.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };
  
  return (
    <>
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
    </>
  );
};

export default CardPaymentForm;
