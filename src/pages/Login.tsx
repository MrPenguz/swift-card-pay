
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { CreditCard, Lock } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Username and password are required",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // In a real application, this would be an API call to authenticate
    // For demo purposes, we'll simulate a successful login with admin/admin
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (username === 'admin' && password === 'admin') {
        toast({
          title: "Login successful",
          description: "Welcome to Swift Card Pay",
        });
        // In a real app, we would store auth token here
        navigate('/dashboard');
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <CreditCard className="h-12 w-12 text-nfc-blue" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-nfc-blue">Swift Card Pay</h1>
          <p className="mt-2 text-gray-500">NFC Card Payment System</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <div className="relative">
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
                placeholder="Enter your username"
                disabled={isLoading}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <Lock size={16} />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <Lock size={16} />
              </div>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-nfc-blue hover:bg-blue-800" 
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Demo credentials: admin / admin</p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
