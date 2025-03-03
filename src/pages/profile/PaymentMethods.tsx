
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, CreditCard, Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

type PaymentMethod = {
  id: number;
  type: 'Visa' | 'Mastercard' | 'American Express' | 'Discover';
  last4: string;
  expiry: string;
  isDefault: boolean;
};

const PaymentMethods: React.FC = () => {
  const navigate = useNavigate();
  
  // State for payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
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
  ]);
  
  // State for dialogs
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<PaymentMethod | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    cardType: 'Visa',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    isDefault: false,
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  const handleAddPayment = () => {
    if (formData.cardNumber.length < 4) {
      toast.error("Please enter a valid card number");
      return;
    }
    
    const last4 = formData.cardNumber.slice(-4);
    
    const newPayment: PaymentMethod = {
      id: Date.now(),
      type: formData.cardType as PaymentMethod['type'],
      last4,
      expiry: formData.expiryDate,
      isDefault: formData.isDefault,
    };
    
    // If this card is set as default, update other cards
    let updatedMethods = [...paymentMethods];
    if (formData.isDefault) {
      updatedMethods = updatedMethods.map(method => ({
        ...method,
        isDefault: false,
      }));
    }
    
    setPaymentMethods([...updatedMethods, newPayment]);
    setAddDialogOpen(false);
    toast.success("Payment method added");
    resetForm();
  };
  
  const handleEditPayment = () => {
    if (!currentPayment) return;
    
    const last4 = formData.cardNumber.length >= 4 
      ? formData.cardNumber.slice(-4) 
      : currentPayment.last4;
    
    const updatedPayment: PaymentMethod = {
      ...currentPayment,
      type: formData.cardType as PaymentMethod['type'],
      last4,
      expiry: formData.expiryDate || currentPayment.expiry,
      isDefault: formData.isDefault,
    };
    
    let updatedMethods = paymentMethods.map(method => 
      method.id === currentPayment.id ? updatedPayment : method
    );
    
    // If this card is set as default, update other cards
    if (formData.isDefault) {
      updatedMethods = updatedMethods.map(method => ({
        ...method,
        isDefault: method.id === currentPayment.id ? true : false,
      }));
    }
    
    setPaymentMethods(updatedMethods);
    setEditDialogOpen(false);
    toast.success("Payment method updated");
    resetForm();
  };
  
  const handleDeletePayment = (id: number) => {
    const methodToDelete = paymentMethods.find(method => method.id === id);
    if (methodToDelete?.isDefault && paymentMethods.length > 1) {
      toast.error("Can't delete default payment method. Please set another card as default first.");
      return;
    }
    
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    toast.success("Payment method removed");
  };
  
  const openEditDialog = (payment: PaymentMethod) => {
    setCurrentPayment(payment);
    setFormData({
      cardType: payment.type,
      cardNumber: `****${payment.last4}`,
      expiryDate: payment.expiry,
      cvv: '',
      isDefault: payment.isDefault,
    });
    setEditDialogOpen(true);
  };
  
  const resetForm = () => {
    setFormData({
      cardType: 'Visa',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      isDefault: false,
    });
    setCurrentPayment(null);
  };
  
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
            onClick={() => {
              resetForm();
              setAddDialogOpen(true);
            }}
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
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-500"
                      onClick={() => openEditDialog(payment)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-500"
                      onClick={() => handleDeletePayment(payment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      {/* Add Payment Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cardType">Card Type</Label>
              <select 
                id="cardType"
                name="cardType"
                value={formData.cardType}
                onChange={handleInputChange}
                className="w-full border border-input rounded-md p-2"
              >
                <option value="Visa">Visa</option>
                <option value="Mastercard">Mastercard</option>
                <option value="American Express">American Express</option>
                <option value="Discover">Discover</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input 
                id="cardNumber"
                name="cardNumber"
                placeholder="**** **** **** ****"
                value={formData.cardNumber}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiration Date</Label>
                <Input 
                  id="expiryDate"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input 
                  id="cvv"
                  name="cvv"
                  placeholder="***"
                  maxLength={4}
                  value={formData.cvv}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefault"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleInputChange}
                className="rounded"
              />
              <Label htmlFor="isDefault">Set as default payment method</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddPayment}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Payment Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Payment Method</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editCardType">Card Type</Label>
              <select 
                id="editCardType"
                name="cardType"
                value={formData.cardType}
                onChange={handleInputChange}
                className="w-full border border-input rounded-md p-2"
              >
                <option value="Visa">Visa</option>
                <option value="Mastercard">Mastercard</option>
                <option value="American Express">American Express</option>
                <option value="Discover">Discover</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editCardNumber">Card Number</Label>
              <Input 
                id="editCardNumber"
                name="cardNumber"
                placeholder="**** **** **** ****"
                value={formData.cardNumber}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editExpiryDate">Expiration Date</Label>
                <Input 
                  id="editExpiryDate"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editCvv">CVV</Label>
                <Input 
                  id="editCvv"
                  name="cvv"
                  placeholder="***"
                  maxLength={4}
                  value={formData.cvv}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="editIsDefault"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleInputChange}
                className="rounded"
              />
              <Label htmlFor="editIsDefault">Set as default payment method</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditPayment}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <BottomNav />
    </div>
  );
};

export default PaymentMethods;
