
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Mock data for users
const mockUsers = [
  { id: 1, name: 'John Doe', matricNumber: 'MAT123456', cardNumber: '0xAB12CD34', balance: 2500 },
  { id: 2, name: 'Jane Smith', matricNumber: 'MAT654321', cardNumber: '0x12AB34CD', balance: 1800 },
  { id: 3, name: 'Robert Johnson', matricNumber: 'MAT789012', cardNumber: '0x56EF78GH', balance: 3200 },
  { id: 4, name: 'Emily Davis', matricNumber: 'MAT345678', cardNumber: '0x90IJ12KL', balance: 950 },
  { id: 5, name: 'Michael Brown', matricNumber: 'MAT901234', cardNumber: '0xMN34OP56', balance: 4100 },
];

interface User {
  id: number;
  name: string;
  matricNumber: string;
  cardNumber: string;
  balance: number;
}

const Transactions = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [transactionType, setTransactionType] = useState<'credit' | 'debit'>('credit');
  const [amount, setAmount] = useState<number>(0);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // In a real app, this would fetch users from an API
    const fetchUsers = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, we would set the fetched data here
        setUsers(mockUsers);
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
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setAmount(value);
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user balance locally
      const updatedUsers = users.map(user => {
        if (user.id === selectedUser.id) {
          const newBalance = transactionType === 'credit' 
            ? user.balance + amount 
            : user.balance - amount;
          
          return {
            ...user,
            balance: newBalance,
          };
        }
        return user;
      });
      
      setUsers(updatedUsers);
      
      toast({
        title: "Success",
        description: `Successfully processed ${transactionType} of ₦${amount} for ${selectedUser.name}`,
      });
      
      // Reset form
      setAmount(0);
    } catch (error) {
      console.error('Error processing transaction:', error);
      toast({
        title: "Error",
        description: "Failed to process transaction",
        variant: "destructive",
      });
    }
  };
  
  const formatCurrency = (value: number) => {
    return `₦${value.toLocaleString()}`;
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6 text-nfc-blue">Transactions</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="card-dashboard lg:col-span-2">
          <h2 className="section-title">Process Transaction</h2>
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
            </div>
            
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium">
                Amount (₦)
              </label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={amount || ''}
                onChange={handleAmountChange}
                placeholder="0.00"
              />
            </div>
            
            <Button 
              type="submit" 
              className={
                transactionType === 'credit' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }
              disabled={!selectedUser || amount <= 0}
            >
              {transactionType === 'credit' ? (
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
    </DashboardLayout>
  );
};

export default Transactions;
