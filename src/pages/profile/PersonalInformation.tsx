
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, Edit, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface UserData {
  name: string;
  email: string;
  phone: string;
  address: string;
  vehicles: {
    id: number;
    make: string;
    model: string;
    year: string;
    color: string;
  }[];
}

const PersonalInformation: React.FC = () => {
  const navigate = useNavigate();
  
  // State for user data
  const [userData, setUserData] = useState<UserData>({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    phone: '(713) 555-1234',
    address: '123 Main St, Houston, TX 77002',
    vehicles: [
      { id: 1, make: 'Toyota', model: 'Camry', year: '2020', color: 'Silver' },
      { id: 2, make: 'Honda', model: 'CR-V', year: '2019', color: 'Black' }
    ]
  });
  
  // State for dialogs
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<UserData['vehicles'][0] | null>(null);
  
  // Form states
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  
  const [vehicleForm, setVehicleForm] = useState({
    make: '',
    model: '',
    year: '',
    color: '',
  });
  
  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactForm({
      ...contactForm,
      [name]: value,
    });
  };
  
  const handleVehicleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVehicleForm({
      ...vehicleForm,
      [name]: value,
    });
  };
  
  const openContactDialog = () => {
    setContactForm({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
    });
    setContactDialogOpen(true);
  };
  
  const openAddVehicleDialog = () => {
    setVehicleForm({
      make: '',
      model: '',
      year: '',
      color: '',
    });
    setIsEditing(false);
    setCurrentVehicle(null);
    setVehicleDialogOpen(true);
  };
  
  const openEditVehicleDialog = (vehicle: UserData['vehicles'][0]) => {
    setVehicleForm({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color,
    });
    setIsEditing(true);
    setCurrentVehicle(vehicle);
    setVehicleDialogOpen(true);
  };
  
  const handleSaveContact = () => {
    if (!contactForm.name || !contactForm.email) {
      toast.error("Name and email are required");
      return;
    }
    
    setUserData({
      ...userData,
      name: contactForm.name,
      email: contactForm.email,
      phone: contactForm.phone,
      address: contactForm.address,
    });
    
    setContactDialogOpen(false);
    toast.success("Contact information updated");
  };
  
  const handleSaveVehicle = () => {
    if (!vehicleForm.make || !vehicleForm.model || !vehicleForm.year) {
      toast.error("Make, model, and year are required");
      return;
    }
    
    if (isEditing && currentVehicle) {
      // Update existing vehicle
      const updatedVehicles = userData.vehicles.map(v => 
        v.id === currentVehicle.id 
          ? { ...v, ...vehicleForm }
          : v
      );
      
      setUserData({
        ...userData,
        vehicles: updatedVehicles,
      });
      
      toast.success("Vehicle updated");
    } else {
      // Add new vehicle
      const newVehicle = {
        id: Date.now(),
        ...vehicleForm,
      };
      
      setUserData({
        ...userData,
        vehicles: [...userData.vehicles, newVehicle],
      });
      
      toast.success("Vehicle added");
    }
    
    setVehicleDialogOpen(false);
  };
  
  const handleDeleteVehicle = (id: number) => {
    setUserData({
      ...userData,
      vehicles: userData.vehicles.filter(v => v.id !== id),
    });
    
    toast.success("Vehicle removed");
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      
      <main className="container max-w-md mx-auto px-4 pb-24">
        <div className="flex items-center mb-6 pt-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/profile')}
            className="mr-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Personal Information</h1>
        </div>
        
        <div className="space-y-6">
          {/* Personal Details */}
          <div className="glass-card p-5 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Contact Details</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-ninja-red"
                onClick={openContactDialog}
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{userData.name}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium">{userData.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium">{userData.phone}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Primary Address</p>
                <p className="font-medium">{userData.address}</p>
              </div>
            </div>
          </div>
          
          {/* Vehicle Information */}
          <div className="glass-card p-5 animate-fade-in animation-delay-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Vehicles</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-ninja-red"
                onClick={openAddVehicleDialog}
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            
            {userData.vehicles.map((vehicle) => (
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
                      onClick={() => openEditVehicleDialog(vehicle)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-500"
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {userData.vehicles.length === 0 && (
              <div className="text-center p-4 text-gray-500">
                No vehicles added yet.
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Contact Information Dialog */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Contact Information</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name"
                name="name"
                value={contactForm.name}
                onChange={handleContactInputChange}
                placeholder="Full Name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email"
                name="email"
                type="email"
                value={contactForm.email}
                onChange={handleContactInputChange}
                placeholder="Email Address"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone"
                name="phone"
                value={contactForm.phone}
                onChange={handleContactInputChange}
                placeholder="Phone Number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address"
                name="address"
                value={contactForm.address}
                onChange={handleContactInputChange}
                placeholder="123 Main St"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setContactDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveContact}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Vehicle Dialog */}
      <Dialog open={vehicleDialogOpen} onOpenChange={setVehicleDialogOpen}>
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
                value={vehicleForm.make}
                onChange={handleVehicleInputChange}
                placeholder="Toyota, Honda, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input 
                id="model"
                name="model"
                value={vehicleForm.model}
                onChange={handleVehicleInputChange}
                placeholder="Camry, Civic, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input 
                id="year"
                name="year"
                value={vehicleForm.year}
                onChange={handleVehicleInputChange}
                placeholder="2023"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input 
                id="color"
                name="color"
                value={vehicleForm.color}
                onChange={handleVehicleInputChange}
                placeholder="Silver, Black, etc."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setVehicleDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveVehicle}>{isEditing ? 'Update' : 'Add'} Vehicle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <BottomNav />
    </div>
  );
};

export default PersonalInformation;
