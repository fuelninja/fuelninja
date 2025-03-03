
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { OrderData, default as DataService } from '@/utils/DataService';
import { format } from 'date-fns';
import { 
  Truck, Fuel, MapPin, Calendar, User,
  Download, Trash2, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Admin: React.FC = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = () => {
    setIsLoading(true);
    
    // Get all orders from DataService
    const allOrders = DataService.getOrders();
    setOrders(allOrders.sort((a, b) => b.createdAt - a.createdAt));
    
    // Get user data
    const user = DataService.getUserData();
    setUserData(user);
    
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      DataService.clearAllData();
      loadData();
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 pb-24 pt-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-navy-blue">Admin Dashboard</h1>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={loadData}
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleClearData}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Data
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Truck className="w-5 h-5 mr-2 text-ninja-orange" />
                Order Records
              </h2>
              
              {orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No orders have been placed yet
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fuel
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vehicle
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created At
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.orderId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order.orderId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.fuelType}, {order.amount} gal
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.carInfo ? 
                              `${order.carInfo.year} ${order.carInfo.make} ${order.carInfo.model}` : 
                              'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                                order.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                                'bg-yellow-100 text-yellow-800'}`}>
                              {order.status === 'in_progress' ? 'In Progress' :
                               order.status === 'delivered' ? 'Delivered' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatTimestamp(order.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-ninja-orange" />
                User Information
              </h2>
              
              {!userData ? (
                <div className="text-center py-8 text-gray-500">
                  No user data available
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Name</h3>
                    <p>{userData.name || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p>{userData.email || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Saved Addresses</h3>
                    {userData.savedAddresses && userData.savedAddresses.length > 0 ? (
                      <ul className="space-y-2">
                        {userData.savedAddresses.map((address: string, index: number) => (
                          <li key={index} className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                            {address}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No saved addresses</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Methods</h3>
                    {userData.paymentMethods && userData.paymentMethods.length > 0 ? (
                      <ul className="space-y-2">
                        {userData.paymentMethods.map((payment: any, index: number) => (
                          <li key={index} className="flex items-start">
                            <div className="bg-gray-100 p-3 rounded-lg w-full">
                              <p className="font-medium">{payment.cardName}</p>
                              <p className="text-sm text-gray-500">
                                **** **** **** {payment.cardNumberLast4}
                              </p>
                              <p className="text-sm text-gray-500">
                                Expires: {payment.expDate}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No payment methods</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-ninja-orange" />
                Summary
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Completed</h3>
                  <p className="text-2xl font-bold">
                    {orders.filter(order => order.status === 'delivered').length}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
                  <p className="text-2xl font-bold">
                    {orders.filter(order => order.status === 'in_progress').length}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Pending</h3>
                  <p className="text-2xl font-bold">
                    {orders.filter(order => order.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
