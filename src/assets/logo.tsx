
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
    dark: 'text-ninja-primary',
    light: 'text-ninja-white',
    colored: 'text-gradient',
  };
  
  return (
    <div className={cn('font-bold flex items-center gap-2', sizeClasses[size], className)}>
      <span className={cn(variantClasses[variant], 'tracking-tight')}>Fuel<span className="font-extrabold">Ninja</span></span>
    </div>
  );
};

export default Logo;
