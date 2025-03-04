
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DeliveryDriverInfo } from '@/utils/types';
import { UserPlus, Save, X } from 'lucide-react';

interface DriverManagementProps {
  onDriverAdded: (driver: DeliveryDriverInfo) => void;
}

const DriverManagement: React.FC<DriverManagementProps> = ({ onDriverAdded }) => {
  const [showForm, setShowForm] = useState(false);
  const [newDriver, setNewDriver] = useState<Partial<DeliveryDriverInfo>>({
    name: '',
    phone: '',
    licensePlate: '',
    vehicleModel: '',
    vehicleColor: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriver.name) return;

    const driver: DeliveryDriverInfo = {
      name: newDriver.name!,
      phone: newDriver.phone,
      licensePlate: newDriver.licensePlate,
      vehicleModel: newDriver.vehicleModel,
      vehicleColor: newDriver.vehicleColor,
    };

    onDriverAdded(driver);
    setNewDriver({ name: '', phone: '', licensePlate: '', vehicleModel: '', vehicleColor: '' });
    setShowForm(false);
  };

  if (!showForm) {
    return (
      <Button onClick={() => setShowForm(true)} className="w-full">
        <UserPlus className="mr-2 h-4 w-4" />
        Add New Driver
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Add New Driver</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Driver Name *"
              value={newDriver.name}
              onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Input
              placeholder="Phone Number"
              value={newDriver.phone}
              onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
            />
          </div>
          <div>
            <Input
              placeholder="License Plate"
              value={newDriver.licensePlate}
              onChange={(e) => setNewDriver({ ...newDriver, licensePlate: e.target.value })}
            />
          </div>
          <div>
            <Input
              placeholder="Vehicle Model"
              value={newDriver.vehicleModel}
              onChange={(e) => setNewDriver({ ...newDriver, vehicleModel: e.target.value })}
            />
          </div>
          <div>
            <Input
              placeholder="Vehicle Color"
              value={newDriver.vehicleColor}
              onChange={(e) => setNewDriver({ ...newDriver, vehicleColor: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              <Save className="mr-2 h-4 w-4" />
              Save Driver
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DriverManagement;
