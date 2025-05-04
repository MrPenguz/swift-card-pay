import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { ArrowUpRight, ArrowDownRight, Package, Candy, Cookie } from 'lucide-react';

interface User {
  id: number;
  name: string;
  matricNumber: string;
  cardNumber: string;
  balance: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  icon: JSX.Element;
}

interface TransactionLog {
  id: number;
  userName: string;
  matricNumber: string;
  cardNumber: string;
  type: 'credit' | 'debit';
  amount: number;
  previousBalance: number;
  currentBalance: number;
  timestamp: string;
}

// TODO: Move products to database when implemented
// Products data - using Cookie icon with different names
const products = [
  { id: 1, name: 'Chocolate Bar', price: 500, icon: <Candy className="h-4 w-4" /> },
  { id: 2, name: 'Chips Packet', price: 350, icon: <Cookie className="h-4 w-4" /> },
  { id: 3, name: 'Donut', price: 450, icon: <Cookie className="h-4 w-4" /> },
  { id: 4, name: 'Snack Box', price: 800, icon: <Package className="h-4 w-4" /> },
];

const Transactions = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [transactionType, setTransactionType] = useState<'credit' | 'debit'>('credit');
  const [amount, setAmount] = useState<number>(0);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [transactionMethod, setTransactionMethod] = useState<'manual' | 'product'>('manual');
  const { toast } = useToast();
  
  useEffect(() => {
    // TODO: Replace with API call to your database when implemented
    // Load users from localStorage
    const fetchUsers = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // TODO: Replace with actual API call to fetch users from your database
        const storedUsers = localStorage.getItem('appUsers');
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers));
        } else {
          // If no users in localStorage, don't set any users
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [toast]);
  
  useEffect(() => {
    if (selectedUserId) {
      const user = users.find(u => u.id === parseInt(selectedUserId, 10)) || null;
      setSelectedUser(user);
    } else {
      setSelectedUser(null);
    }
  }, [selectedUserId, users]);
  
  useEffect(() => {
    if (selectedProductId && transactionMethod === 'product') {
      const product = products.find(p => p.id === parseInt(selectedProductId, 10));
      if (product) {
        setAmount(product.price);
        setTransactionType('debit'); // Products are always purchased (debit)
      }
    } else if (transactionMethod === 'manual') {
      setAmount(0);
    }
  }, [selectedProductId, transactionMethod]);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setAmount(value);
  };

  const handleTransactionMethodChange = (value: 'manual' | 'product') => {
    setTransactionMethod(value);
    if (value === 'manual') {
      setSelectedProductId('');
      setAmount(0);
    } else {
      setTransactionType('debit');
    }
  };
  
  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!selectedUser) {
      toast({
        title: "Error",
        description: "Please select a user",
        variant: "destructive",
      });
      return;
    }
    
    if (amount <= 0) {
      toast({
        title: "Error",
        description: "Amount must be greater than zero",
        variant: "destructive",
      });
      return;
    }
    
    if (transactionType === 'debit' && selectedUser.balance < amount) {
      toast({
        title: "Error",
        description: "Insufficient balance for debit",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // TODO: Replace with actual API call to process transaction in your database
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let newBalance = 0;
      // Update user balance locally
      // TODO: Replace with actual API call to update user balance in your database
      const updatedUsers = users.map(user => {
        if (user.id === selectedUser.id) {
          newBalance = transactionType === 'credit' 
            ? user.balance + amount 
            : user.balance - amount;
          
          return {
            ...user,
            balance: newBalance,
          };
        }
        return user;
      });
      
      // TODO: Replace localStorage with database updates
      // Save updated users to localStorage
      setUsers(updatedUsers);
      localStorage.setItem('appUsers', JSON.stringify(updatedUsers));
      
      // Create transaction log
      // TODO: Replace with actual API call to create transaction log in your database
      const newLog: TransactionLog = {
        id: new Date().getTime(), // Use timestamp as a unique ID
        userName: selectedUser.name,
        matricNumber: selectedUser.matricNumber,
        cardNumber: selectedUser.cardNumber,
        type: transactionType,
        amount: amount,
        previousBalance: selectedUser.balance,
        currentBalance: newBalance,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) // Format as YYYY-MM-DD HH:MM:SS
      };
      
      // TODO: Replace localStorage with database updates
      // Save transaction log to localStorage
      const existingLogs: TransactionLog[] = JSON.parse(localStorage.getItem('transactionLogs') || '[]');
      const updatedLogs = [newLog, ...existingLogs];
      localStorage.setItem('transactionLogs', JSON.stringify(updatedLogs));
      
      let description = `Successfully processed ${transactionType} of SYP ${amount} for ${selectedUser.name}`;
      
      if (transactionMethod === 'product' && selectedProductId) {
        const product = products.find(p => p.id === parseInt(selectedProductId, 10));
        if (product) {
          description = `${selectedUser.name} purchased ${product.name} for SYP ${product.price}`;
        }
      }
      
      toast({
        title: "Success",
        description,
      });
      
      // Reset form for product transactions
      if (transactionMethod === 'product') {
        setSelectedProductId('');
      }
      
      // Reset amount for manual transactions
      if (transactionMethod === 'manual') {
        setAmount(0);
      }
    } catch (error) {
      console.error('Error processing transaction:', error);
      toast({
        title: "Error",
        description: "Failed to process transaction",
        variant: "destructive",
      });
    }
  };
  
  // Format currency to SYP format
  const formatCurrency = (value: number) => {
    return `SYP ${value.toLocaleString()}`;
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6 text-nfc-blue">Transactions</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="card-dashboard lg:col-span-2">
          <h2 className="section-title">Process Transaction</h2>
          
          <div className="mb-6">
            <div className="flex space-x-2 mb-4">
              <Button
                variant={transactionMethod === 'manual' ? "default" : "outline"}
                onClick={() => handleTransactionMethodChange('manual')}
                className="flex-1"
              >
                Manual Transaction
              </Button>
              <Button
                variant={transactionMethod === 'product' ? "default" : "outline"}
                onClick={() => handleTransactionMethodChange('product')}
                className="flex-1"
              >
                Purchase Product
              </Button>
            </div>
          </div>
          
          <form onSubmit={handleTransactionSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="user" className="text-sm font-medium">
                  Select User
                </label>
                <Select
                  disabled={isLoading}
                  value={selectedUserId}
                  onValueChange={setSelectedUserId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name} ({user.matricNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {transactionMethod === 'manual' ? (
                <div className="space-y-2">
                  <label htmlFor="transactionType" className="text-sm font-medium">
                    Transaction Type
                  </label>
                  <Select
                    value={transactionType}
                    onValueChange={(value) => setTransactionType(value as 'credit' | 'debit')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit">Credit (Add Funds)</SelectItem>
                      <SelectItem value="debit">Debit (Remove Funds)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="space-y-2">
                  <label htmlFor="product" className="text-sm font-medium">
                    Select Product
                  </label>
                  <Select
                    value={selectedProductId}
                    onValueChange={setSelectedProductId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(product => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          <div className="flex items-center">
                            <span className="mr-2">{product.icon}</span>
                            <span>{product.name} - {formatCurrency(product.price)}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            {transactionMethod === 'manual' && (
              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium">
                  Amount (SYP)
                </label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="1"
                  value={amount || ''}
                  onChange={handleAmountChange}
                  placeholder="0"
                />
              </div>
            )}
            
            <Button 
              type="submit" 
              className={
                transactionType === 'credit' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }
              disabled={!selectedUser || amount <= 0 || (transactionMethod === 'product' && !selectedProductId)}
            >
              {transactionMethod === 'product' ? (
                <>
                  <Package size={16} className="mr-1" />
                  Purchase Product
                </>
              ) : transactionType === 'credit' ? (
                <>
                  <ArrowUpRight size={16} className="mr-1" />
                  Process Credit
                </>
              ) : (
                <>
                  <ArrowDownRight size={16} className="mr-1" />
                  Process Debit
                </>
              )}
            </Button>
          </form>
        </Card>
        
        <Card className="card-dashboard">
          <h2 className="section-title">User Details</h2>
          {selectedUser ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{selectedUser.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Matric Number</p>
                <p className="font-medium">{selectedUser.matricNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Card Number</p>
                <p className="font-medium">{selectedUser.cardNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Balance</p>
                <p className="text-xl font-semibold text-nfc-blue">
                  {formatCurrency(selectedUser.balance)}
                </p>
              </div>
              {amount > 0 && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500">Transaction Preview</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg">
                      {formatCurrency(selectedUser.balance)}
                    </p>
                    <span className="text-gray-500">
                      {transactionType === 'credit' ? '+' : '-'} {formatCurrency(amount)}
                    </span>
                    <span>=</span>
                    <p className={`text-lg font-semibold ${
                      transactionType === 'credit' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {formatCurrency(
                        transactionType === 'credit'
                          ? selectedUser.balance + amount
                          : selectedUser.balance - amount
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-500">
              Select a user to see details
            </div>
          )}
        </Card>
      </div>
      
      {transactionMethod === 'product' && (
        <Card className="card-dashboard mt-6">
          <h2 className="section-title">Available Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {products.map(product => (
              <Card 
                key={product.id} 
                className={`p-4 cursor-pointer transition-all ${
                  selectedProductId === product.id.toString() 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedProductId(product.id.toString())}
              >
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    {React.cloneElement(product.icon, { className: "h-6 w-6 text-blue-600" })}
                  </div>
                  <h3 className="font-medium text-center">{product.name}</h3>
                  <p className="text-blue-600 font-semibold mt-2">{formatCurrency(product.price)}</p>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default Transactions;
