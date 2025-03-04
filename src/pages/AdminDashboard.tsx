
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { OrderData, default as DataService } from '@/utils/DataService';
import { format } from 'date-fns';
import { 
  Truck, Fuel, MapPin, Users, 
  BarChart, RefreshCw, LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuth();
  
  const loadData = () => {
    setIsLoading(true);
    
    // Get all orders from DataService
    const allOrders = DataService.getOrders();
    setOrders(allOrders.sort((a, b) => b.createdAt - a.createdAt));
    
    // Calculate unique user count (in a real app, this would be from the backend)
    const uniqueUserIds = new Set(allOrders.map(o => o.userId).filter(Boolean));
    setUserCount(uniqueUserIds.size);
    
    setIsLoading(false);
    toast.success("Data refreshed");
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    DataService.updateOrderStatus(orderId, newStatus);
    loadData();
    toast.success(`Order status updated to ${newStatus}`);
  };

  const formatTimestamp = (timestamp: number) => {
    return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-ninja-blue">FuelNinja Admin Console</h1>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={loadData}
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-ninja-blue bg-opacity-10">
                <Truck className="h-6 w-6 text-ninja-blue" />
              </div>
              <div className="ml-5">
                <p className="text-gray-500 text-sm font-medium">Active Orders</p>
                <h2 className="text-2xl font-bold text-gray-700">
                  {orders.filter(o => o.status !== 'delivered').length}
                </h2>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-ninja-orange bg-opacity-10">
                <Users className="h-6 w-6 text-ninja-orange" />
              </div>
              <div className="ml-5">
                <p className="text-gray-500 text-sm font-medium">Total Users</p>
                <h2 className="text-2xl font-bold text-gray-700">{userCount}</h2>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-500 bg-opacity-10">
                <BarChart className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5">
                <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                <h2 className="text-2xl font-bold text-gray-700">
                  ${orders.reduce((sum, order) => {
                    const price = parseFloat(order.price.replace('$', ''));
                    return sum + price;
                  }, 0).toFixed(2)}
                </h2>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.orderId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.orderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.userId || 'Anonymous'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex flex-col">
                          <span className="flex items-center">
                            <Fuel className="h-4 w-4 mr-1" />
                            {order.fuelType}, {order.amount} gal
                          </span>
                          <span className="flex items-center mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {order.deliveryAddress.substring(0, 30)}...
                          </span>
                        </div>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {order.status !== 'delivered' && (
                          <div className="flex space-x-2">
                            {order.status === 'pending' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(order.orderId, 'in_progress')}
                              >
                                Start Delivery
                              </Button>
                            )}
                            {order.status === 'in_progress' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(order.orderId, 'delivered')}
                              >
                                Mark Delivered
                              </Button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
