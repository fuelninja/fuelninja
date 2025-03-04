
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { OrderData, default as DataService } from '@/utils/DataService';
import { format } from 'date-fns';
import { 
  Truck, Fuel, MapPin, Users, 
  BarChart, RefreshCw, LogOut,
  Phone, Mail, Calendar, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const { logout } = useAuth();
  
  const loadData = () => {
    setIsLoading(true);
    
    // Get all orders from DataService
    const allOrders = DataService.getOrders();
    setOrders(allOrders.sort((a, b) => b.createdAt - a.createdAt));
    
    // Calculate unique user count
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
    setIsOrderDetailOpen(false);
    toast.success(`Order status updated to ${newStatus}`);
  };

  const formatTimestamp = (timestamp: number) => {
    return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
  };

  const handleLogout = () => {
    logout();
  };

  const handleViewOrder = (order: OrderData) => {
    setSelectedOrder(order);
    setIsOrderDetailOpen(true);
  };

  const filteredOrders = filterStatus === "all" 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const getPendingCount = () => orders.filter(o => o.status === "pending").length;
  const getInProgressCount = () => orders.filter(o => o.status === "in_progress").length;
  const getDeliveredCount = () => orders.filter(o => o.status === "delivered").length;

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Delivered</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-ninja-blue bg-opacity-10">
                <Truck className="h-6 w-6 text-ninja-blue" />
              </div>
              <div className="ml-5">
                <p className="text-gray-500 text-sm font-medium">All Orders</p>
                <h2 className="text-2xl font-bold text-gray-700">
                  {orders.length}
                </h2>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-500 bg-opacity-10">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="ml-5">
                <p className="text-gray-500 text-sm font-medium">Pending</p>
                <h2 className="text-2xl font-bold text-gray-700">{getPendingCount()}</h2>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-500 bg-opacity-10">
                <Truck className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-5">
                <p className="text-gray-500 text-sm font-medium">In Progress</p>
                <h2 className="text-2xl font-bold text-gray-700">{getInProgressCount()}</h2>
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
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Manage Orders</h3>
            
            <div>
              <Tabs defaultValue="all" onValueChange={(value) => setFilterStatus(value)}>
                <TabsList>
                  <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
                  <TabsTrigger value="pending">Pending ({getPendingCount()})</TabsTrigger>
                  <TabsTrigger value="in_progress">In Progress ({getInProgressCount()})</TabsTrigger>
                  <TabsTrigger value="delivered">Delivered ({getDeliveredCount()})</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
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
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.orderId} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleViewOrder(order)}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.orderId.substring(0, 8)}
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
                          <span className="flex items-center mt-1 truncate max-w-xs">
                            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{order.deliveryAddress}</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatTimestamp(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewOrder(order);
                          }}
                        >
                          Manage
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Order Detail Dialog */}
      <Dialog open={isOrderDetailOpen} onOpenChange={setIsOrderDetailOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.orderId.substring(0, 8)}</DialogTitle>
            <DialogDescription>
              Created on {selectedOrder ? formatTimestamp(selectedOrder.createdAt) : ''}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Order Status</h3>
                {getStatusBadge(selectedOrder.status)}
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-2">Fuel Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-600">Fuel Type:</p>
                  <p>{selectedOrder.fuelType}</p>
                  <p className="text-gray-600">Amount:</p>
                  <p>{selectedOrder.amount} gallons</p>
                  <p className="text-gray-600">Price:</p>
                  <p className="font-semibold">{selectedOrder.price}</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-2">Delivery Information</h3>
                <div className="text-sm space-y-2">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-1 text-gray-500" />
                    <p>{selectedOrder.deliveryAddress}</p>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <p>{selectedOrder.scheduledTime}</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-2">Vehicle Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-600">Make:</p>
                  <p>{selectedOrder.carInfo.make}</p>
                  <p className="text-gray-600">Model:</p>
                  <p>{selectedOrder.carInfo.model}</p>
                  <p className="text-gray-600">Color:</p>
                  <p>{selectedOrder.carInfo.color}</p>
                  <p className="text-gray-600">Year:</p>
                  <p>{selectedOrder.carInfo.year}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            {selectedOrder && selectedOrder.status === 'pending' && (
              <Button 
                onClick={() => handleStatusChange(selectedOrder.orderId, 'in_progress')}
                className="w-full sm:w-auto"
              >
                Start Delivery
              </Button>
            )}
            
            {selectedOrder && selectedOrder.status === 'in_progress' && (
              <Button 
                onClick={() => handleStatusChange(selectedOrder.orderId, 'delivered')}
                className="w-full sm:w-auto"
              >
                Mark as Delivered
              </Button>
            )}
            
            {selectedOrder && selectedOrder.status === 'delivered' && (
              <Button 
                variant="outline" 
                disabled
                className="w-full sm:w-auto"
              >
                Order Completed
              </Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={() => setIsOrderDetailOpen(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
