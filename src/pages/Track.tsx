import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import TrackingMap from '@/components/ui/TrackingMap';
import { Fuel, CalendarClock, MapPin } from 'lucide-react';

const Track: React.FC = () => {
  const location = useLocation();
  const [orderId, setOrderId] = useState<string>('');
  
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
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      
      <main className="container max-w-md mx-auto px-4 pb-24">
        <h1 className="text-2xl font-bold my-6 animate-fade-in">Track Delivery</h1>
        
        <div className="space-y-6">
          {orderId ? (
            <>
              <TrackingMap orderId={orderId} />
              
              {/* Order Details */}
              <div className="glass-card p-5 space-y-4 animate-fade-in animation-delay-200">
                <h2 className="text-lg font-semibold">Order Details</h2>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Fuel className="w-5 h-5 text-ninja-orange mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Fuel</div>
                      <div>{orderDetails.fuelType}, {orderDetails.amount}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CalendarClock className="w-5 h-5 text-ninja-orange mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Scheduled Time</div>
                      <div>{orderDetails.scheduledTime}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-ninja-orange mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Delivery Address</div>
                      <div>{orderDetails.deliveryAddress}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Vehicle Location Note */}
              <div className="text-center text-gray-600 animate-fade-in animation-delay-300">
                If we have any trouble finding your vehicle, we will give you a call!
              </div>
            </>
          ) : (
            <div className="text-center py-10">
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
