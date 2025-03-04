
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatisticCardProps {
  icon: LucideIcon;
  iconColor: string;
  label: string;
  value: string | number;
}

const StatisticCard: React.FC<StatisticCardProps> = ({ 
  icon: Icon, 
  iconColor, 
  label, 
  value 
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full bg-${iconColor}-500 bg-opacity-10`}>
          <Icon className={`h-6 w-6 text-${iconColor}-500`} />
        </div>
        <div className="ml-5">
          <p className="text-gray-500 text-sm font-medium">{label}</p>
          <h2 className="text-2xl font-bold text-gray-700">{value}</h2>
        </div>
      </div>
    </div>
  );
};

export default StatisticCard;
