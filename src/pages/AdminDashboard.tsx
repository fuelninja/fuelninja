
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { OrderData, default as DataService } from '@/utils/DataService';
import { Truck, Fuel, Clock, BarChart } from 'lucide-react';
import { toast } from "sonner";

// Admin components
import AdminHeader from '@/components/admin/AdminHeader';
import StatisticCard from '@/components/admin/StatisticCard';
import OrdersTable from '@/components/admin/OrdersTable';
import OrderDetailDialog from '@/components/admin/OrderDetailDialog';
import StatusFilterTabs from '@/components/admin/StatusFilterTabs';

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
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
