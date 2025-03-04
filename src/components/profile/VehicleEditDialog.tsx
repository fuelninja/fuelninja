
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface VehicleFormData {
  make: string;
  model: string;
  year: string;
  color: string;
}

interface VehicleEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: VehicleFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  isEditing: boolean;
}

const VehicleEditDialog: React.FC<VehicleEditDialogProps> = ({
  open,
  onOpenChange,
  formData,
  onInputChange,
  onSave,
  isEditing
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Vehicle' : 'Add Vehicle'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="make">Make</Label>
            <Input 
              id="make"
              name="make"
              value={formData.make}
              onChange={onInputChange}
              placeholder="Toyota, Honda, etc."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input 
              id="model"
              name="model"
              value={formData.model}
              onChange={onInputChange}
              placeholder="Camry, Civic, etc."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input 
              id="year"
              name="year"
              value={formData.year}
              onChange={onInputChange}
              placeholder="2023"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Input 
              id="color"
              name="color"
              value={formData.color}
              onChange={onInputChange}
              placeholder="Silver, Black, etc."
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSave}>{isEditing ? 'Update' : 'Add'} Vehicle</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleEditDialog;
