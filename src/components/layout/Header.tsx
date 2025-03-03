
import React from 'react';
import Logo from '@/assets/logo';
import { Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container flex items-center justify-between h-16 px-4 max-w-md mx-auto">
        <Logo size={isHome ? 'lg' : 'md'} variant="colored" />
        
        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-700" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-ninja-orange rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
