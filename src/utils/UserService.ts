
import { toast } from "sonner";
import { UserData } from "./types";
import { BaseService } from "./BaseService";

export class UserService extends BaseService {
  private static instance: UserService;
  
  private constructor() {
    super();
  }
  
  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }
  
  public getUserData(): UserData {
    try {
      const userId = UserService.getCurrentUserId();
      if (userId) {
        const userDataKey = `fuelninja-user-${userId}`;
        const userJson = localStorage.getItem(userDataKey);
        if (userJson) {
          return JSON.parse(userJson);
        }
      }
      
      const legacyData = localStorage.getItem('fuelninja-user');
      return legacyData ? JSON.parse(legacyData) : {};
    } catch (error) {
      console.error('Error getting user data:', error);
      return {};
    }
  }
  
  public saveUserData(userData: UserData): boolean {
    try {
      const userId = UserService.getCurrentUserId();
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
  
  public addPaymentMethod(paymentMethod: { cardName: string; cardNumberLast4: string; expDate: string }): boolean {
    try {
      const userData = this.getUserData();
      
      if (!userData.paymentMethods) {
        userData.paymentMethods = [];
      }
      
      // Prevent duplicates by checking last4 and expiration
      const isDuplicate = userData.paymentMethods.some(
        method => 
          method.cardNumberLast4 === paymentMethod.cardNumberLast4 && 
          method.expDate === paymentMethod.expDate
      );
      
      if (!isDuplicate) {
        userData.paymentMethods.push(paymentMethod);
      }
      
      return this.saveUserData(userData);
    } catch (error) {
      console.error('Error adding payment method:', error);
      return false;
    }
  }
  
  public removePaymentMethod(last4: string): boolean {
    try {
      const userData = this.getUserData();
      
      if (!userData.paymentMethods) {
        return true; // Nothing to remove
      }
      
      const updatedPaymentMethods = userData.paymentMethods.filter(
        method => method.cardNumberLast4 !== last4
      );
      
      userData.paymentMethods = updatedPaymentMethods;
      return this.saveUserData(userData);
    } catch (error) {
      console.error('Error removing payment method:', error);
      return false;
    }
  }
  
  public addSavedAddress(address: string): boolean {
    try {
      const userData = this.getUserData();
      
      if (!userData.savedAddresses) {
        userData.savedAddresses = [];
      }
      
      if (!userData.savedAddresses.includes(address)) {
        userData.savedAddresses.push(address);
      }
      
      return this.saveUserData(userData);
    } catch (error) {
      console.error('Error adding saved address:', error);
      return false;
    }
  }
}

export default UserService.getInstance();
