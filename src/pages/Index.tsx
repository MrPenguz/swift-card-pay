
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Index component redirects based on authentication status.
 * This component serves as the entry point for the application.
 */
const Index = () => {
  // Set up language preferences if not already set
  useEffect(() => {
    // Initialize language preference if not set
    if (!localStorage.getItem('preferredLanguage')) {
      localStorage.setItem('preferredLanguage', 'en');
    }
    
    // Apply RTL/LTR direction based on saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage');
    document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
  }, []);

  // Check if user is already authenticated
  const isAuthenticated = () => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return false;
    
    try {
      const user = JSON.parse(currentUser);
      return user.isAuthenticated === true;
    } catch (error) {
      return false;
    }
  };
  
  // Determine where to redirect based on authentication status
  if (isAuthenticated()) {
    try {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      // Redirect admin to dashboard and regular users to their transaction logs
      return <Navigate to={user.role === 'admin' ? '/dashboard' : '/logs'} replace />;
    } catch (error) {
      // If JSON parsing fails, redirect to login
      return <Navigate to="/login" replace />;
    }
  }
  
  // Default redirect to login page if not authenticated
  return <Navigate to="/login" replace />;
};

export default Index;
