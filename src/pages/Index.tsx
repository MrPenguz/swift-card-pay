
import { Navigate } from 'react-router-dom';

/**
 * Index component redirects to the login page.
 * This component serves as the entry point for the application.
 * 
 * TODO: When implementing database authentication, 
 * this could be adjusted to check for existing sessions
 * and redirect to dashboard if authenticated.
 */
const Index = () => {
  return <Navigate to="/login" replace />;
};

export default Index;
