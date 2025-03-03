
import React from 'react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Clock, Calendar, MapPin, Fuel } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrderHistory: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock order history data - would come from user profile in a real app
  const orders = [
    {
      id: 'ORD-001234',
      date: 'May 15, 2023',
      time: '2:30 PM',
      status: 'Completed',
      gallons: 8,
      price: 31.92,
      location: '123 Main St, Houston, TX',
      vehicle: '2020 Toyota Camry (Silver)'
    },
    {
      id: 'ORD-001122',
      date: 'April 28, 2023',
      time: '10:15 AM',
      status: 'Completed',
      gallons: 12,
      price: 47.88,
      location: '456 Corporate Ave, Houston, TX',
      vehicle: '2020 Toyota Camry (Silver)'
    },
    {
      id: 'ORD-000987',
      date: 'April 10, 2023',
      time: '3:45 PM',
      status: 'Completed',
      gallons: 5,
      price: 19.95,
      location: '789 Family Rd, Katy, TX',
      vehicle: '2019 Honda CR-V (Black)'
    }
  ];
  
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
                <div key={order.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <div className="bg-gray-100 p-2 rounded-full mr-3">
                        <Fuel className="h-5 w-5 text-ninja-red" />
                      </div>
                      <div>
                        <h3 className="font-medium">{order.id}</h3>
                        <p className="text-sm text-gray-600">{order.status}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => navigate(`/profile/receipts?order=${order.id}`)}
                    >
                      View Receipt
                    </Button>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3 mt-2 space-y-2">
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Date & Time</p>
                        <p className="text-sm text-gray-600">{order.date} at {order.time}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Fuel className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Fuel</p>
                        <p className="text-sm text-gray-600">{order.gallons} gallons • ${order.price.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Delivery Location</p>
                        <p className="text-sm text-gray-600">{order.location}</p>
                        <p className="text-sm text-gray-600">{order.vehicle}</p>
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
