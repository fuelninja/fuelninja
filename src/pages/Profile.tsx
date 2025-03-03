
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { User, MapPin, CreditCard, Clock, FileText, HelpCircle, LogOut, Camera, UserRoundPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Sample user data - in a real app, this would come from authentication
  const [user, setUser] = useState({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    profilePicture: null as string | null,
  });
  
  const menuItems = [
    { 
      icon: User, 
      label: 'Personal Information', 
      onClick: () => navigate('/profile/personal-information')
    },
    { 
      icon: MapPin, 
      label: 'Saved Addresses', 
      onClick: () => navigate('/profile/saved-addresses')
    },
    { 
      icon: CreditCard, 
      label: 'Payment Methods', 
      onClick: () => navigate('/profile/payment-methods')
    },
    { 
      icon: Clock, 
      label: 'Order History', 
      onClick: () => navigate('/profile/order-history')
    },
    { 
      icon: FileText, 
      label: 'Receipts', 
      onClick: () => navigate('/profile/receipts')
    },
    { 
      icon: HelpCircle, 
      label: 'Help & Support', 
      onClick: () => navigate('/profile/help-support')
    },
    { 
      icon: LogOut, 
      label: 'Sign Out', 
      onClick: () => console.log('Sign Out')
    },
  ];

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUser({ ...user, profilePicture: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      
      <main className="container max-w-md mx-auto px-4 pb-24">
        <h1 className="text-2xl font-bold my-6 animate-fade-in">Profile</h1>
        
        <div className="space-y-6">
          {/* User Profile */}
          <div className="glass-card p-5 animate-fade-in">
            <div className="flex items-center">
              <div className="relative mr-4">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*" 
                />
                {user.profilePicture ? (
                  <div 
                    className="w-16 h-16 rounded-full bg-cover bg-center cursor-pointer"
                    style={{ backgroundImage: `url(${user.profilePicture})` }}
                    onClick={handleProfilePictureClick}
                  >
                    <div className="absolute bottom-0 right-0 bg-ninja-blue rounded-full p-1.5">
                      <Camera className="w-3 h-3 text-white" />
                    </div>
                  </div>
                ) : (
                  <div 
                    className="w-16 h-16 bg-gradient-to-br from-ninja-blue to-ninja-orange rounded-full flex items-center justify-center text-white text-2xl font-bold cursor-pointer relative"
                    onClick={handleProfilePictureClick}
                  >
                    {user.name.charAt(0)}
                    <div className="absolute bottom-0 right-0 bg-ninja-blue rounded-full p-1.5">
                      <Camera className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-start">
                <div>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-ninja-blue p-0 h-auto mt-1 flex items-center gap-1.5"
                    onClick={handleProfilePictureClick}
                  >
                    <UserRoundPlus className="w-4 h-4" /> Change Photo
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Menu */}
          <div className="glass-card divide-y divide-gray-100 animate-fade-in animation-delay-100">
            {menuItems.map((item, index) => (
              <button
                key={item.label}
                onClick={item.onClick}
                className="w-full flex items-center justify-between py-4 px-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 text-ninja-blue mr-3" />
                  <span>{item.label}</span>
                </div>
                <div className="text-gray-400">›</div>
              </button>
            ))}
          </div>
          
          {/* App Version */}
          <div className="text-center text-gray-400 text-sm animate-fade-in animation-delay-200">
            FuelNinja v1.0.0
          </div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Profile;
