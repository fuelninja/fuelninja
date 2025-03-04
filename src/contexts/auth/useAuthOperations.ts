
import { useState } from 'react';
import { AuthUser } from './types';
import { storeUser, removeStoredUser } from './utils';
import DataService from '@/utils/DataService';

export const useAuthOperations = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simple mock authentication (in real app, this would be a server call)
      // Hard-coded admin credentials for demo purposes
      if (email === 'fuelninjahelp@gmail.com' && password === 'admin123') {
        const adminUser: AuthUser = {
          id: 'admin-1',
          name: 'Admin User',
          email: email,
          role: 'admin'
        };
        
        storeUser(adminUser);
        setUser(adminUser);
        return true;
      }

      // Regular user authentication logic
      // In a real app, this would verify credentials against a database
      const userId = `user-${Date.now()}`;
      const newUser: AuthUser = {
        id: userId,
        name: null, // Will be set in profile
        email: email,
        role: 'user'
      };
      
      storeUser(newUser);
      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // For demo, just create a new user (in real app would check for duplicates)
      const userId = `user-${Date.now()}`;
      const newUser: AuthUser = {
        id: userId,
        name: name,
        email: email,
        role: 'user'
      };
      
      storeUser(newUser);
      
      // Also save to user data
      DataService.saveUserData({
        name: name,
        email: email
      });
      
      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeStoredUser();
    setUser(null);
  };

  return {
    user,
    setUser,
    isLoading,
    setIsLoading,
    login,
    register,
    logout
  };
};
