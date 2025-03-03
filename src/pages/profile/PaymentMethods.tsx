
import React from 'react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { Button } from '@/components/ui/button';
import { ChevronLeft, CreditCard, Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PaymentMethods: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock payment method data - would come from user profile in a real app
  const paymentMethods = [
    {
      id: 1,
      type: 'Visa',
      last4: '4242',
      expiry: '04/25',
      isDefault: true
    },
    {
      id: 2,
      type: 'Mastercard',
      last4: '5555',
      expiry: '07/26',
      isDefault: false
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      
      <main className="container max-w-md mx-auto px-4 pb-24">
        <div className="flex items-center mb-6 pt-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/profile')}
            className="mr-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Payment Methods</h1>
        </div>
        
        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 h-12 border-dashed border-2 text-gray-500"
            onClick={() => console.log('Add new payment method')}
          >
            <Plus className="h-4 w-4" />
            Add New Payment Method
          </Button>
          
          <div className="glass-card divide-y divide-gray-100 animate-fade-in">
            {paymentMethods.map((payment) => (
              <div key={payment.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <CreditCard className="h-5 w-5 text-ninja-red" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{payment.type} •••• {payment.last4}</h3>
                      {payment.isDefault && (
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Expires {payment.expiry}</p>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default PaymentMethods;
