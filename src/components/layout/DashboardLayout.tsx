
import React, { useState } from 'react';
import { 
  LogOut, 
  Home, 
  Users, 
  CreditCard, 
  Calendar,
  Menu,
  X
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon: Icon, label, isActive }) => (
  <Link 
    to={to} 
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
      isActive ? "bg-nfc-teal text-white font-medium" : "hover:bg-muted"
    )}
  >
    <Icon size={18} />
    <span>{label}</span>
  </Link>
);

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    // In a real application, this would perform actual logout logic
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the system.",
    });
    navigate('/login');
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Mobile menu toggle */}
      <button 
        className="md:hidden fixed top-4 right-4 z-50 bg-white p-2 rounded-md shadow-md"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "w-full md:w-64 bg-white shadow-md md:shadow-none transition-all overflow-y-auto",
          "md:h-screen md:flex md:flex-col md:fixed",
          isMobileMenuOpen ? "fixed inset-0 z-40" : "hidden md:flex"
        )}
      >
        {/* Logo/App name */}
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-nfc-blue flex items-center">
            <CreditCard className="mr-2" /> Swift Card Pay
          </h1>
        </div>
        
        {/* Navigation links */}
        <nav className="mt-6 px-3 flex-1">
          <div className="space-y-1">
            <SidebarLink 
              to="/dashboard" 
              icon={Home} 
              label="Dashboard" 
              isActive={location.pathname === '/dashboard'} 
            />
            <SidebarLink 
              to="/users" 
              icon={Users} 
              label="User Management" 
              isActive={location.pathname === '/users'} 
            />
            <SidebarLink 
              to="/transactions" 
              icon={CreditCard} 
              label="Transactions" 
              isActive={location.pathname === '/transactions'} 
            />
            <SidebarLink 
              to="/logs" 
              icon={Calendar} 
              label="Transaction Logs" 
              isActive={location.pathname === '/logs'} 
            />
          </div>
        </nav>
        
        {/* Logout button */}
        <div className="p-4 border-t">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 md:ml-64 p-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
