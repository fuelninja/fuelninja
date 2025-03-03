
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'light' | 'colored';
}

const Logo: React.FC<LogoProps> = ({ 
  className, 
  size = 'md', 
  variant = 'colored' 
}) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
  };
  
  const variantClasses = {
    dark: 'text-ninja-black',
    light: 'text-ninja-white',
    colored: 'text-gradient',
  };
  
  return (
    <div className={cn('font-bold flex items-center gap-2', sizeClasses[size], className)}>
      <span className={cn(variantClasses[variant], 'tracking-tight')}>Fuel<span className="font-extrabold">Ninja</span></span>
      
      {variant === 'colored' && (
        <div className="relative">
          {/* Animated Oil Drop Ninja */}
          <div className="relative w-8 h-8 animate-bounce">
            {/* Oil Drop Base */}
            <div className="absolute inset-0 bg-ninja-red rounded-full opacity-90"></div>
            
            {/* Ninja Mask Band */}
            <div className="absolute top-1/4 w-full h-1 bg-ninja-black"></div>
            
            {/* Ninja Eyes */}
            <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full"></div>
            <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-white rounded-full"></div>
            
            {/* Small shine effect */}
            <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white rounded-full opacity-60"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;
