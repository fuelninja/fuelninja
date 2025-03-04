
export interface FuelPrice {
  [key: string]: number;
}

export interface PriceDetails {
  subtotal: string;
  serviceFee: string;
  total: string;
}

export const calculatePrice = (fuelType: string, gallons: number): PriceDetails => {
  const pricePerGallon: FuelPrice = {
    'Regular Unleaded': 3.49,
    'Supreme': 3.99,
    'Diesel': 3.79
  };
  
  const serviceFee = 6.99;
  const pricePerGal = pricePerGallon[fuelType] || 3.49;
  
  const subtotal = gallons * pricePerGal;
  const total = subtotal + serviceFee;
  
  return {
    subtotal: subtotal.toFixed(2),
    serviceFee: serviceFee.toFixed(2),
    total: total.toFixed(2),
  };
};
