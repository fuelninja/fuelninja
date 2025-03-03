
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import TrackingMap from '@/components/ui/TrackingMap';
import { Fuel, CalendarClock, MapPin, CheckCircle } from 'lucide-react';
import Confetti from '@/components/ui/Confetti';
import ReviewPrompt from '@/components/ui/ReviewPrompt';
import { format } from 'date-fns';

const Track: React.FC = () => {
  const location = useLocation();
  const [orderId, setOrderId] = useState<string>('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState<string>('');
  const [orderExpired, setOrderExpired] = useState(false);
  const [deliveryTimestamp, setDeliveryTimestamp] = useState<number | null>(null);
  
  // Sample order details - in a real app, this would come from an API
  const orderDetails = {
    fuelType: 'Regular Unleaded',
    amount: '10 gallons',
    price: '$39.90',
    scheduledTime: 'Today, 2:00 PM',
    deliveryAddress: '123 Main St, Houston, TX 77001',
  };
  
  useEffect(() => {
    // Extract order ID from URL query params
    const params = new URLSearchParams(location.search);
    const id = params.get('orderId');
    setOrderId(id || ''); // Set to empty string if no orderId is present
    
    // Only check for delivery timestamp if we have an order ID
    if (id) {
      // Check local storage for delivery timestamp
      const storedTimestamp = localStorage.getItem(`delivery-time-${id}`);
      if (storedTimestamp) {
        const timestamp = parseInt(storedTimestamp, 10);
        setDeliveryTimestamp(timestamp);
        
        // Check if more than 30 minutes have passed
        const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;
        if (timestamp < thirtyMinutesAgo) {
          setOrderExpired(true);
        }
      }
    }
  }, [location]);
  
  // Listener for delivery status changes coming from TrackingMap
  const handleStatusChange = (status: string) => {
    setDeliveryStatus(status);
    
    if (status === 'delivered') {
      // Store delivery timestamp in localStorage
      const currentTime = Date.now();
      localStorage.setItem(`delivery-time-${orderId}`, currentTime.toString());
      setDeliveryTimestamp(currentTime);
      
      const confettiShownKey = `confetti-shown-${orderId}`;
      const hasConfettiShown = localStorage.getItem(confettiShownKey);
      
      if (!hasConfettiShown) {
        // Show confetti and store in localStorage that we've shown it
        setShowConfetti(true);
        localStorage.setItem(confettiShownKey, 'true');
        
        // Show review prompt after a short delay
        setTimeout(() => {
          setShowReviewPrompt(true);
        }, 2000);
      }
    }
  };
  
  // Determine if we have an active order to track
  const hasActiveOrder = orderId && !orderExpired;
  const hasNoOrder = !orderId;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      
      {showConfetti && <Confetti isActive={true} />}
      <ReviewPrompt isOpen={showReviewPrompt} onClose={() => setShowReviewPrompt(false)} />
      
      <main className="container max-w-md mx-auto px-4 pb-24">
        <h1 className="text-2xl font-bold my-6 animate-fade-in text-navy-blue">Track Delivery</h1>
        
        <div className="space-y-6">
          {hasActiveOrder ? (
            <>
              <TrackingMap orderId={orderId} onStatusChange={handleStatusChange} />
              
              {/* Order Details - Updated with navy blue */}
              <div className="glass-card p-5 space-y-4 animate-fade-in animation-delay-200 bg-white shadow-lg">
                <h2 className="text-lg font-semibold text-navy-blue">Order Details</h2>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Fuel className="w-5 h-5 text-ninja-orange mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Fuel</div>
                      <div className="text-navy-blue">{orderDetails.fuelType}, {orderDetails.amount}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CalendarClock className="w-5 h-5 text-ninja-orange mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Scheduled Time</div>
                      <div className="text-navy-blue">{orderDetails.scheduledTime}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-ninja-orange mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Delivery Address</div>
                      <div className="text-navy-blue">{orderDetails.deliveryAddress}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Vehicle Location Note */}
              <div className="text-center text-navy-blue animate-fade-in animation-delay-300">
                If we have any trouble finding your vehicle, we will give you a call!
              </div>
            </>
          ) : (
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
          )}
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Track;
