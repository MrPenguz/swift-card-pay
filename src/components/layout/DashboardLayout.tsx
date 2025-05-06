import React, { useState, useEffect } from 'react';
import { 
  LogOut, 
  Home, 
  Users, 
  CreditCard, 
  Calendar,
  Menu,
  X,
  Languages
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const [userRole, setUserRole] = useState<string>('');
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Get user role from localStorage
    try {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const user = JSON.parse(currentUser);
        setUserRole(user.role || 'user');
      }
    } catch (error) {
      console.error('Error getting user role:', error);
    }
  }, []);
  
  const handleLanguageToggle = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };
  
  const handleLogout = () => {
    // Remove user data from localStorage to log out
    localStorage.removeItem('currentUser');
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the system.",
    });
    
    // Redirect to login page after logout
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
        
        {/* Navigation links based on user role */}
        <nav className="mt-6 px-3 flex-1">
          <div className="space-y-1">
            {userRole === 'admin' && (
              <>
                <SidebarLink 
                  to="/dashboard" 
                  icon={Home} 
                  label={t.dashboard}
                  isActive={location.pathname === '/dashboard'} 
                />
                <SidebarLink 
                  to="/users" 
                  icon={Users} 
                  label={t.users}
                  isActive={location.pathname === '/users'} 
                />
                <SidebarLink 
                  to="/transactions" 
                  icon={CreditCard} 
                  label={t.transactions} 
                  isActive={location.pathname === '/transactions'} 
                />
                <SidebarLink 
                  to="/logs" 
                  icon={Calendar} 
                  label={t.logs} 
                  isActive={location.pathname === '/logs'} 
                />
              </>
            )}
            
            {userRole === 'student' && (
              <SidebarLink 
                to="/student-dashboard" 
                icon={Home} 
                label={t.dashboard}
                isActive={location.pathname === '/student-dashboard'} 
              />
            )}
            
            {userRole === 'user' && (
              <SidebarLink 
                to="/logs" 
                icon={Calendar} 
                label={t.logs} 
                isActive={location.pathname === '/logs'} 
              />
            )}
          </div>
        </nav>
        
        {/* Language toggle - improved styling for consistency across languages */}
        <div className="p-4 border-t border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Languages size={18} />
              <Label htmlFor="dashboard-language-toggle" className="text-sm whitespace-nowrap">
                {language === 'en' ? t.english : t.arabic}
              </Label>
            </div>
            <Switch
              id="dashboard-language-toggle"
              checked={language === 'ar'}
              onCheckedChange={handleLanguageToggle}
            />
          </div>
        </div>
        
        {/* Logout button */}
        <div className="p-4">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <LogOut size={18} />
            <span>{t.logout}</span>
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
