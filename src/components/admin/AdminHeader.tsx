
import React from 'react';
import { RefreshCw, LogOut, Home, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdminHeaderProps {
  onRefresh: () => void;
  onLogout: () => void;
  isLoading: boolean;
  activeTab: string;
  onTabChange: (value: string) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  onRefresh, 
  onLogout, 
  isLoading, 
  activeTab, 
  onTabChange 
}) => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-ninja-blue">FuelNinja Admin Console</h1>
          
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button 
                variant="outline" 
                size="sm"
              >
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="orders">
              <Gauge className="w-4 h-4 mr-2" />
              Order Management
            </TabsTrigger>
            <TabsTrigger value="earnings">
              <Gauge className="w-4 h-4 mr-2" />
              Earnings & Payouts
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </header>
  );
};

export default AdminHeader;
