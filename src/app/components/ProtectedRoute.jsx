import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, isAdmin, isUser } = useAuth();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/Zyndex/Log-In" replace />;
  }

  if (role === 'admin' && !isAdmin) {
    // If admin route but user is not admin, redirect to login
    return <Navigate to="/Zyndex/Log-In" replace />;
  }

  if (role === 'user' && !isUser) {
    // If user route but user is not regular user, redirect to login
    return <Navigate to="/Zyndex/Log-In" replace />;
  }

  return children;
}