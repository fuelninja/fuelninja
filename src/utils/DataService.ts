
import { toast } from "sonner";

// Define types for our data
export interface OrderData {
  orderId: string;
  fuelType: string;
  amount: number;
  price: string;
  scheduledTime: string;
  deliveryAddress: string;
  carInfo: {
    make: string;
    model: string;
    color: string;
    year: string;
  };
  status: string;
  createdAt: number;
  deliveredAt?: number;
  userId?: string; // Added user ID for tracking
}

export interface UserData {
  name?: string;
  email?: string;
  savedAddresses?: string[];
  paymentMethods?: {
    cardName: string;
    cardNumberLast4: string;
    expDate: string;
  }[];
}

// Main DataService class to handle all data operations
class DataService {
  private static instance: DataService;
  
  // Private constructor for singleton pattern
  private constructor() {}
  
  // Get the singleton instance
  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }
  
  // Get current user ID from auth
  private getCurrentUserId(): string | null {
    try {
      const authData = localStorage.getItem('fuelninja-auth');
      if (!authData) return null;
      
      const user = JSON.parse(authData);
      return user.id || null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }
  
  // Get all orders
  public getOrders(): OrderData[] {
    try {
      const ordersJson = localStorage.getItem('fuelninja-orders');
      return ordersJson ? JSON.parse(ordersJson) : [];
    } catch (error) {
      console.error('Error getting orders:', error);
      return [];
    }
  }
  
  // Get orders for current user
  public getUserOrders(): OrderData[] {
    try {
      const userId = this.getCurrentUserId();
      if (!userId) return [];
      
      const allOrders = this.getOrders();
      return allOrders.filter(order => order.userId === userId);
    } catch (error) {
      console.error('Error getting user orders:', error);
      return [];
    }
  }
  
  // Get a specific order by ID
  public getOrderById(orderId: string): OrderData | null {
    try {
      const orders = this.getOrders();
      return orders.find(order => order.orderId === orderId) || null;
    } catch (error) {
      console.error(`Error getting order ${orderId}:`, error);
      return null;
    }
  }
  
  // Save a new order
  public saveOrder(orderData: OrderData): boolean {
    try {
      const orders = this.getOrders();
      
      // Add current user ID if authenticated
      const userId = this.getCurrentUserId();
      if (userId) {
        orderData.userId = userId;
      }
      
      // Check if order already exists
      const existingOrderIndex = orders.findIndex(order => order.orderId === orderData.orderId);
      
      if (existingOrderIndex >= 0) {
        // Update existing order
        orders[existingOrderIndex] = {
          ...orders[existingOrderIndex],
          ...orderData
        };
      } else {
        // Add new order
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
  
  // Update order status
  public updateOrderStatus(orderId: string, status: string): boolean {
    try {
      const order = this.getOrderById(orderId);
      if (!order) return false;
      
      const updatedOrder = {
        ...order,
        status: status
      };
      
      // Add delivery timestamp if status is delivered
      if (status === 'delivered') {
        updatedOrder.deliveredAt = Date.now();
      }
      
      return this.saveOrder(updatedOrder);
    } catch (error) {
      console.error(`Error updating order ${orderId} status:`, error);
      return false;
    }
  }
  
  // Get user data
  public getUserData(): UserData {
    try {
      // First try to get user-specific data
      const userId = this.getCurrentUserId();
      if (userId) {
        const userDataKey = `fuelninja-user-${userId}`;
        const userJson = localStorage.getItem(userDataKey);
        if (userJson) {
          return JSON.parse(userJson);
        }
      }
      
      // Fall back to legacy data
      const legacyData = localStorage.getItem('fuelninja-user');
      return legacyData ? JSON.parse(legacyData) : {};
    } catch (error) {
      console.error('Error getting user data:', error);
      return {};
    }
  }
  
  // Save user data
  public saveUserData(userData: UserData): boolean {
    try {
      const userId = this.getCurrentUserId();
      const storageKey = userId ? `fuelninja-user-${userId}` : 'fuelninja-user';
      
      const existingData = this.getUserData();
      
      const updatedData = {
        ...existingData,
        ...userData
      };
      
      localStorage.setItem(storageKey, JSON.stringify(updatedData));
      return true;
    } catch (error) {
      console.error('Error saving user data:', error);
      toast("Failed to save user data");
      return false;
    }
  }
  
  // Add a payment method
  public addPaymentMethod(paymentMethod: { cardName: string; cardNumberLast4: string; expDate: string }): boolean {
    try {
      const userData = this.getUserData();
      
      if (!userData.paymentMethods) {
        userData.paymentMethods = [];
      }
      
      userData.paymentMethods.push(paymentMethod);
      return this.saveUserData(userData);
    } catch (error) {
      console.error('Error adding payment method:', error);
      return false;
    }
  }
  
  // Add a saved address
  public addSavedAddress(address: string): boolean {
    try {
      const userData = this.getUserData();
      
      if (!userData.savedAddresses) {
        userData.savedAddresses = [];
      }
      
      // Don't add duplicates
      if (!userData.savedAddresses.includes(address)) {
        userData.savedAddresses.push(address);
      }
      
      return this.saveUserData(userData);
    } catch (error) {
      console.error('Error adding saved address:', error);
      return false;
    }
  }
  
  // Clear all data (for testing or user logout)
  public clearAllData(): void {
    localStorage.removeItem('fuelninja-orders');
    localStorage.removeItem('fuelninja-user');
    
    // Also clear user-specific data
    const userId = this.getCurrentUserId();
    if (userId) {
      localStorage.removeItem(`fuelninja-user-${userId}`);
    }
    
    toast("All data has been cleared");
  }
}

// Export the singleton instance
export default DataService.getInstance();
