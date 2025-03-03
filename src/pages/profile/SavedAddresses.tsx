
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { Button } from '@/components/ui/button';
import { ChevronLeft, MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Address {
  id: number;
  label: string;
  address: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

const SavedAddresses: React.FC = () => {
  const navigate = useNavigate();
  
  // State for modal and form
  const [open, setOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    label: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    isDefault: false
  });

  // Mock address data - would come from user profile in a real app
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      label: 'Home',
      address: '123 Main St, Houston, TX 77002',
      street: '123 Main St',
      city: 'Houston',
      state: 'TX',
      zip: '77002',
      isDefault: true
    },
    {
      id: 2,
      label: 'Work',
      address: '456 Corporate Ave, Houston, TX 77001',
      street: '456 Corporate Ave',
      city: 'Houston',
      state: 'TX',
      zip: '77001',
      isDefault: false
    },
    {
      id: 3,
      label: 'Mom\'s House',
      address: '789 Family Rd, Katy, TX 77494',
      street: '789 Family Rd',
      city: 'Katy',
      state: 'TX',
      zip: '77494',
      isDefault: false
    }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddNewAddress = () => {
    setFormData({
      label: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      isDefault: false
    });
    setEditingAddress(null);
    setOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setFormData({
      label: address.label,
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
      isDefault: address.isDefault
    });
    setEditingAddress(address);
    setOpen(true);
  };

  const handleDeleteAddress = (id: number) => {
    setAddresses(addresses.filter(address => address.id !== id));
    toast.success('Address deleted successfully');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.label || !formData.street || !formData.city || !formData.state || !formData.zip) {
      toast.error('Please fill in all fields');
      return;
    }

    const fullAddress = `${formData.street}, ${formData.city}, ${formData.state} ${formData.zip}`;
    
    if (editingAddress) {
      // Update existing address
      setAddresses(addresses.map(address => 
        address.id === editingAddress.id 
          ? { 
              ...address, 
              label: formData.label,
              street: formData.street,
              city: formData.city,
              state: formData.state,
              zip: formData.zip,
              address: fullAddress,
              isDefault: formData.isDefault
            } 
          : address.isDefault && formData.isDefault 
            ? { ...address, isDefault: false } 
            : address
      ));
      toast.success('Address updated successfully');
    } else {
      // Add new address
      const newAddress: Address = {
        id: Date.now(), // Simple id generation
        label: formData.label,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        address: fullAddress,
        isDefault: formData.isDefault
      };
      
      // If this is set as default, update other addresses
      if (formData.isDefault) {
        setAddresses(prev => prev.map(address => ({
          ...address,
          isDefault: false
        })).concat(newAddress));
      } else {
        setAddresses(prev => [...prev, newAddress]);
      }
      toast.success('Address added successfully');
    }
    
    setOpen(false);
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
          <h1 className="text-2xl font-bold">Saved Addresses</h1>
        </div>
        
        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 h-12 border-dashed border-2 text-gray-500"
            onClick={handleAddNewAddress}
          >
            <Plus className="h-4 w-4" />
            Add New Address
          </Button>
          
          <div className="glass-card divide-y divide-gray-100 animate-fade-in">
            {addresses.map((address) => (
              <div key={address.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <MapPin className="h-5 w-5 text-ninja-red" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{address.label}</h3>
                      {address.isDefault && (
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{address.address}</p>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-500"
                      onClick={() => handleEditAddress(address)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-500"
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="label">Address Label</Label>
                <Input 
                  id="label" 
                  name="label" 
                  placeholder="Home, Work, etc." 
                  value={formData.label}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="street">Street Address</Label>
                <Input 
                  id="street" 
                  name="street" 
                  placeholder="123 Main St" 
                  value={formData.street}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    name="city" 
                    placeholder="Houston" 
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="state">State</Label>
                  <Input 
                    id="state" 
                    name="state" 
                    placeholder="TX" 
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="zip">Zip Code</Label>
                <Input 
                  id="zip" 
                  name="zip" 
                  placeholder="77002" 
                  value={formData.zip}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  className="rounded border-gray-300"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                />
                <Label htmlFor="isDefault">Set as default address</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingAddress ? 'Update' : 'Add'} Address</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <BottomNav />
    </div>
  );
};

export default SavedAddresses;
