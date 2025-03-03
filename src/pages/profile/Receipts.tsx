
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { Button } from '@/components/ui/button';
import { ChevronLeft, FileText, Download, Calendar, Fuel, MapPin, CreditCard } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateReceiptPDF, ReceiptData } from '@/utils/pdfGenerator';
import { toast } from '@/hooks/use-toast';

const Receipts: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('order');
  
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(orderId);
  
  // Mock receipts data - would come from user profile in a real app
  const receipts = [
    {
      id: 'ORD-001234',
      date: 'May 15, 2023',
      time: '2:30 PM',
      status: 'Completed',
      items: [
        { description: 'Regular Unleaded Gasoline', quantity: '8 gallons', price: 27.92 },
        { description: 'Service Fee', quantity: '1', price: 6.99 },
        { description: 'Delivery Discount', quantity: '1', price: -2.99 }
      ],
      subtotal: 31.92,
      tax: 2.64,
      total: 34.56,
      paymentMethod: 'Visa •••• 4242',
      deliveryAddress: '123 Main St, Houston, TX',
      vehicle: '2020 Toyota Camry (Silver)'
    },
    {
      id: 'ORD-001122',
      date: 'April 28, 2023',
      time: '10:15 AM',
      status: 'Completed',
      items: [
        { description: 'Regular Unleaded Gasoline', quantity: '12 gallons', price: 41.88 },
        { description: 'Service Fee', quantity: '1', price: 6.99 },
        { description: 'Delivery Discount', quantity: '1', price: -0.99 }
      ],
      subtotal: 47.88,
      tax: 3.95,
      total: 51.83,
      paymentMethod: 'Visa •••• 4242',
      deliveryAddress: '456 Corporate Ave, Houston, TX',
      vehicle: '2020 Toyota Camry (Silver)'
    },
    {
      id: 'ORD-000987',
      date: 'April 10, 2023',
      time: '3:45 PM',
      status: 'Completed',
      items: [
        { description: 'Regular Unleaded Gasoline', quantity: '5 gallons', price: 17.45 },
        { description: 'Service Fee', quantity: '1', price: 6.99 },
        { description: 'Delivery Discount', quantity: '1', price: -4.49 }
      ],
      subtotal: 19.95,
      tax: 1.65,
      total: 21.60,
      paymentMethod: 'Mastercard •••• 5555',
      deliveryAddress: '789 Family Rd, Katy, TX',
      vehicle: '2019 Honda CR-V (Black)'
    }
  ];
  
  const selectedReceiptData = receipts.find(receipt => receipt.id === selectedReceipt);
  
  const handleDownloadReceipt = () => {
    if (selectedReceiptData) {
      const pdf = generateReceiptPDF(selectedReceiptData as ReceiptData);
      pdf.save(`FuelNinja_Receipt_${selectedReceiptData.id}.pdf`);
      toast({
        title: "Receipt Downloaded",
        description: `Your receipt ${selectedReceiptData.id} has been downloaded.`,
        variant: "default",
      });
    }
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
          <h1 className="text-2xl font-bold">Receipts</h1>
        </div>
        
        <div className="space-y-4">
          {selectedReceiptData ? (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedReceipt(null)}
                >
                  Back to Receipts
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={handleDownloadReceipt}
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
              
              <div className="glass-card p-5 mb-4">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold">Receipt</h2>
                    <p className="text-gray-600">{selectedReceiptData.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">FuelNinja</p>
                    <p className="text-sm text-gray-600">Houston, TX</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <p className="text-sm text-gray-600">
                    {selectedReceiptData.date} at {selectedReceiptData.time}
                  </p>
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between pb-2 border-b border-gray-100">
                    <span className="font-medium">Description</span>
                    <div className="flex gap-8">
                      <span className="font-medium w-20 text-right">Quantity</span>
                      <span className="font-medium w-20 text-right">Price</span>
                    </div>
                  </div>
                  
                  {selectedReceiptData.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.description}</span>
                      <div className="flex gap-8">
                        <span className="text-gray-600 w-20 text-right">{item.quantity}</span>
                        <span className="w-20 text-right">${item.price.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2 pt-2 border-t border-gray-100 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${selectedReceiptData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${selectedReceiptData.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${selectedReceiptData.total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex items-start gap-2">
                    <CreditCard className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Payment Method</p>
                      <p className="text-sm text-gray-600">{selectedReceiptData.paymentMethod}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Delivery Location</p>
                      <p className="text-sm text-gray-600">{selectedReceiptData.deliveryAddress}</p>
                      <p className="text-sm text-gray-600">{selectedReceiptData.vehicle}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-500">
                Thank you for choosing FuelNinja! If you have any questions about this receipt, please contact our support team.
              </div>
            </div>
          ) : (
            <div className="glass-card divide-y divide-gray-100 animate-fade-in">
              {receipts.map((receipt) => (
                <button
                  key={receipt.id}
                  className="w-full p-4 flex items-start text-left hover:bg-gray-50 transition-colors"
                  onClick={() => setSelectedReceipt(receipt.id)}
                >
                  <div className="bg-gray-100 p-2 rounded-full mr-3">
                    <FileText className="h-5 w-5 text-ninja-red" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{receipt.id}</h3>
                        <p className="text-sm text-gray-600">{receipt.date}</p>
                      </div>
                      <p className="font-medium">${receipt.total.toFixed(2)}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Fuel className="h-4 w-4 text-gray-500" />
                      <p className="text-sm text-gray-600">
                        {receipt.items[0].quantity} of fuel
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Receipts;
