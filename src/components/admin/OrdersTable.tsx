
import React from 'react';
import { OrderData } from '@/utils/DataService';
import { Fuel, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import OrderStatusBadge from './OrderStatusBadge';

interface OrdersTableProps {
  orders: OrderData[];
  onViewOrder: (order: OrderData) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onViewOrder }) => {
  const formatTimestamp = (timestamp: number) => {
    return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
  };

  return (
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
            <tr key={order.orderId} className="hover:bg-gray-50 cursor-pointer" onClick={() => onViewOrder(order)}>
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
                <OrderStatusBadge status={order.status} />
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
                    onViewOrder(order);
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
  );
};

export default OrdersTable;
