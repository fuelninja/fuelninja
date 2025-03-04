
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface ContactDetailsProps {
  userData: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  onEditClick: () => void;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({ userData, onEditClick }) => {
  return (
    <div className="glass-card p-5 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Contact Details</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-ninja-red"
          onClick={onEditClick}
        >
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Full Name</p>
          <p className="font-medium">{userData.name}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Email Address</p>
          <p className="font-medium">{userData.email}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Phone Number</p>
          <p className="font-medium">{userData.phone}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Primary Address</p>
          <p className="font-medium">{userData.address}</p>
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
