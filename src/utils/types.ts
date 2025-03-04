
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
