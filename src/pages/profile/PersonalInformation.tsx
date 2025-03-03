
import React from 'react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PersonalInformation: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock user data - this would come from a real user profile in a production app
  const userData = {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    phone: '(713) 555-1234',
    address: '123 Main St, Houston, TX 77002',
    vehicles: [
      { make: 'Toyota', model: 'Camry', year: '2020', color: 'Silver' },
      { make: 'Honda', model: 'CR-V', year: '2019', color: 'Black' }
    ]
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
              <Button variant="ghost" size="sm" className="text-ninja-red">
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
              <Button variant="ghost" size="sm" className="text-ninja-red">
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
            </div>
            
            {userData.vehicles.map((vehicle, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg mb-3 last:mb-0">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                    <p className="text-sm text-gray-500">Color: {vehicle.color}</p>
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

export default PersonalInformation;
