
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, MapPin, User } from 'lucide-react';

const BottomNav: React.FC = () => {
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Calendar, label: 'Book', path: '/book' },
    { icon: MapPin, label: 'Track', path: '/track' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-gray-100">
      <div className="container max-w-md mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'text-ninja-orange font-medium scale-105' 
                    : 'text-gray-500 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon 
                    className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : ''}`} 
                  />
                  <span className="text-xs mt-1">{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-1 w-1 h-1 bg-ninja-orange rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
