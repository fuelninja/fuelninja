
import React, { useState } from 'react';
import { Fuel, ChevronDown } from 'lucide-react';
import { Slider } from "@/components/ui/slider";

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
  
  const handleAmountChange = (newAmount: number[]) => {
    if (newAmount[0] >= minAmount && newAmount[0] <= maxAmount) {
      setAmount(newAmount[0]);
      setIsFull(false);
      onChange(newAmount[0], false, fuelType);
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
  
  return (
    <div className="glass-card p-5 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Fuel Amount</h2>
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-ninja-red transition-colors"
          >
            <Fuel className="w-5 h-5 text-ninja-red mr-1" />
            <span>{fuelType}</span>
            <ChevronDown className="w-4 h-4 ml-1" />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-1 border border-gray-200">
              {fuelTypes.map((type) => (
                <button
                  key={type}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    type === fuelType ? 'bg-gray-100 text-ninja-red' : 'text-gray-700 hover:bg-gray-50'
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
      
      {/* Interactive Fuel Slider */}
      <div className="py-6">
        <Slider
          defaultValue={[amount]}
          min={minAmount}
          max={maxAmount}
          step={1}
          value={[amount]}
          onValueChange={handleAmountChange}
          disabled={isFull}
          className="my-4"
        />
        
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>{minAmount} gal</span>
          <span>{maxAmount} gal</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">
          {isFull ? 'Full Tank' : `${amount} Gallons`}
        </div>
        
        <button
          className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
            isFull 
              ? 'bg-ninja-red text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={handleFullTankToggle}
        >
          Full Tank
        </button>
      </div>
      
      <div className="text-center text-sm text-gray-500">
        {isFull ? 'We will fill your tank completely' : `Select between ${minAmount} and ${maxAmount} gallons`}
      </div>
    </div>
  );
};

export default FuelAmountSelector;
