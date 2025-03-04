
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DataService from '@/utils/DataService';
import { OrderData, DeliveryDriverInfo } from '@/utils/types';

export const useOrderTracking = () => {
  const location = useLocation();
  const [orderId, setOrderId] = useState<string>('');
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState<string>('');
  const [orderExpired, setOrderExpired] = useState(false);
  const [deliveryTimestamp, setDeliveryTimestamp] = useState<number | null>(null);
  const [assignedDriver, setAssignedDriver] = useState<DeliveryDriverInfo | undefined>(undefined);

  useEffect(() => {
    // Extract order ID from URL query params
    const params = new URLSearchParams(location.search);
    const id = params.get('orderId');
    setOrderId(id || ''); // Set to empty string if no orderId is present
    
    // Only fetch order data if we have an order ID
    if (id) {
      const order = DataService.getOrderById(id);
      setOrderData(order);
      
      if (order) {
        // Set delivery status
        setDeliveryStatus(order.status);
        
        // Set assigned driver if available
        if (order.driverInfo) {
          setAssignedDriver(order.driverInfo);
        } else {
          // If no driver assigned to order, try to get an available driver from config
          try {
            const configData = localStorage.getItem('fuelninja-tracking-config');
            if (configData) {
              const config = JSON.parse(configData);
              if (config.activeDrivers && config.activeDrivers.length > 0) {
                // Just get the first available driver for simplicity
                setAssignedDriver(config.activeDrivers[0]);
              }
            }
          } catch (error) {
            console.error('Error loading driver info:', error);
          }
        }
        
        // If order is already delivered, set the delivery timestamp
        if (order.status === 'delivered' && order.deliveredAt) {
          setDeliveryTimestamp(order.deliveredAt);
          
          // Check if more than 30 minutes have passed since delivery
          const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;
          if (order.deliveredAt < thirtyMinutesAgo) {
            setOrderExpired(true);
          }
        }
      } else {
        // Check local storage for delivery timestamp (legacy support)
        const storedTimestamp = localStorage.getItem(`delivery-time-${id}`);
        if (storedTimestamp) {
          const timestamp = parseInt(storedTimestamp, 10);
          setDeliveryTimestamp(timestamp);
          
          // Check if more than 30 minutes have passed
          const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;
          if (timestamp < thirtyMinutesAgo) {
            setOrderExpired(true);
          }
        }
      }
    }
  }, [location]);

  // Handler for status changes from TrackingMap
  const handleStatusChange = (status: string) => {
    setDeliveryStatus(status);
    
    if (status === 'delivered') {
      // Update order status in DataService
      if (orderId) {
        DataService.updateOrderStatus(orderId, 'delivered');
      }
      
      // Store delivery timestamp in localStorage (legacy support)
      const currentTime = Date.now();
      localStorage.setItem(`delivery-time-${orderId}`, currentTime.toString());
      setDeliveryTimestamp(currentTime);
      
      const confettiShownKey = `confetti-shown-${orderId}`;
      const hasConfettiShown = localStorage.getItem(confettiShownKey);
      
      if (!hasConfettiShown) {
        // Show confetti and store in localStorage that we've shown it
        setShowConfetti(true);
        localStorage.setItem(confettiShownKey, 'true');
        
        // Show review prompt after a short delay
        setTimeout(() => {
          setShowReviewPrompt(true);
        }, 2000);
      }
    }
  };

  // Determine if we have an active order to track
  const hasActiveOrder = orderId && !orderExpired;
  const hasNoOrder = !orderId;

  return {
    orderId,
    orderData,
    showConfetti,
    setShowConfetti,
    showReviewPrompt,
    setShowReviewPrompt,
    deliveryStatus,
    orderExpired,
    deliveryTimestamp,
    assignedDriver,
    hasActiveOrder,
    hasNoOrder,
    handleStatusChange
  };
};
