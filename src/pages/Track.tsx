
import React from 'react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import TrackingMap from '@/components/ui/TrackingMap';
import Confetti from '@/components/ui/Confetti';
import ReviewPrompt from '@/components/ui/ReviewPrompt';
import OrderDetails from '@/components/tracking/OrderDetails';
import OrderExpiredView from '@/components/tracking/OrderExpiredView';
import { useOrderTracking } from '@/hooks/useOrderTracking';

const Track: React.FC = () => {
  const {
    orderId,
    orderData,
    showConfetti,
    setShowConfetti,
    showReviewPrompt,
    setShowReviewPrompt,
    orderExpired,
    deliveryTimestamp,
    assignedDriver,
    hasActiveOrder,
    hasNoOrder,
    handleStatusChange
  } = useOrderTracking();

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
              <TrackingMap 
                orderId={orderId} 
                onStatusChange={handleStatusChange} 
                driverInfo={assignedDriver}
              />
              
              <OrderDetails orderData={orderData} />
              
              {/* Vehicle Location Note */}
              <div className="text-center text-navy-blue animate-fade-in animation-delay-300">
                If we have any trouble finding your vehicle, we will give you a call!
              </div>
            </>
          ) : (
            <OrderExpiredView 
              orderExpired={orderExpired} 
              deliveryTimestamp={deliveryTimestamp} 
            />
          )}
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Track;
