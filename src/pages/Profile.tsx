import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { User, MapPin, CreditCard, Clock, FileText, HelpCircle, LogOut } from 'lucide-react';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  
  // Sample user data - in a real app, this would come from authentication
  const user = {
    name: 'Alex Johnson',
    email: 'alex@example.com',
  };
  
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
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      
      <main className="container max-w-md mx-auto px-4 pb-24">
        <h1 className="text-2xl font-bold my-6 animate-fade-in">Profile</h1>
        
        <div className="space-y-6">
          {/* User Profile */}
          <div className="glass-card p-5 animate-fade-in">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-ninja-red to-ninja-black rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                {user.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
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
                  <item.icon className="w-5 h-5 text-ninja-red mr-3" />
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
