
import React, { createContext, useState, useContext, useEffect } from 'react';
import DataService from '@/utils/DataService';

export type UserRole = 'user' | 'admin';

export interface AuthUser {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on load
    const storedUser = localStorage.getItem('fuelninja-auth');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing auth data:', e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simple mock authentication (in real app, this would be a server call)
      // Hard-coded admin credentials for demo purposes
      if (email === 'admin@fuelninja.com' && password === 'admin123') {
        const adminUser: AuthUser = {
          id: 'admin-1',
          name: 'Admin User',
          email: email,
          role: 'admin'
        };
        
        localStorage.setItem('fuelninja-auth', JSON.stringify(adminUser));
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
      
      localStorage.setItem('fuelninja-auth', JSON.stringify(newUser));
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
      
      localStorage.setItem('fuelninja-auth', JSON.stringify(newUser));
      
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
    localStorage.removeItem('fuelninja-auth');
    setUser(null);
  };

  // Computed property for easier admin checks
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register, 
      logout,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
