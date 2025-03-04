
import { useState, useEffect } from 'react';
import DataService from '@/utils/DataService';
import { toast } from 'sonner';

export interface UserProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  vehicles: {
    id: number;
    make: string;
    model: string;
    year: string;
    color: string;
  }[];
}

export const useUserProfile = () => {
  // Initialize with empty user data
  const [userData, setUserData] = useState<UserProfileData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    vehicles: []
  });
  
  const [isLoading, setIsLoading] = useState(true);
  
  // Load user data on hook init
  useEffect(() => {
    setIsLoading(true);
    const storedData = DataService.getUserData();
    
    if (storedData) {
      // Initialize with defaults for any missing fields
      setUserData({
        name: storedData.name || '',
        email: storedData.email || '',
        phone: storedData.phone || '',
        address: storedData.address || '',
        vehicles: storedData.vehicles || []
      });
    }
    setIsLoading(false);
  }, []);

  // Save updated user data
  const saveUserData = (updatedData: UserProfileData) => {
    try {
      setUserData(updatedData);
      const success = DataService.saveUserData(updatedData);
      
      if (success) {
        toast.success("Profile information saved successfully");
      } else {
        toast.error("Failed to save profile information");
      }
    } catch (error) {
      console.error("Error saving user profile:", error);
      toast.error("An error occurred while saving profile information");
    }
  };

  return {
    userData,
    saveUserData,
    isLoading
  };
};
