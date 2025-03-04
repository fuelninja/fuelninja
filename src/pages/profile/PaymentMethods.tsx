import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, CreditCard, Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import DataService from '@/utils/DataService';

type PaymentMethod = {
  id: number;
  type: 'Visa' | 'Mastercard' | 'American Express' | 'Discover' | 'Credit Card';
  last4: string;
  expiry: string;
  isDefault: boolean;
};

const PaymentMethods: React.FC = () => {
  const navigate = useNavigate();
  
  // State for payment methods - initialize with real data
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  
  // Load saved payment methods
  useEffect(() => {
    const userData = DataService.getUserData();
    
    if (userData.paymentMethods && userData.paymentMethods.length > 0) {
      const formattedMethods = userData.paymentMethods.map((method, index) => {
        // Convert string to valid PaymentMethod type
        let cardType: 'Visa' | 'Mastercard' | 'American Express' | 'Discover' | 'Credit Card' = 'Credit Card';
        
        if (method.cardName.includes('Visa')) {
          cardType = 'Visa';
        } else if (method.cardName.includes('Mastercard')) {
          cardType = 'Mastercard';
        } else if (method.cardName.includes('American Express')) {
          cardType = 'American Express';
        } else if (method.cardName.includes('Discover')) {
          cardType = 'Discover';
        }
        
        return {
          id: Date.now() + index,
          type: cardType,
          last4: method.cardNumberLast4,
          expiry: method.expDate,
          isDefault: index === 0 // First card is default
        };
      });
      
      setPaymentMethods(formattedMethods);
    }
  }, []);
  
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
  
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (name === 'cardNumber') {
      // Allow only digits, remove any non-digit character
      const sanitizedValue = value.replace(/\D/g, '');
      if (sanitizedValue.length <= 16) {
        setFormData({
          ...formData,
          [name]: sanitizedValue,
        });
      }
    } else if (name === 'cvv') {
      // Allow only digits for CVV with max length of 4
      const sanitizedValue = value.replace(/\D/g, '');
      if (sanitizedValue.length <= 4) {
        setFormData({
          ...formData,
          [name]: sanitizedValue,
        });
      }
    } else if (name === 'expiryDate') {
      // Format expiration date as MM/YY
      let sanitizedValue = value.replace(/\D/g, '');
      if (sanitizedValue.length > 2) {
        sanitizedValue = sanitizedValue.slice(0, 2) + '/' + sanitizedValue.slice(2, 4);
      }
      if (sanitizedValue.length <= 5) {
        setFormData({
          ...formData,
          [name]: sanitizedValue,
        });
      }
    } else if (type === 'checkbox') {
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
  
  // Credit card validation using Luhn algorithm
  const validateCreditCardNumber = (cardNumber: string): boolean => {
    if (!cardNumber) return false;
    
    // Remove all non-digit characters
    const digits = cardNumber.replace(/\D/g, '');
    
    if (digits.length < 13 || digits.length > 19) return false;
    
    let sum = 0;
    let shouldDouble = false;
    
    // Loop through digits from right to left
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits.charAt(i));
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    return sum % 10 === 0;
  };
  
  // Validate expiration date
  const validateExpirationDate = (expDate: string): boolean => {
    if (!expDate || expDate.length !== 5) return false;
    
    const [monthStr, yearStr] = expDate.split('/');
    if (!monthStr || !yearStr) return false;
    
    const month = parseInt(monthStr);
    const year = parseInt('20' + yearStr);
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    if (month < 1 || month > 12) return false;
    
    if (year < currentYear) return false;
    
    if (year === currentYear && month < currentMonth) return false;
    
    return true;
  };
  
  // Get card type based on card number
  const getCardType = (cardNumber: string): PaymentMethod['type'] => {
    const firstDigit = cardNumber.charAt(0);
    const firstTwoDigits = parseInt(cardNumber.substring(0, 2));
    const firstFourDigits = parseInt(cardNumber.substring(0, 4));
    
    if (cardNumber.startsWith('4')) {
      return 'Visa';
    } else if (
      firstTwoDigits >= 51 && 
      firstTwoDigits <= 55
    ) {
      return 'Mastercard';
    } else if (
      firstTwoDigits === 34 || 
      firstTwoDigits === 37
    ) {
      return 'American Express';
    } else if (
      firstTwoDigits === 65 || 
      firstFourDigits === 6011
    ) {
      return 'Discover';
    }
    
    return 'Credit Card';
  };
  
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (formData.cardNumber && !validateCreditCardNumber(formData.cardNumber)) {
      errors.cardNumber = 'Please enter a valid card number';
    }
    
    if (formData.expiryDate && !validateExpirationDate(formData.expiryDate)) {
      errors.expiryDate = 'Please enter a valid expiration date (MM/YY)';
    }
    
    if (formData.cvv && (formData.cvv.length < 3 || formData.cvv.length > 4)) {
      errors.cvv = 'CVV must be 3-4 digits';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleAddPayment = () => {
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }
    
    if (formData.cardNumber.length < 4) {
      toast.error("Please enter a valid card number");
      return;
    }
    
    const last4 = formData.cardNumber.slice(-4);
    const cardType = getCardType(formData.cardNumber);
    
    const newPayment: PaymentMethod = {
      id: Date.now(),
      type: cardType,
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
    
    const updatedPaymentMethods = [...updatedMethods, newPayment];
    setPaymentMethods(updatedPaymentMethods);
    
    // Save to DataService
    DataService.addPaymentMethod({
      cardName: cardType,
      cardNumberLast4: last4,
      expDate: formData.expiryDate
    });
    
    setAddDialogOpen(false);
    toast.success("Payment method added");
    resetForm();
  };
  
  const handleEditPayment = () => {
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }
    
    if (!currentPayment) return;
    
    const cardType = formData.cardNumber.length >= 4 
      ? getCardType(formData.cardNumber)
      : currentPayment.type;
      
    const last4 = formData.cardNumber.length >= 4 
      ? formData.cardNumber.slice(-4) 
      : currentPayment.last4;
    
    const updatedPayment: PaymentMethod = {
      ...currentPayment,
      type: cardType,
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
    
    // Update in DataService (in a real app, you'd have more accurate updating)
    // This is simplified for demo purposes - it adds another payment method
    if (formData.expiryDate) {
      DataService.addPaymentMethod({
        cardName: cardType,
        cardNumberLast4: last4,
        expDate: formData.expiryDate
      });
    }
    
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
    
    const updatedMethods = paymentMethods.filter(method => method.id !== id);
    setPaymentMethods(updatedMethods);
    
    // In a real app, you would update the stored payment methods
    // This is simplified for demo purposes - it doesn't actually delete from storage
    
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
    setFormErrors({});
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
    setFormErrors({});
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
            {paymentMethods.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No payment methods saved yet
              </div>
            ) : (
              paymentMethods.map((payment) => (
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
              ))
            )}
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
                placeholder="4242 4242 4242 4242"
                value={formData.cardNumber}
                onChange={handleInputChange}
                className={formErrors.cardNumber ? "border-red-300" : ""}
              />
              {formErrors.cardNumber && (
                <p className="text-red-500 text-xs mt-1">{formErrors.cardNumber}</p>
              )}
              <p className="text-xs text-gray-500">
                Test cards: 4242 4242 4242 4242 (Visa), 5555 5555 5555 4444 (MC)
              </p>
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
                  className={formErrors.expiryDate ? "border-red-300" : ""}
                />
                {formErrors.expiryDate && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.expiryDate}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input 
                  id="cvv"
                  name="cvv"
                  placeholder="123"
                  maxLength={4}
                  value={formData.cvv}
                  onChange={handleInputChange}
                  className={formErrors.cvv ? "border-red-300" : ""}
                />
                {formErrors.cvv && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.cvv}</p>
                )}
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
            <Button variant="outline" onClick={() => {
              resetForm();
              setAddDialogOpen(false);
            }}>Cancel</Button>
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
                className={formErrors.cardNumber ? "border-red-300" : ""}
              />
              {formErrors.cardNumber && (
                <p className="text-red-500 text-xs mt-1">{formErrors.cardNumber}</p>
              )}
              <p className="text-xs text-gray-500">
                Leave unchanged to keep current card number
              </p>
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
                  className={formErrors.expiryDate ? "border-red-300" : ""}
                />
                {formErrors.expiryDate && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.expiryDate}</p>
                )}
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
                  className={formErrors.cvv ? "border-red-300" : ""}
                />
                {formErrors.cvv && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.cvv}</p>
                )}
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
            <Button variant="outline" onClick={() => {
              resetForm();
              setEditDialogOpen(false);
            }}>Cancel</Button>
            <Button onClick={handleEditPayment}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <BottomNav />
    </div>
  );
};

export default PaymentMethods;
