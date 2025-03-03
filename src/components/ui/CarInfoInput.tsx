
import React, { useState, useRef, useEffect } from 'react';
import { Car, ChevronDown } from 'lucide-react';

interface CarInfoInputProps {
  onChange: (make: string, model: string, color: string, year: string) => void;
}

const CarInfoInput: React.FC<CarInfoInputProps> = ({ onChange }) => {
  const [make, setMake] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [showMakes, setShowMakes] = useState<boolean>(false);
  const [showModels, setShowModels] = useState<boolean>(false);
  const [filteredMakes, setFilteredMakes] = useState<string[]>([]);
  const [filteredModels, setFilteredModels] = useState<string[]>([]);
  
  const makeRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);
  
  const carMakes = [
    'Acura', 'Audi', 'BMW', 'Buick', 'Cadillac', 'Chevrolet', 'Chrysler', 
    'Dodge', 'Ford', 'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Jaguar', 'Jeep',
    'Kia', 'Land Rover', 'Lexus', 'Lincoln', 'Mazda', 'Mercedes-Benz', 'Mini',
    'Mitsubishi', 'Nissan', 'Porsche', 'Ram', 'Subaru', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo'
  ];
  
  const carModels: Record<string, string[]> = {
    'Toyota': ['Camry', 'Corolla', 'Rav4', 'Highlander', 'Tacoma', 'Tundra', 'Prius', '4Runner', 'Sienna'],
    'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey', 'HR-V', 'Ridgeline', 'Fit'],
    'Ford': ['F-150', 'Escape', 'Explorer', 'Mustang', 'Edge', 'Bronco', 'Ranger', 'Expedition'],
    'Chevrolet': ['Silverado', 'Equinox', 'Tahoe', 'Malibu', 'Traverse', 'Camaro', 'Suburban', 'Colorado'],
    'BMW': ['3 Series', '5 Series', 'X3', 'X5', 'X7', '7 Series', 'M3', 'M5'],
  };
  
  const defaultModels = ['Base', 'Sport', 'Premium', 'Limited', 'Touring', 'GT', 'SE', 'LE', 'XLE', 'XSE'];
  
  // Common car colors
  const carColors = [
    'Black', 'White', 'Silver', 'Gray', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 
    'Brown', 'Gold', 'Beige', 'Burgundy', 'Purple', 'Pink', 'Bronze', 'Champagne'
  ];
  
  // Generate years from current year back to 1990
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1989 }, (_, i) => (currentYear - i).toString());
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (makeRef.current && !makeRef.current.contains(event.target as Node)) {
        setShowMakes(false);
      }
      if (modelRef.current && !modelRef.current.contains(event.target as Node)) {
        setShowModels(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    // Update parent component whenever any field changes
    onChange(make, model, color, year);
  }, [make, model, color, year, onChange]);
  
  const handleMakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setMake(input);
    
    if (input.length > 0) {
      const filtered = carMakes.filter(make => 
        make.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredMakes(filtered);
      setShowMakes(true);
    } else {
      setFilteredMakes([]);
      setShowMakes(false);
    }
  };
  
  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setModel(input);
    
    if (input.length > 0) {
      let availableModels = carModels[make] || defaultModels;
      const filtered = availableModels.filter(model => 
        model.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredModels(filtered);
      setShowModels(true);
    } else {
      setFilteredModels([]);
      setShowModels(false);
    }
  };
  
  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setColor(e.target.value);
  };
  
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(e.target.value);
  };
  
  const selectMake = (selectedMake: string) => {
    setMake(selectedMake);
    setModel('');
    setShowMakes(false);
  };
  
  const selectModel = (selectedModel: string) => {
    setModel(selectedModel);
    setShowModels(false);
  };
  
  const handleMakeFocus = () => {
    if (make.length > 0) {
      const filtered = carMakes.filter(carMake => 
        carMake.toLowerCase().includes(make.toLowerCase())
      );
      setFilteredMakes(filtered);
    } else {
      setFilteredMakes(carMakes);
    }
    setShowMakes(true);
  };
  
  const handleModelFocus = () => {
    if (make) {
      let availableModels = carModels[make] || defaultModels;
      if (model.length > 0) {
        const filtered = availableModels.filter(carModel => 
          carModel.toLowerCase().includes(model.toLowerCase())
        );
        setFilteredModels(filtered);
      } else {
        setFilteredModels(availableModels);
      }
      setShowModels(true);
    }
  };

  return (
    <div className="glass-card p-5 space-y-4 animate-fade-in animation-delay-200">
      <div className="flex items-center mb-2">
        <Car className="w-5 h-5 text-ninja-orange mr-2" />
        <h2 className="text-lg font-semibold">Vehicle Information</h2>
      </div>

      <div className="space-y-4">
        <div ref={makeRef} className="relative">
          <label htmlFor="car-make" className="block text-sm font-medium text-gray-700 mb-1">
            Car Make
          </label>
          <div className="relative">
            <input
              id="car-make"
              type="text"
              placeholder="e.g. Toyota, Honda, Ford"
              value={make}
              onChange={handleMakeChange}
              onFocus={handleMakeFocus}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-ninja-orange focus:border-ninja-orange transition-colors pr-10"
            />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          
          {showMakes && filteredMakes.length > 0 && (
            <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredMakes.map((makeName, index) => (
                <div
                  key={index}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                  onClick={() => selectMake(makeName)}
                >
                  {makeName}
                </div>
              ))}
            </div>
          )}
        </div>

        <div ref={modelRef} className="relative">
          <label htmlFor="car-model" className="block text-sm font-medium text-gray-700 mb-1">
            Car Model
          </label>
          <div className="relative">
            <input
              id="car-model"
              type="text"
              placeholder="e.g. Camry, Civic, F-150"
              value={model}
              onChange={handleModelChange}
              onFocus={handleModelFocus}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-ninja-orange focus:border-ninja-orange transition-colors pr-10"
              disabled={!make}
            />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          
          {showModels && filteredModels.length > 0 && (
            <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredModels.map((modelName, index) => (
                <div
                  key={index}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                  onClick={() => selectModel(modelName)}
                >
                  {modelName}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="car-color" className="block text-sm font-medium text-gray-700 mb-1">
            Car Color
          </label>
          <select
            id="car-color"
            value={color}
            onChange={handleColorChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-ninja-orange focus:border-ninja-orange transition-colors"
          >
            <option value="">Select a color</option>
            {carColors.map((colorOption, index) => (
              <option key={index} value={colorOption}>
                {colorOption}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="car-year" className="block text-sm font-medium text-gray-700 mb-1">
            Car Year
          </label>
          <select
            id="car-year"
            value={year}
            onChange={handleYearChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-ninja-orange focus:border-ninja-orange transition-colors"
          >
            <option value="">Select year</option>
            {years.map((yearOption) => (
              <option key={yearOption} value={yearOption}>
                {yearOption}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <p className="text-sm text-gray-500">
        This helps our driver identify your vehicle for delivery
      </p>
    </div>
  );
};

export default CarInfoInput;
