
import React, { useState } from 'react';
import { Fuel, ChevronDown } from 'lucide-react';

interface FuelAmountSelectorProps {
  onChange: (amount: number, isFull: boolean, fuelType: string) => void;
}

const FuelAmountSelector: React.FC<FuelAmountSelectorProps> = ({ onChange }) => {
  const [amount, setAmount] = useState<number>(2);
  const [isFull, setIsFull] = useState<boolean>(false);
  const [fuelType, setFuelType] = useState<string>("Regular Unleaded");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  
  const minAmount = 2;
  const maxAmount = 20;
  
  const fuelTypes = [
    "Regular Unleaded",
    "Supreme",
    "Diesel"
  ];
  
  const handleAmountChange = (newAmount: number) => {
    if (newAmount >= minAmount && newAmount <= maxAmount) {
      setAmount(newAmount);
      setIsFull(false);
      onChange(newAmount, false, fuelType);
    }
  };
  
  const handleFullTankToggle = () => {
    setIsFull(!isFull);
    onChange(isFull ? amount : 0, !isFull, fuelType);
  };
  
  const handleFuelTypeChange = (type: string) => {
    setFuelType(type);
    setIsDropdownOpen(false);
    onChange(isFull ? 0 : amount, isFull, type);
  };
  
  const calculateFillPercentage = () => {
    return isFull ? 100 : (amount / maxAmount) * 100;
  };
  
  return (
    <div className="glass-card p-5 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Fuel Amount</h2>
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-ninja-orange transition-colors"
          >
            <Fuel className="w-5 h-5 text-ninja-orange mr-1" />
            <span>{fuelType}</span>
            <ChevronDown className="w-4 h-4 ml-1" />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 py-1 border border-gray-200">
              {fuelTypes.map((type) => (
                <button
                  key={type}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    type === fuelType ? 'bg-gray-100 text-ninja-orange' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => handleFuelTypeChange(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="relative h-16 bg-gray-100 rounded-xl overflow-hidden">
        <div 
          className="absolute h-full bg-gradient-to-r from-ninja-orange to-ninja-green transition-all duration-500 ease-out"
          style={{ width: `${calculateFillPercentage()}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold drop-shadow-sm">
            {isFull ? 'Full Tank' : `${amount} Gallons`}
          </span>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <button 
          className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold hover:bg-gray-200 transition-colors"
          onClick={() => handleAmountChange(amount - 1)}
          disabled={amount <= minAmount || isFull}
        >
          -
        </button>
        
        <button
          className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
            isFull 
              ? 'bg-ninja-orange text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={handleFullTankToggle}
        >
          Full Tank
        </button>
        
        <button 
          className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold hover:bg-gray-200 transition-colors"
          onClick={() => handleAmountChange(amount + 1)}
          disabled={amount >= maxAmount || isFull}
        >
          +
        </button>
      </div>
      
      <div className="text-center text-sm text-gray-500">
        {isFull ? 'We will fill your tank completely' : `Select between ${minAmount} and ${maxAmount} gallons`}
      </div>
    </div>
  );
};

export default FuelAmountSelector;
