
import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div 
        className={`${sizeClasses[size]} ${className} animate-spin rounded-full border-2 border-gray-300 border-t-ninja-blue`} 
      />
    </div>
  );
};

export default Spinner;
