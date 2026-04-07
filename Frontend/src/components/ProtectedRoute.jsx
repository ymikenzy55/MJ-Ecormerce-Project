import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveRedirectPath } from '../utils/redirectAfterAuth';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  if (!isAuthenticated()) {
    // Save the current path for redirect after login
    saveRedirectPath(location.pathname + location.search);
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
