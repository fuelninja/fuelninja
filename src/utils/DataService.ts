
import { toast } from "sonner";
import OrderService from "./OrderService";
import UserService from "./UserService";
export type { OrderData, UserData } from "./types";

class DataService {
  private static instance: DataService;
  private orderService: typeof OrderService;
  private userService: typeof UserService;
  
  private constructor() {
    this.orderService = OrderService;
    this.userService = UserService;
  }
  
  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }
  
  // Order operations
  public getOrders = () => this.orderService.getOrders();
  public getUserOrders = () => this.orderService.getUserOrders();
  public getOrderById = (orderId: string) => this.orderService.getOrderById(orderId);
  public saveOrder = (orderData: import("./types").OrderData) => this.orderService.saveOrder(orderData);
  public updateOrderStatus = (orderId: string, status: string) => this.orderService.updateOrderStatus(orderId, status);
  public clearAllOrders = () => this.orderService.clearAllOrders();
  
  // User operations
  public getUserData = () => this.userService.getUserData();
  public saveUserData = (userData: import("./types").UserData) => this.userService.saveUserData(userData);
  public addPaymentMethod = (paymentMethod: { cardName: string; cardNumberLast4: string; expDate: string }) => 
    this.userService.addPaymentMethod(paymentMethod);
  public addSavedAddress = (address: string) => this.userService.addSavedAddress(address);
  
  // Clear all data
  public clearAllData(): void {
    this.orderService.clearAllOrders();
    localStorage.removeItem('fuelninja-user');
    
    const userId = localStorage.getItem('fuelninja-auth');
    if (userId) {
      localStorage.removeItem(`fuelninja-user-${userId}`);
    }
    
    toast("All data has been cleared");
  }
}

export default DataService.getInstance();
