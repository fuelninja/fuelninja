
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import TrackingMap from '@/components/ui/TrackingMap';
import { Fuel, CalendarClock, MapPin } from 'lucide-react';
import Confetti from '@/components/ui/Confetti';
import ReviewPrompt from '@/components/ui/ReviewPrompt';

const Track: React.FC = () => {
  const location = useLocation();
  const [orderId, setOrderId] = useState<string>('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState<string>('');
  
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
    if (id) {
      setOrderId(id);
    }
  }, [location]);
  
  // Listener for delivery status changes coming from TrackingMap
  const handleStatusChange = (status: string) => {
    setDeliveryStatus(status);
    
    if (status === 'delivered') {
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
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      
      {showConfetti && <Confetti isActive={true} />}
      <ReviewPrompt isOpen={showReviewPrompt} onClose={() => setShowReviewPrompt(false)} />
      
      <main className="container max-w-md mx-auto px-4 pb-24">
        <h1 className="text-2xl font-bold my-6 animate-fade-in text-navy-blue">Track Delivery</h1>
        
        <div className="space-y-6">
          {orderId ? (
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
            <div className="text-center py-10 text-navy-blue">
              <p>No active orders to track.</p>
            </div>
          )}
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Track;
