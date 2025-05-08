import React, { useState, useEffect } from 'react';
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
  requiredRole,
}) => {
  const location = useLocation();
  const [authState, setAuthState] = useState<{
    authenticated: boolean | null;
    role: string | null;
    loading: boolean;
  }>({ authenticated: null, role: null, loading: true });

  // Verify authentication with backend
  const verifyAuth = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setAuthState({ authenticated: false, role: null, loading: false });
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/verify', {
        headers: {
          'x-access-token': token,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // Invalid token - clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        setAuthState({ authenticated: false, role: null, loading: false });
        return;
      }

      // Update current user data if needed
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser || JSON.parse(currentUser).id !== data.user.id) {
        localStorage.setItem('currentUser', JSON.stringify(data.user));
      }

      setAuthState({
        authenticated: data.auth,
        role: data.user.role,
        loading: false,
      });
    } catch (error) {
      console.error('Authentication verification failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      setAuthState({ authenticated: false, role: null, loading: false });
    }
  };

  useEffect(() => {
    verifyAuth();
  }, [location.pathname]); // Re-verify when route changes

  // Show loading state while verifying auth
  if (authState.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nfc-blue"></div>
      </div>
    );
  }

  // If route requires auth and user is not authenticated, redirect to login
  if (requireAuth && !authState.authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route requires specific role and user doesn't have it, redirect based on their role
  if (requireAuth && authState.authenticated && requiredRole) {
    const requiredRoles = Array.isArray(requiredRole)
      ? requiredRole
      : [requiredRole];

    if (!requiredRoles.includes(authState.role as string)) {
      // Redirect to appropriate dashboard based on user's role
      switch (authState.role) {
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
  if (!requireAuth && authState.authenticated) {
    // Determine where to redirect based on user role
    switch (authState.role) {
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
