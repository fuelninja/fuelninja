
import { useState, useEffect } from 'react';
import { OrderData, DeliveryDriverInfo } from '@/utils/types';

export const useDriverAssignment = (open: boolean, order: OrderData | null) => {
  const [availableDrivers, setAvailableDrivers] = useState<DeliveryDriverInfo[]>([]);
  const [selectedDriverIndex, setSelectedDriverIndex] = useState<string>("");
  
  // Load available drivers from system config
  useEffect(() => {
    if (open) {
      try {
        const configData = localStorage.getItem('fuelninja-tracking-config');
        if (configData) {
          const config = JSON.parse(configData);
          if (config.activeDrivers && Array.isArray(config.activeDrivers)) {
            setAvailableDrivers(config.activeDrivers);
            
            // If order has a driver assigned, try to find and select that driver
            if (order?.driverInfo) {
              const driverIndex = config.activeDrivers.findIndex(
                (d: DeliveryDriverInfo) => d.name === order.driverInfo?.name
              );
              if (driverIndex >= 0) {
                setSelectedDriverIndex(driverIndex.toString());
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading drivers:', error);
      }
    }
  }, [open, order]);

  const handleAddDriver = (newDriver: DeliveryDriverInfo) => {
    try {
      const configData = localStorage.getItem('fuelninja-tracking-config') || '{}';
      const config = JSON.parse(configData);
      const updatedDrivers = [...(config.activeDrivers || []), newDriver];
      
      localStorage.setItem('fuelninja-tracking-config', JSON.stringify({
        ...config,
        activeDrivers: updatedDrivers
      }));
      
      setAvailableDrivers(updatedDrivers);
    } catch (error) {
      console.error('Error adding driver:', error);
    }
  };

  const assignDriver = () => {
    if (!selectedDriverIndex || !order) return;
    
    const driverIndex = parseInt(selectedDriverIndex);
    if (isNaN(driverIndex) || driverIndex < 0 || driverIndex >= availableDrivers.length) return;
    
    const selectedDriver = availableDrivers[driverIndex];
    
    // Import and use OrderService directly to assign driver
    return { orderId: order.orderId, driver: selectedDriver };
  };

  return {
    availableDrivers,
    selectedDriverIndex,
    setSelectedDriverIndex,
    handleAddDriver,
    assignDriver
  };
};
