
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface OrderStatusBadgeProps {
  status: string;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  switch(status) {
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    case 'confirmed':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800">Confirmed</Badge>;
    case 'en-route':
      return <Badge variant="outline" className="bg-indigo-100 text-indigo-800">En Route</Badge>;
    case 'arriving':
      return <Badge variant="outline" className="bg-purple-100 text-purple-800">Arriving</Badge>;
    case 'delivered':
      return <Badge variant="outline" className="bg-green-100 text-green-800">Delivered</Badge>;
    case 'in_progress':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800">In Progress</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default OrderStatusBadge;
