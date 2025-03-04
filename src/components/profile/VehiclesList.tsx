
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Plus, Trash2 } from 'lucide-react';

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: string;
  color: string;
}

interface VehiclesListProps {
  vehicles: Vehicle[];
  onAddClick: () => void;
  onEditClick: (vehicle: Vehicle) => void;
  onDeleteClick: (id: number) => void;
}

const VehiclesList: React.FC<VehiclesListProps> = ({ 
  vehicles, 
  onAddClick, 
  onEditClick, 
  onDeleteClick 
}) => {
  return (
    <div className="glass-card p-5 animate-fade-in animation-delay-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Vehicles</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-ninja-red"
          onClick={onAddClick}
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>
      
      {vehicles.map((vehicle) => (
        <div key={vehicle.id} className="p-3 bg-gray-50 rounded-lg mb-3 last:mb-0">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</p>
              <p className="text-sm text-gray-500">Color: {vehicle.color}</p>
            </div>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-500"
                onClick={() => onEditClick(vehicle)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-500"
                onClick={() => onDeleteClick(vehicle.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
      
      {vehicles.length === 0 && (
        <div className="text-center p-4 text-gray-500">
          No vehicles added yet.
        </div>
      )}
    </div>
  );
};

export default VehiclesList;
