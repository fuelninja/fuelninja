
import React, { useState } from 'react';
import { Car } from 'lucide-react';

interface CarInfoInputProps {
  onChange: (make: string, model: string) => void;
}

const CarInfoInput: React.FC<CarInfoInputProps> = ({ onChange }) => {
  const [make, setMake] = useState<string>('');
  const [model, setModel] = useState<string>('');

  const handleMakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMake(e.target.value);
    onChange(e.target.value, model);
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModel(e.target.value);
    onChange(make, e.target.value);
  };

  return (
    <div className="glass-card p-5 space-y-4 animate-fade-in animation-delay-200">
      <div className="flex items-center mb-2">
        <Car className="w-5 h-5 text-ninja-orange mr-2" />
        <h2 className="text-lg font-semibold">Vehicle Information</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="car-make" className="block text-sm font-medium text-gray-700 mb-1">
            Car Make
          </label>
          <input
            id="car-make"
            type="text"
            placeholder="e.g. Toyota, Honda, Ford"
            value={make}
            onChange={handleMakeChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-ninja-orange focus:border-ninja-orange transition-colors"
          />
        </div>

        <div>
          <label htmlFor="car-model" className="block text-sm font-medium text-gray-700 mb-1">
            Car Model
          </label>
          <input
            id="car-model"
            type="text"
            placeholder="e.g. Camry, Civic, F-150"
            value={model}
            onChange={handleModelChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-ninja-orange focus:border-ninja-orange transition-colors"
          />
        </div>
      </div>
      
      <p className="text-sm text-gray-500">
        This helps our driver identify your vehicle for delivery
      </p>
    </div>
  );
};

export default CarInfoInput;
