
import React from 'react';
import Logo from '@/assets/logo';
import { useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container flex items-center justify-center h-16 px-4 max-w-md mx-auto">
        <Logo size={isHome ? 'lg' : 'md'} variant="colored" />
      </div>
    </header>
  );
};

export default Header;
