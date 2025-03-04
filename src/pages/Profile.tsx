
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { 
  User, MapPin, CreditCard, History, 
  Receipt, HelpCircle, LogOut, Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";

const Profile = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    toast.success("You have been logged out");
    navigate('/');
  };
  
  const menuItems = [
    {
      icon: User,
      title: 'Personal Information',
      description: 'Manage your personal details',
      link: '/profile/personal-information'
    },
    {
      icon: MapPin,
      title: 'Saved Addresses',
      description: 'Manage your delivery addresses',
      link: '/profile/saved-addresses'
    },
    {
      icon: CreditCard,
      title: 'Payment Methods',
      description: 'Manage your payment options',
      link: '/profile/payment-methods'
    },
    {
      icon: History,
      title: 'Order History',
      description: 'View your past orders',
      link: '/profile/order-history'
    },
    {
      icon: Receipt,
      title: 'Receipts',
      description: 'Access your order receipts',
      link: '/profile/receipts'
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      description: 'Get assistance with your account',
      link: '/profile/help-support'
    }
  ];
  
  // Add admin dashboard link if user is an admin
  if (isAdmin) {
    menuItems.push({
      icon: Settings,
      title: 'Admin Dashboard',
      description: 'Manage the FuelNinja platform',
      link: '/admin'
    });
  }
  
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <Header />
      
      <div className="container max-w-md mx-auto px-4 pt-6 pb-20">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
          <div className="flex items-center">
            <div className="bg-gray-100 rounded-full p-3">
              <User className="w-6 h-6 text-ninja-blue" />
            </div>
            
            <div className="ml-4">
              <h2 className="font-semibold">{user?.name || 'User'}</h2>
              <p className="text-sm text-gray-600">{user?.email || 'No email provided'}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4"
            >
              <div className="flex items-center">
                <div className="rounded-full bg-gray-100 p-3">
                  <item.icon className="w-5 h-5 text-ninja-blue" />
                </div>
                
                <div className="ml-4">
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            </Link>
          ))}
          
          <button
            onClick={handleLogout}
            className="w-full bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4"
          >
            <div className="flex items-center">
              <div className="rounded-full bg-red-100 p-3">
                <LogOut className="w-5 h-5 text-red-500" />
              </div>
              
              <div className="ml-4 text-left">
                <h3 className="font-medium">Logout</h3>
                <p className="text-sm text-gray-600">Sign out of your account</p>
              </div>
            </div>
          </button>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Profile;
