
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
  
  // Load user data on hook init
  useEffect(() => {
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
  }, []);

  // Save updated user data
  const saveUserData = (updatedData: UserProfileData) => {
    setUserData(updatedData);
    DataService.saveUserData(updatedData);
  };

  return {
    userData,
    saveUserData
  };
};
