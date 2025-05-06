
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Transactions from "./pages/Transactions";
import TransactionLogs from "./pages/TransactionLogs";
import NotFound from "./pages/NotFound";
import AuthGuard from "./components/auth/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes (don't require authentication) */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route 
              path="/login" 
              element={
                <AuthGuard requireAuth={false}>
                  <Login />
                </AuthGuard>
              } 
            />
            
            {/* Protected routes (require authentication) */}
            <Route 
              path="/dashboard" 
              element={
                <AuthGuard>
                  <Dashboard />
                </AuthGuard>
              } 
            />
            <Route 
              path="/users" 
              element={
                <AuthGuard>
                  <Users />
                </AuthGuard>
              } 
            />
            <Route 
              path="/transactions" 
              element={
                <AuthGuard>
                  <Transactions />
                </AuthGuard>
              } 
            />
            <Route 
              path="/logs" 
              element={
                <AuthGuard>
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
