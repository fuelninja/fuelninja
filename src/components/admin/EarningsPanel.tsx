
import React, { useState } from 'react';
import { DollarSign, ArrowDownToLine, CreditCard, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { OrderData } from '@/utils/DataService';

interface TransactionData {
  id: string;
  amount: string;
  date: number;
  status: 'pending' | 'completed' | 'failed';
  type: 'deposit' | 'revenue';
  description: string;
}

interface EarningsPanelProps {
  orders: OrderData[];
}

const EarningsPanel: React.FC<EarningsPanelProps> = ({ orders }) => {
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Mock transactions data - in a real app, this would come from a database
  const [transactions, setTransactions] = useState<TransactionData[]>([
    { 
      id: 'txn-001', 
      amount: '75.50', 
      date: Date.now() - 3 * 24 * 60 * 60 * 1000, 
      status: 'completed', 
      type: 'revenue',
      description: 'Order #53fe8c91 payment'
    },
    { 
      id: 'txn-002', 
      amount: '120.75', 
      date: Date.now() - 7 * 24 * 60 * 60 * 1000, 
      status: 'completed', 
      type: 'revenue',
      description: 'Order #92a67d4c payment'
    },
    { 
      id: 'txn-003', 
      amount: '150.00', 
      date: Date.now() - 8 * 24 * 60 * 60 * 1000, 
      status: 'completed', 
      type: 'deposit',
      description: 'Withdrawal to bank account'
    }
  ]);
  
  // Calculate total earnings from completed orders
  const calculateTotalRevenue = () => {
    return orders.reduce((sum, order) => {
      const price = parseFloat(order.price.replace('$', ''));
      return sum + price;
    }, 0).toFixed(2);
  };
  
  // Calculate available balance (total revenue minus withdrawals)
  const calculateAvailableBalance = () => {
    const totalRevenue = parseFloat(calculateTotalRevenue());
    
    const withdrawals = transactions
      .filter(t => t.type === 'deposit' && t.status === 'completed')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    return (totalRevenue - withdrawals).toFixed(2);
  };
  
  const handleDeposit = async () => {
    // Validate input
    if (!accountNumber || !routingNumber || !accountName || !withdrawAmount) {
      toast.error("All fields are required");
      return;
    }
    
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    const availableBalance = parseFloat(calculateAvailableBalance());
    if (amount > availableBalance) {
      toast.error("Withdrawal amount exceeds available balance");
      return;
    }
    
    // Process withdrawal (simulated)
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      // Add transaction record
      const newTransaction: TransactionData = {
        id: `txn-${Math.floor(Math.random() * 100000)}`,
        amount: amount.toFixed(2),
        date: Date.now(),
        status: 'completed',
        type: 'deposit',
        description: `Withdrawal to bank account ending in ${accountNumber.slice(-4)}`
      };
      
      setTransactions([newTransaction, ...transactions]);
      setIsProcessing(false);
      setWithdrawAmount('');
      
      toast.success("Funds successfully transferred to your bank account");
    }, 2000);
  };
  
  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Balance & Deposit Card */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Earnings</CardTitle>
            <CardDescription>Manage your earnings and deposits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Total Revenue</div>
              <div className="text-3xl font-bold text-green-600">${calculateTotalRevenue()}</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Available for Deposit</div>
              <div className="text-2xl font-bold">${calculateAvailableBalance()}</div>
            </div>
            
            <div className="border-t pt-4 space-y-4">
              <h3 className="font-medium">Deposit to Bank Account</h3>
              
              <div className="space-y-2">
                <Label htmlFor="accountName">Account Holder Name</Label>
                <Input 
                  id="accountName"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input 
                  id="accountNumber"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="XXXXXXXX"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="routingNumber">Routing Number</Label>
                <Input 
                  id="routingNumber"
                  value={routingNumber}
                  onChange={(e) => setRoutingNumber(e.target.value)}
                  placeholder="XXXXXXXXX"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount to Deposit ($)</Label>
                <Input 
                  id="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handleDeposit}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  <ArrowDownToLine className="mr-2 h-4 w-4" />
                  Deposit Funds
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Transaction History */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Recent revenue and deposits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  No transactions yet
                </div>
              ) : (
                transactions.map((transaction) => (
                  <div 
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-4 ${
                        transaction.type === 'revenue' 
                          ? 'bg-green-100' 
                          : 'bg-blue-100'
                      }`}>
                        {transaction.type === 'revenue' ? (
                          <DollarSign className={`h-5 w-5 ${
                            transaction.type === 'revenue' 
                              ? 'text-green-600' 
                              : 'text-blue-600'
                          }`} />
                        ) : (
                          <CreditCard className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-sm text-gray-500">{formatDate(transaction.date)}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`font-medium ${
                        transaction.type === 'revenue'
                          ? 'text-green-600'
                          : 'text-blue-600'
                      }`}>
                        {transaction.type === 'revenue' ? '+' : '-'}${transaction.amount}
                      </span>
                      <div className="ml-4">
                        {transaction.status === 'completed' && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        {transaction.status === 'pending' && (
                          <Clock className="h-5 w-5 text-yellow-500" />
                        )}
                        {transaction.status === 'failed' && (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EarningsPanel;
