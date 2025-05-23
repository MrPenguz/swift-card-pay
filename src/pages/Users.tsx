
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// TODO: Replace this mock data with actual database fetching when DB is implemented
// Mock data for initial render - will only be used if localStorage is empty
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
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  // Form state for new user
  const [newUser, setNewUser] = useState({
    name: '',
    matricNumber: '',
    cardNumber: '', // TODO: Integrate with RFID reader to populate this field automatically
    initialBalance: 0,
    password: '', // Added for user login capabilities
  });
  
  useEffect(() => {
    // TODO: Replace with API call to your database when implemented
    // Load users from localStorage or use mock data if not available
    const fetchUsers = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // TODO: Replace with actual API call to your database
        const storedUsers = localStorage.getItem('appUsers');
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers));
        } else {
          // Initialize with mock data if localStorage is empty
          setUsers(mockUsers);
          // Save mock data to localStorage for first-time initialization
          localStorage.setItem('appUsers', JSON.stringify(mockUsers));
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: t.failedToLoadUsers,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [toast, t]);
  
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
        title: t.validationError,
        description: t.pleaseFillAllFields,
        variant: "destructive",
      });
      return;
    }
    
    try {
      // TODO: Replace with actual API call to create user in your database
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new user
      const createdUser: User = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1, // Generate a unique ID
        name: newUser.name,
        matricNumber: newUser.matricNumber,
        cardNumber: newUser.cardNumber, // TODO: In production, this will come from RFID reader
        balance: newUser.initialBalance,
        createdAt: new Date().toISOString().split('T')[0],
      };
      
      // Update state and localStorage
      // TODO: Replace localStorage with database updates
      const updatedUsers = [...users, createdUser];
      setUsers(updatedUsers);
      localStorage.setItem('appUsers', JSON.stringify(updatedUsers));
      
      // Reset form
      setNewUser({
        name: '',
        matricNumber: '',
        cardNumber: '',
        initialBalance: 0,
        password: '',
      });
      
      toast({
        title: t.transactionSuccess,
        description: t.userCreatedSuccess,
      });
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: t.failedToCreateUser,
        variant: "destructive",
      });
    }
  };
  
  const formatCurrency = (value: number) => {
    return `SYP ${value.toLocaleString()}`;
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
        <h1 className="text-3xl font-bold text-nfc-blue">{t.userManagement}</h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-nfc-teal hover:bg-teal-600">
              <Plus size={16} className="mr-1" /> {t.addUser}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t.createNewUser}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  {t.fullName}
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
                  {t.matricNumber}
                </label>
                <Input
                  id="matricNumber"
                  name="matricNumber"
                  value={newUser.matricNumber}
                  onChange={handleNewUserChange}
                  placeholder="e.g., MAT123456"
                />
              </div>
              
              {/* TODO: In production, integrate with RFID reader to automatically populate this field */}
              <div className="space-y-2">
                <label htmlFor="cardNumber" className="text-sm font-medium">
                  {t.cardNumber}
                </label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  value={newUser.cardNumber}
                  onChange={handleNewUserChange}
                  placeholder="e.g., 0xAB12CD34"
                />
              </div>
              
              {/* Added password field for user login */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  {t.password}
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={newUser.password}
                  onChange={handleNewUserChange}
                  placeholder="Set user password"
                />
                <p className="text-xs text-gray-500">
                  {t.passwordNote}
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="initialBalance" className="text-sm font-medium">
                  {t.initialBalance}
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
                  <Button type="button" variant="outline">{t.cancel}</Button>
                </DialogClose>
                <Button type="submit" className="bg-nfc-blue hover:bg-blue-800">{t.save}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className="mb-6 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder={`${t.search}...`}
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
            <h2 className="section-title">{t.users} ({filteredUsers.length})</h2>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t.id}</th>
                    <th>{t.name}</th>
                    <th>{t.matricNumber}</th>
                    <th>{t.cardNumber}</th>
                    <th>{t.balance}</th>
                    <th>{t.date}</th>
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
                        {searchTerm ? t.noUsersMatchSearch : t.noUsersFound}
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
