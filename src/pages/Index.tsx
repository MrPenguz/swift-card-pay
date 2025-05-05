
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Index component redirects to the login page or dashboard based on authentication status.
 * This component serves as the entry point for the application.
 * 
 * TODO: When implementing database authentication:
 * - Check for existing valid session token
 * - Validate token with backend API
 * - Redirect to dashboard if authenticated or login if not
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
  const currentUser = localStorage.getItem('currentUser');
  
  // TODO: Replace this basic check with proper JWT validation when implementing actual authentication
  if (currentUser) {
    try {
      const user = JSON.parse(currentUser);
      if (user.isAuthenticated) {
        // Redirect admin to dashboard and regular users to their transaction logs
        return <Navigate to={user.role === 'admin' ? '/dashboard' : '/logs'} replace />;
      }
    } catch (error) {
      // If JSON parsing fails, clear the invalid data
      localStorage.removeItem('currentUser');
    }
  }
  
  // Default redirect to login page if not authenticated
  return <Navigate to="/login" replace />;
};

export default Index;
