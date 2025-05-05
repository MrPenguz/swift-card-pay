
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { CreditCard, Lock, Languages } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';

// Login page specific translations
const loginTranslations = {
  en: {
    title: 'Swift Card Pay',
    subtitle: 'NFC Card Payment System',
    username: 'Username',
    password: 'Password',
    loginButton: 'Login',
    loggingIn: 'Logging in...',
    demoCredentials: 'Demo credentials: admin / admin',
    errorRequired: 'Username and password are required',
    loginSuccess: 'Login successful',
    welcomeMessage: 'Welcome to Swift Card Pay',
    loginFailed: 'Login failed',
    invalidCredentials: 'Invalid username or password',
    loginError: 'Login error',
    unexpectedError: 'An unexpected error occurred',
  },
  ar: {
    title: 'سويفت كارد باي',
    subtitle: 'نظام الدفع ببطاقة NFC',
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    loginButton: 'تسجيل الدخول',
    loggingIn: 'جاري تسجيل الدخول...',
    demoCredentials: 'بيانات تجريبية: admin / admin',
    errorRequired: 'اسم المستخدم وكلمة المرور مطلوبان',
    loginSuccess: 'تم تسجيل الدخول بنجاح',
    welcomeMessage: 'مرحبًا بك في سويفت كارد باي',
    loginFailed: 'فشل تسجيل الدخول',
    invalidCredentials: 'اسم المستخدم أو كلمة المرور غير صالحة',
    loginError: 'خطأ في تسجيل الدخول',
    unexpectedError: 'حدث خطأ غير متوقع',
  }
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { language, setLanguage, t: globalT } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Get login-specific translations + global translations
  const t = { ...globalT, ...loginTranslations[language] };

  const handleLanguageToggle = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!username || !password) {
      toast({
        title: "Error",
        description: t.errorRequired,
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (username === 'admin' && password === 'admin') {
        toast({
          title: t.loginSuccess,
          description: t.welcomeMessage,
        });
        localStorage.setItem('currentUser', JSON.stringify({ 
          username: 'admin', 
          role: 'admin',
          isAuthenticated: true 
        }));
        navigate('/dashboard');
      } else {
        // Check if this is a regular user login
        const users = JSON.parse(localStorage.getItem('appUsers') || '[]');
        const user = users.find((u: any) => u.matricNumber === username && username === password);
        
        if (user) {
          toast({
            title: t.loginSuccess,
            description: t.welcomeMessage,
          });
          localStorage.setItem('currentUser', JSON.stringify({ 
            username: user.matricNumber,
            name: user.name,
            userId: user.id,
            role: 'user',
            isAuthenticated: true 
          }));
          navigate('/logs');
        } else {
          toast({
            title: t.loginFailed,
            description: t.invalidCredentials,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: t.loginError,
        description: t.unexpectedError,
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
          <h1 className="mt-4 text-2xl font-bold text-nfc-blue">{t.title}</h1>
          <p className="mt-2 text-gray-500">{t.subtitle}</p>
          
          {/* Language toggle switch - fixed styling */}
          <div className="absolute top-4 right-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="language-toggle" className="text-sm whitespace-nowrap">
                {language === 'en' ? t.english : t.arabic}
              </Label>
              <Switch
                id="language-toggle"
                checked={language === 'ar'}
                onCheckedChange={handleLanguageToggle}
              />
              <Languages className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              {t.username}
            </label>
            <div className="relative">
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
                placeholder={t.username}
                disabled={isLoading}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <Lock size={16} />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              {t.password}
            </label>
            <div className="relative">
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                placeholder={t.password}
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
            {isLoading ? t.loggingIn : t.loginButton}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>{t.demoCredentials}</p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
