
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import ContactDetails from '@/components/profile/ContactDetails';
import VehiclesList from '@/components/profile/VehiclesList';
import ContactEditDialog from '@/components/profile/ContactEditDialog';
import VehicleEditDialog from '@/components/profile/VehicleEditDialog';
import { useUserProfile } from '@/hooks/useUserProfile';

const PersonalInformation: React.FC = () => {
  const navigate = useNavigate();
  const { userData, saveUserData } = useUserProfile();
  
  // State for dialogs
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<typeof userData.vehicles[0] | null>(null);
  
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
  
  // Form change handlers
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
  
  // Dialog open handlers
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
  
  const openEditVehicleDialog = (vehicle: typeof userData.vehicles[0]) => {
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
  
  // Save handlers
  const handleSaveContact = () => {
    if (!contactForm.name || !contactForm.email) {
      toast.error("Name and email are required");
      return;
    }
    
    const updatedData = {
      ...userData,
      name: contactForm.name,
      email: contactForm.email,
      phone: contactForm.phone,
      address: contactForm.address,
    };
    
    saveUserData(updatedData);
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
      
      saveUserData({
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
      
      saveUserData({
        ...userData,
        vehicles: [...userData.vehicles, newVehicle],
      });
      
      toast.success("Vehicle added");
    }
    
    setVehicleDialogOpen(false);
  };
  
  const handleDeleteVehicle = (id: number) => {
    saveUserData({
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
          <ContactDetails 
            userData={userData} 
            onEditClick={openContactDialog} 
          />
          
          {/* Vehicle Information */}
          <VehiclesList 
            vehicles={userData.vehicles}
            onAddClick={openAddVehicleDialog}
            onEditClick={openEditVehicleDialog}
            onDeleteClick={handleDeleteVehicle}
          />
        </div>
      </main>
      
      {/* Dialogs */}
      <ContactEditDialog 
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
        formData={contactForm}
        onInputChange={handleContactInputChange}
        onSave={handleSaveContact}
      />
      
      <VehicleEditDialog 
        open={vehicleDialogOpen}
        onOpenChange={setVehicleDialogOpen}
        formData={vehicleForm}
        onInputChange={handleVehicleInputChange}
        onSave={handleSaveVehicle}
        isEditing={isEditing}
      />
      
      <BottomNav />
    </div>
  );
};

export default PersonalInformation;
