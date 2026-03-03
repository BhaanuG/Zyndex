import { useNavigate } from 'react-router';
import { useAuth } from '@/app/context/AuthContext';
import Authenticator from '@/app/components/Authenticator';
import { useEffect } from 'react';

export default function AdminAuthenticator() {
  const navigate = useNavigate();
  const { login, register, getUrlSafeName, getUrlSafeEmail } = useAuth();

  // Check if there's pending authentication
  useEffect(() => {
    const pendingAuth = sessionStorage.getItem('pending_auth');
    if (!pendingAuth) {
      // No pending auth, redirect to login
      navigate('/');
    }
  }, [navigate]);

  const handleAuthSuccess = () => {
    const pendingAuth = sessionStorage.getItem('pending_auth');
    if (!pendingAuth) {
      navigate('/');
      return;
    }

    const authData = JSON.parse(pendingAuth);
    
    // Now perform actual login/registration after successful verification
    let userData;
    if (authData.isLogin) {
      userData = login(authData.email, authData.password, authData.role);
    } else {
      userData = register(authData.name, authData.email, authData.password, authData.role);
    }

    // Clear pending auth
    sessionStorage.removeItem('pending_auth');

    // Set flag to trigger book animation on dashboard entry
    sessionStorage.setItem('show_auth_transition', 'true');

    // If registering as admin, go to admin request page
    if (!authData.isLogin) {
      navigate('/admin-request');
    } else {
      // Navigate to admin dashboard with dynamic URL using the returned userData
      const adminName = encodeURIComponent(userData.name.replace(/\s+/g, '-'));
      const adminEmail = encodeURIComponent(userData.email);
      navigate(`/Zyndex/Admin/${adminName}/${adminEmail}/Dashboard`);
    }
  };

  const handleAuthBack = () => {
    // Clear pending auth and go back to login
    sessionStorage.removeItem('pending_auth');
    navigate('/Zyndex/Admin/Log-In');
  };

  return <Authenticator onSuccess={handleAuthSuccess} onBack={handleAuthBack} />;
}