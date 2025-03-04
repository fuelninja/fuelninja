
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { OrderData, default as DataService } from '@/utils/DataService';
import { Truck, Fuel, Clock, BarChart, Map } from 'lucide-react';
import { toast } from "sonner";

// Admin components
import AdminHeader from '@/components/admin/AdminHeader';
import StatisticCard from '@/components/admin/StatisticCard';
import OrdersTable from '@/components/admin/OrdersTable';
import OrderDetailDialog from '@/components/admin/OrderDetailDialog';
import StatusFilterTabs from '@/components/admin/StatusFilterTabs';
import EarningsPanel from '@/components/admin/EarningsPanel';
import DeliveryManagement from '@/components/admin/DeliveryManagement';
import { DeliveryDriverInfo } from '@/utils/types';

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("orders");
  const { logout } = useAuth();
  
  // For delivery management tab
  const [showDeliveryManager, setShowDeliveryManager] = useState(false);
  const [availableDrivers, setAvailableDrivers] = useState<DeliveryDriverInfo[]>([]);
  
  const loadData = () => {
    setIsLoading(true);
    
    // Get all orders from DataService
    const allOrders = DataService.getOrders();
    setOrders(allOrders.sort((a, b) => b.createdAt - a.createdAt));
    
    // Calculate unique user count
    const uniqueUserIds = new Set(allOrders.map(o => o.userId).filter(Boolean));
    setUserCount(uniqueUserIds.size);
    
    // Load delivery system configuration
    try {
      const configData = localStorage.getItem('fuelninja-tracking-config');
      if (configData) {
        const config = JSON.parse(configData);
        if (config.activeDrivers && Array.isArray(config.activeDrivers)) {
          setAvailableDrivers(config.activeDrivers);
        }
      }
    } catch (error) {
      console.error('Error loading delivery configuration:', error);
    }
    
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

  const handleViewOrder = (order: OrderData) => {
    setSelectedOrder(order);
    setIsOrderDetailOpen(true);
  };
  
  const handleAssignDriver = (orderId: string, driverId: number) => {
    if (driverId < 0 || driverId >= availableDrivers.length) {
      toast.error("Invalid driver selection");
      return;
    }
    
    const order = DataService.getOrderById(orderId);
    if (!order) {
      toast.error("Order not found");
      return;
    }
    
    // Assign driver to order
    const updatedOrder = {
      ...order,
      driverInfo: availableDrivers[driverId]
    };
    
    const success = DataService.saveOrder(updatedOrder);
    if (success) {
      toast.success(`Driver ${availableDrivers[driverId].name} assigned to order #${orderId}`);
      loadData();
    } else {
      toast.error("Failed to assign driver");
    }
  };

  const filteredOrders = filterStatus === "all" 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const getPendingCount = () => orders.filter(o => o.status === "pending").length;
  const getInProgressCount = () => orders.filter(o => o.status === "in_progress").length;
  const getDeliveredCount = () => orders.filter(o => o.status === "delivered").length;
  
  const calculateTotalRevenue = () => {
    return orders.reduce((sum, order) => {
      const price = parseFloat(order.price.replace('$', ''));
      return sum + price;
    }, 0).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        onRefresh={loadData}
        onLogout={logout}
        isLoading={isLoading}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          // Reset delivery manager view when switching tabs
          setShowDeliveryManager(false);
        }}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "orders" ? (
          // Orders Management Tab
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatisticCard 
                icon={Truck}
                iconColor="ninja-blue"
                label="All Orders"
                value={orders.length}
              />
              
              <StatisticCard 
                icon={Clock}
                iconColor="yellow"
                label="Pending"
                value={getPendingCount()}
              />
              
              <StatisticCard 
                icon={Truck}
                iconColor="blue"
                label="In Progress"
                value={getInProgressCount()}
              />
              
              <StatisticCard 
                icon={BarChart}
                iconColor="green"
                label="Total Revenue"
                value={`$${calculateTotalRevenue()}`}
              />
            </div>
            
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Manage Orders</h3>
                
                <StatusFilterTabs 
                  totalCount={orders.length}
                  pendingCount={getPendingCount()}
                  inProgressCount={getInProgressCount()}
                  deliveredCount={getDeliveredCount()}
                  onFilterChange={setFilterStatus}
                />
              </div>
              
              <div className="overflow-x-auto">
                <OrdersTable 
                  orders={filteredOrders}
                  onViewOrder={handleViewOrder}
                />
              </div>
            </div>
          </>
        ) : activeTab === "earnings" ? (
          // Earnings & Payouts Tab
          <EarningsPanel orders={orders} />
        ) : (
          // Delivery Management Tab - New tab for delivery tracking configuration
          <>
            {showDeliveryManager ? (
              <DeliveryManagement />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center text-center"
                  onClick={() => setShowDeliveryManager(true)}
                >
                  <Map className="h-16 w-16 text-navy-blue mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Tracking System Configuration</h3>
                  <p className="text-gray-600">
                    Manage delivery tracking steps and customize the information that customers see during delivery.
                  </p>
                  <button className="mt-4 bg-navy-blue text-white px-4 py-2 rounded-md hover:bg-navy-blue/90 transition-colors">
                    Configure Tracking Steps
                  </button>
                </div>
                
                <div 
                  className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center text-center"
                  onClick={() => setShowDeliveryManager(true)}
                >
                  <Truck className="h-16 w-16 text-ninja-orange mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Manage Delivery Drivers</h3>
                  <p className="text-gray-600">
                    Add, edit, and remove delivery drivers, and assign them to active orders.
                  </p>
                  <button className="mt-4 bg-ninja-orange text-white px-4 py-2 rounded-md hover:bg-ninja-orange/90 transition-colors">
                    Manage Drivers
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <OrderDetailDialog 
        open={isOrderDetailOpen}
        onOpenChange={setIsOrderDetailOpen}
        order={selectedOrder}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default AdminDashboard;
