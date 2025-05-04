
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Search } from 'lucide-react';

// Mock data for initial render
const mockUsers = [
  { id: 1, name: 'John Doe', matricNumber: 'MAT123456', cardNumber: '0xAB12CD34', balance: 2500, createdAt: '2023-05-15' },
  { id: 2, name: 'Jane Smith', matricNumber: 'MAT654321', cardNumber: '0x12AB34CD', balance: 1800, createdAt: '2023-05-20' },
  { id: 3, name: 'Robert Johnson', matricNumber: 'MAT789012', cardNumber: '0x56EF78GH', balance: 3200, createdAt: '2023-06-02' },
  { id: 4, name: 'Emily Davis', matricNumber: 'MAT345678', cardNumber: '0x90IJ12KL', balance: 950, createdAt: '2023-06-10' },
  { id: 5, name: 'Michael Brown', matricNumber: 'MAT901234', cardNumber: '0xMN34OP56', balance: 4100, createdAt: '2023-06-15' },
];

interface User {
  id: number;
  name: string;
  matricNumber: string;
  cardNumber: string;
  balance: number;
  createdAt: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  // Form state for new user
  const [newUser, setNewUser] = useState({
    name: '',
    matricNumber: '',
    cardNumber: '',
    initialBalance: 0,
  });
  
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
  
  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: name === 'initialBalance' ? parseFloat(value) || 0 : value,
    });
  };
  
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!newUser.name || !newUser.matricNumber || !newUser.cardNumber) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call to create a new user
      // For demo, we'll just add to the local state
      const createdUser: User = {
        id: users.length + 1,
        name: newUser.name,
        matricNumber: newUser.matricNumber,
        cardNumber: newUser.cardNumber,
        balance: newUser.initialBalance,
        createdAt: new Date().toISOString().split('T')[0],
      };
      
      setUsers([...users, createdUser]);
      
      // Reset form
      setNewUser({
        name: '',
        matricNumber: '',
        cardNumber: '',
        initialBalance: 0,
      });
      
      toast({
        title: "Success",
        description: "User created successfully",
      });
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    }
  };
  
  const formatCurrency = (value: number) => {
    return `₦${value.toLocaleString()}`;
  };
  
  const filteredUsers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchTermLower) ||
      user.matricNumber.toLowerCase().includes(searchTermLower) ||
      user.cardNumber.toLowerCase().includes(searchTermLower)
    );
  });

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-nfc-blue">User Management</h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-nfc-teal hover:bg-teal-600">
              <Plus size={16} className="mr-1" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={newUser.name}
                  onChange={handleNewUserChange}
                  placeholder="John Doe"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="matricNumber" className="text-sm font-medium">
                  Matric Number
                </label>
                <Input
                  id="matricNumber"
                  name="matricNumber"
                  value={newUser.matricNumber}
                  onChange={handleNewUserChange}
                  placeholder="e.g., MAT123456"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="cardNumber" className="text-sm font-medium">
                  Card Number
                </label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  value={newUser.cardNumber}
                  onChange={handleNewUserChange}
                  placeholder="e.g., 0xAB12CD34"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="initialBalance" className="text-sm font-medium">
                  Initial Balance (₦)
                </label>
                <Input
                  id="initialBalance"
                  name="initialBalance"
                  type="number"
                  value={newUser.initialBalance || ''}
                  onChange={handleNewUserChange}
                  placeholder="0.00"
                />
              </div>
              
              <DialogFooter className="gap-2 sm:gap-0">
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" className="bg-nfc-blue hover:bg-blue-800">Create User</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className="mb-6 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users by name, matric number, or card number..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>
      
      <Card className="card-dashboard">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <>
            <h2 className="section-title">Users ({filteredUsers.length})</h2>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Matric Number</th>
                    <th>Card Number</th>
                    <th>Balance</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>#{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.matricNumber}</td>
                        <td>{user.cardNumber}</td>
                        <td>{formatCurrency(user.balance)}</td>
                        <td>{user.createdAt}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-gray-500">
                        {searchTerm ? "No users match your search" : "No users found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>
    </DashboardLayout>
  );
};

export default Users;
