
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: string | string[];
}

/**
 * AuthGuard component that protects routes based on authentication status and user role
 * @param {React.ReactNode} children - The child components to render if access is granted
 * @param {boolean} requireAuth - If true, the user must be authenticated to access the route
 * @param {string | string[]} requiredRole - If provided, the user must have one of these roles to access
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true,
  requiredRole
}) => {
  const location = useLocation();
  
  // Get authentication status and user role
  const getUserInfo = () => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return { authenticated: false, role: null };
    
    try {
      const user = JSON.parse(currentUser);
      return { 
        authenticated: user.isAuthenticated === true,
        role: user.role
      };
    } catch (error) {
      return { authenticated: false, role: null };
    }
  };
  
  const { authenticated, role } = getUserInfo();
  
  // If route requires auth and user is not authenticated, redirect to login
  if (requireAuth && !authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If route requires specific role and user doesn't have it, redirect based on their role
  if (requireAuth && authenticated && requiredRole) {
    const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    if (!requiredRoles.includes(role as string)) {
      // Redirect to appropriate dashboard based on user's role
      switch (role) {
        case 'admin':
          return <Navigate to="/dashboard" replace />;
        case 'student':
          return <Navigate to="/student-dashboard" replace />;
        default:
          return <Navigate to="/logs" replace />;
      }
    }
  }
  
  // If route is login and user is already authenticated, redirect based on role
  if (!requireAuth && authenticated) {
    // Determine where to redirect based on user role
    switch (role) {
      case 'admin':
        return <Navigate to="/dashboard" replace />;
      case 'student':
        return <Navigate to="/student-dashboard" replace />;
      default:
        return <Navigate to="/logs" replace />;
    }
  }
  
  // If access is granted, render the children
  return <>{children}</>;
};

export default AuthGuard;
