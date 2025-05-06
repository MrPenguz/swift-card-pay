
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * AuthGuard component that protects routes based on authentication status
 * @param {React.ReactNode} children - The child components to render if access is granted
 * @param {boolean} requireAuth - If true, the user must be authenticated to access the route
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireAuth = true }) => {
  const location = useLocation();
  
  // Check if user is authenticated by looking for currentUser in localStorage
  const isAuthenticated = () => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return false;
    
    try {
      const user = JSON.parse(currentUser);
      return user.isAuthenticated === true;
    } catch (error) {
      // If there's an error parsing JSON, user is not authenticated
      return false;
    }
  };
  
  const authenticated = isAuthenticated();
  
  // If route requires auth and user is not authenticated, redirect to login
  if (requireAuth && !authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If route is login and user is already authenticated, redirect to dashboard
  if (!requireAuth && authenticated) {
    // Determine where to redirect based on user role
    try {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const redirectPath = user.role === 'admin' ? '/dashboard' : '/logs';
      return <Navigate to={redirectPath} replace />;
    } catch (error) {
      // If there's an error, just redirect to dashboard as fallback
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  // If access is granted, render the children
  return <>{children}</>;
};

export default AuthGuard;
