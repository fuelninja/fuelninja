
import React, { useState, useEffect } from 'react';
import { OrderData, default as DataService } from '@/utils/DataService';
import { toast } from "sonner";
import OrdersTable from '@/components/admin/OrdersTable';
import OrderDetailDialog from '@/components/admin/OrderDetailDialog';
import StatusFilterTabs from '@/components/admin/StatusFilterTabs';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  const loadData = () => {
    setIsLoading(true);
    
    // Get all orders from DataService
    const allOrders = DataService.getOrders();
    setOrders(allOrders.sort((a, b) => b.createdAt - a.createdAt));
    
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
  const getInProgressCount = () => orders.filter(o => o.status === "in_progress" || 
                                                    o.status === "confirmed" || 
                                                    o.status === "en-route" || 
                                                    o.status === "arriving").length;
  const getDeliveredCount = () => orders.filter(o => o.status === "delivered").length;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadData} 
            disabled={isLoading}
            className="mr-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <h3 className="text-lg font-medium text-gray-900">Manage Orders</h3>
        </div>
        
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

      <OrderDetailDialog 
        open={isOrderDetailOpen}
        onOpenChange={setIsOrderDetailOpen}
        order={selectedOrder}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default AdminOrdersPage;
