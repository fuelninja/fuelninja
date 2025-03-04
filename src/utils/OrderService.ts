
import { toast } from "sonner";
import { OrderData } from "./types";
import { BaseService } from "./BaseService";

export class OrderService extends BaseService {
  private static instance: OrderService;
  
  private constructor() {
    super();
  }
  
  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }
  
  public getOrders(): OrderData[] {
    try {
      const ordersJson = localStorage.getItem('fuelninja-orders');
      return ordersJson ? JSON.parse(ordersJson) : [];
    } catch (error) {
      console.error('Error getting orders:', error);
      return [];
    }
  }
  
  public getUserOrders(): OrderData[] {
    try {
      const userId = OrderService.getCurrentUserId();
      if (!userId) return [];
      
      const allOrders = this.getOrders();
      return allOrders.filter(order => order.userId === userId);
    } catch (error) {
      console.error('Error getting user orders:', error);
      return [];
    }
  }
  
  public getOrderById(orderId: string): OrderData | null {
    try {
      const orders = this.getOrders();
      return orders.find(order => order.orderId === orderId) || null;
    } catch (error) {
      console.error(`Error getting order ${orderId}:`, error);
      return null;
    }
  }
  
  public saveOrder(orderData: OrderData): boolean {
    try {
      const orders = this.getOrders();
      
      const userId = OrderService.getCurrentUserId();
      if (userId) {
        orderData.userId = userId;
      }
      
      const existingOrderIndex = orders.findIndex(order => order.orderId === orderData.orderId);
      
      if (existingOrderIndex >= 0) {
        orders[existingOrderIndex] = {
          ...orders[existingOrderIndex],
          ...orderData
        };
      } else {
        orders.push(orderData);
      }
      
      localStorage.setItem('fuelninja-orders', JSON.stringify(orders));
      return true;
    } catch (error) {
      console.error('Error saving order:', error);
      toast("Failed to save order data");
      return false;
    }
  }
  
  public updateOrderStatus(orderId: string, status: string): boolean {
    try {
      const order = this.getOrderById(orderId);
      if (!order) return false;
      
      const updatedOrder = {
        ...order,
        status: status
      };
      
      if (status === 'delivered') {
        updatedOrder.deliveredAt = Date.now();
      }
      
      return this.saveOrder(updatedOrder);
    } catch (error) {
      console.error(`Error updating order ${orderId} status:`, error);
      return false;
    }
  }
}

export default OrderService.getInstance();
