import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentDashboard from './pages/StudentDashboard';
import Users from './pages/Users';
import Transactions from './pages/Transactions';
import TransactionLogs from './pages/TransactionLogs';
import NotFound from './pages/NotFound';
import AuthGuard from './components/auth/AuthGuard';
import Index from './pages/Index';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Root route */}
            <Route path="/" element={<Index />} />
            {/* Public routes (don't require authentication) */}
            <Route
              path="/login"
              element={
                <AuthGuard requireAuth={false}>
                  <Login />
                </AuthGuard>
              }
            />
            {/* Admin only routes */}
            <Route
              path="/dashboard"
              element={
                <AuthGuard requireAuth={true} requiredRole="admin">
                  <Dashboard />
                </AuthGuard>
              }
            />
            <Route
              path="/users"
              element={
                <AuthGuard requireAuth={true} requiredRole="admin">
                  <Users />
                </AuthGuard>
              }
            />
            <Route
              path="/transactions"
              element={
                <AuthGuard requireAuth={true} requiredRole="admin">
                  <Transactions />
                </AuthGuard>
              }
            />
            {/* Student only routes */}
            <Route
              path="/student-dashboard"
              element={
                <AuthGuard requireAuth={true} requiredRole="student">
                  <StudentDashboard />
                </AuthGuard>
              }
            />
            {/* Shared routes (accessible by all authenticated users) */}
            <Route
              path="/logs"
              element={
                <AuthGuard requireAuth={true} requiredRole={['admin', 'user']}>
                  <TransactionLogs />
                </AuthGuard>
              }
            />
            {/* Catch-all route (404) */}
            <Route
              path="*"
              element={
                <AuthGuard>
                  <NotFound />
                </AuthGuard>
              }
            />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
