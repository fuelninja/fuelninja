
import React, { useState } from 'react';
import { Fuel, ChevronDown, GaugeCircle } from 'lucide-react';

interface FuelAmountSelectorProps {
  onChange: (amount: number, isFull: boolean, fuelType: string) => void;
}

const FuelAmountSelector: React.FC<FuelAmountSelectorProps> = ({ onChange }) => {
  const [amount, setAmount] = useState<number>(2);
  const [isFull, setIsFull] = useState<boolean>(false);
  const [fuelType, setFuelType] = useState<string>("Regular Unleaded");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isAdjusting, setIsAdjusting] = useState<boolean>(false);
  
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
  
  const calculateGaugeRotation = () => {
    // Map from 2-20 gallons to 0-180 degrees
    if (isFull) return 180;
    const percentage = ((amount - minAmount) / (maxAmount - minAmount)) * 180;
    return percentage;
  };
  
  const handleGaugeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isFull) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = rect.bottom - e.clientY - rect.height / 2;
    
    // Calculate angle in degrees from center of gauge
    let angle = Math.atan2(y, x) * (180 / Math.PI);
    
    // Adjust angle to be between 0 and 180
    if (angle < 0) angle = 0;
    if (angle > 180) angle = 180;
    
    // Map from 0-180 degrees to 2-20 gallons
    const newAmount = Math.round((angle / 180) * (maxAmount - minAmount) + minAmount);
    handleAmountChange(newAmount);
  };
  
  const handleGaugeMouseDown = () => {
    setIsAdjusting(true);
  };
  
  const handleGaugeMouseUp = () => {
    setIsAdjusting(false);
  };
  
  const handleGaugeMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAdjusting || isFull) return;
    handleGaugeClick(e);
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
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-1 border border-gray-200">
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
      
      {/* Interactive Fuel Gauge */}
      <div 
        className="relative w-full h-44 flex items-center justify-center cursor-pointer"
        onClick={handleGaugeClick}
        onMouseDown={handleGaugeMouseDown}
        onMouseUp={handleGaugeMouseUp}
        onMouseMove={handleGaugeMouseMove}
        onMouseLeave={handleGaugeMouseUp}
      >
        {/* Gauge Background */}
        <div className="absolute w-40 h-40 rounded-full border-8 border-gray-200 overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gray-100"></div>
        </div>
        
        {/* Gauge Fill */}
        <div 
          className="absolute bottom-0 left-0 w-40 h-40 origin-bottom overflow-hidden"
          style={{ transform: `rotate(${calculateGaugeRotation()}deg)` }}
        >
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-r from-ninja-orange to-ninja-green"></div>
        </div>
        
        {/* Gauge Needle */}
        <div 
          className="absolute bottom-0 left-1/2 w-1 h-20 bg-red-500 origin-bottom transition-transform duration-300"
          style={{ transform: `translateX(-50%) rotate(${calculateGaugeRotation()}deg)` }}
        >
          <div className="w-3 h-3 rounded-full bg-red-600 absolute -top-1 -left-1"></div>
        </div>
        
        {/* Gauge Center */}
        <div className="absolute bottom-0 left-1/2 w-6 h-6 rounded-full bg-white border-2 border-gray-300 transform -translate-x-1/2"></div>
        
        {/* Gauge Markings */}
        <div className="absolute bottom-0 left-0 w-40 h-40 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="absolute bottom-0 left-1/2 h-full origin-bottom"
              style={{ transform: `translateX(-50%) rotate(${i * 45}deg)` }}
            >
              <div className="w-1 h-3 bg-gray-400 absolute top-6"></div>
              <div className="absolute top-11 transform -translate-x-1/2 text-xs font-bold">
                {Math.round(minAmount + (i * ((maxAmount - minAmount) / 4)))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Gauge Value Display */}
        <div className="absolute w-full bottom-3 text-center">
          <div className="text-2xl font-bold drop-shadow-sm">
            {isFull ? 'Full Tank' : `${amount} Gallons`}
          </div>
        </div>
        
        {/* Gauge Icon */}
        <GaugeCircle className="absolute top-1 left-1/2 transform -translate-x-1/2 w-8 h-8 text-gray-400" />
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
