
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
  userId?: string;
  driverInfo?: DeliveryDriverInfo;
}

export interface UserData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  savedAddresses?: string[];
  paymentMethods?: {
    cardName: string;
    cardNumberLast4: string;
    expDate: string;
  }[];
  vehicles?: {
    id: number;
    make: string;
    model: string;
    year: string;
    color: string;
  }[];
}

export interface PaymentCardValidation {
  isValid: boolean;
  cardType: 'Visa' | 'Mastercard' | 'American Express' | 'Discover' | 'Unknown';
  last4: string;
}

export type CardType = 'Visa' | 'Mastercard' | 'American Express' | 'Discover' | 'Credit Card';

export interface DeliveryStep {
  key: string;
  label: string;
  description: string;
  order: number;
}

export interface DeliveryDriverInfo {
  name: string;
  phone?: string;
  licensePlate?: string;
  vehicleModel?: string;
  vehicleColor?: string;
  photo?: string;
  eta?: string;
  location?: string; 
}

export interface DeliverySystemConfig {
  steps: DeliveryStep[];
  activeDrivers: DeliveryDriverInfo[];
}
