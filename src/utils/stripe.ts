
import { loadStripe } from '@stripe/stripe-js';

// Replace with your Stripe publishable key 
// Note: This is a publishable key, so it's safe to include in client-side code
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51O5QvJApBtQtQBKRKxK1QAGiM0pKIHKnh0eRbGlS28KO9VBBXBCtcgPwOLgH97W2ayG49oUYfHbVAYXBrhlmXJ6X00UXi5yDw3';

export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export interface StripeCardElement {
  complete: boolean;
  empty: boolean;
  error?: { 
    type: string;
    code: string;
    message: string;
  };
}

// Determine card type from card number
export const getCardType = (cardNumber: string): 'Visa' | 'Mastercard' | 'American Express' | 'Discover' | 'Credit Card' => {
  if (!cardNumber) return 'Credit Card';
  
  const firstDigit = cardNumber.charAt(0);
  const firstTwoDigits = parseInt(cardNumber.substring(0, 2));
  const firstFourDigits = parseInt(cardNumber.substring(0, 4));
  
  if (cardNumber.startsWith('4')) {
    return 'Visa';
  } else if (
    firstTwoDigits >= 51 && 
    firstTwoDigits <= 55
  ) {
    return 'Mastercard';
  } else if (
    firstTwoDigits === 34 || 
    firstTwoDigits === 37
  ) {
    return 'American Express';
  } else if (
    firstTwoDigits === 65 || 
    firstFourDigits === 6011
  ) {
    return 'Discover';
  }
  
  return 'Credit Card';
};

// This function would be used in a real integration to process payment with Stripe
export const processStripePayment = async (
  stripe: any, 
  elements: any, 
  paymentAmount: number, 
  orderDetails: any
): Promise<{success: boolean, error?: string, paymentId?: string}> => {
  try {
    if (!stripe || !elements) {
      throw new Error('Stripe has not been properly initialized');
    }
    
    const cardElement = elements.getElement('card');
    
    if (!cardElement) {
      throw new Error('Card element not found');
    }
    
    // For demo purposes, we'll simulate success for test cards
    // In a real application, you would make a call to your server which would create a payment intent
    
    // Check if it's a test card number
    const testCards = ['4242424242424242', '5555555555554444', '378282246310005'];
    const isTestCard = cardElement?._implementation?._frame?.state?.value;
    
    if (isTestCard && isTestCard.includes('success')) {
      // Simulate successful payment
      return {
        success: true,
        paymentId: `pi_${Math.random().toString(36).substring(2, 15)}`
      };
    }
    
    // Simulate API call to create payment intent
    // In a real app, this would be a server call that returns clientSecret
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });
    
    if (error) {
      return {
        success: false,
        error: error.message
      };
    }
    
    // Simulate successful payment with a fake payment intent ID
    return {
      success: true,
      paymentId: `pi_${Math.random().toString(36).substring(2, 15)}`
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};
