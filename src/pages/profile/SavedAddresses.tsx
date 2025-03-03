
import React from 'react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { Button } from '@/components/ui/button';
import { ChevronLeft, MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SavedAddresses: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock address data - would come from user profile in a real app
  const addresses = [
    {
      id: 1,
      label: 'Home',
      address: '123 Main St, Houston, TX 77002',
      isDefault: true
    },
    {
      id: 2,
      label: 'Work',
      address: '456 Corporate Ave, Houston, TX 77001',
      isDefault: false
    },
    {
      id: 3,
      label: 'Mom\'s House',
      address: '789 Family Rd, Katy, TX 77494',
      isDefault: false
    }
  ];
  
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
            onClick={() => console.log('Add new address')}
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
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default SavedAddresses;
