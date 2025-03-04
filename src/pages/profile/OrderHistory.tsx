
import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Clock, Calendar, MapPin, Fuel } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DataService, { OrderData } from '@/utils/DataService';
import { format } from 'date-fns';

const OrderHistory: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderData[]>([]);
  
  useEffect(() => {
    // Fetch user's orders
    const userOrders = DataService.getUserOrders();
    setOrders(userOrders);
  }, []);
  
  const formatTimestamp = (timestamp: number) => {
    return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
  };
  
  const getOrderTotal = (order: OrderData) => {
    // Calculate based on a sample price of $3.99 per gallon plus service fee
    const fuelCost = order.amount * 3.99;
    const serviceFee = 6.99;
    return (fuelCost + serviceFee).toFixed(2);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      
      <main className="container max-w-md mx-auto px-4 pb-24">
        <div className="flex items-center mb-6 pt-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/profile')}
            className="mr-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Order History</h1>
        </div>
        
        <div className="space-y-4">
          {orders.length > 0 ? (
            <div className="glass-card divide-y divide-gray-100 animate-fade-in">
              {orders.map((order) => (
                <div key={order.orderId} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <div className="bg-gray-100 p-2 rounded-full mr-3">
                        <Fuel className="h-5 w-5 text-ninja-red" />
                      </div>
                      <div>
                        <h3 className="font-medium">#{order.orderId.substring(0, 8)}</h3>
                        <p className="text-sm text-gray-600">{order.status}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => navigate(`/profile/receipts?order=${order.orderId}`)}
                    >
                      View Receipt
                    </Button>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3 mt-2 space-y-2">
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Date & Time</p>
                        <p className="text-sm text-gray-600">{formatTimestamp(order.createdAt)} ({order.scheduledTime})</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Fuel className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Fuel</p>
                        <p className="text-sm text-gray-600">{order.amount} gallons • ${getOrderTotal(order)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Delivery Location</p>
                        <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                        <p className="text-sm text-gray-600">
                          {order.carInfo.year} {order.carInfo.make} {order.carInfo.model} ({order.carInfo.color})
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700">No orders yet</h3>
              <p className="text-gray-500 mt-1">Your order history will appear here</p>
              <Button 
                className="mt-4" 
                onClick={() => navigate('/book')}
              >
                Book Your First Delivery
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default OrderHistory;
