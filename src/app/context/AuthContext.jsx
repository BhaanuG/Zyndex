import { createContext, useContext, useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { TransitionLoader } from '@/app/components/PageTransitionWrapper';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Initialize from localStorage if available
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('zyndex_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [role, setRole] = useState(() => {
    const savedRole = localStorage.getItem('zyndex_role');
    return savedRole || null;
  });

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Persist to localStorage whenever user or role changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('zyndex_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('zyndex_user');
    }
  }, [user]);

  useEffect(() => {
    if (role) {
      localStorage.setItem('zyndex_role', role);
    } else {
      localStorage.removeItem('zyndex_role');
    }
  }, [role]);

  const login = (email, password, selectedRole) => {
    // Mock login - in real app would validate against backend
    // Extract name from email for demo purposes
    const name = email.split('@')[0];
    const userData = { name, email };
    setUser(userData);
    setRole(selectedRole);
    return userData; // Return user data immediately
  };

  const logout = () => {
    setIsLoggingOut(true);
    // Wait for 10 seconds before actually logging out
    setTimeout(() => {
      setUser(null);
      setRole(null);
      localStorage.removeItem('zyndex_user');
      localStorage.removeItem('zyndex_role');
      setIsLoggingOut(false);
      // Redirect to login page
      window.location.href = '/Zyndex/User/Log-In';
    }, 10000);
  };

  const register = (name, email, password, selectedRole) => {
    // Mock registration
    const userData = { name, email };
    setUser(userData);
    setRole(selectedRole);
    return userData; // Return user data immediately
  };

  const updateProfile = (updatedData) => {
    // Update user profile data
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    return updatedUser;
  };

  // Helper function to generate URL-safe strings
  const getUrlSafeName = () => {
    return user?.name ? encodeURIComponent(user.name.replace(/\s+/g, '-')) : 'user';
  };

  const getUrlSafeEmail = () => {
    return user?.email ? encodeURIComponent(user.email) : 'email';
  };

  const value = {
    user,
    role,
    login,
    logout,
    register,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: role === 'admin',
    isUser: role === 'user',
    isLoggingOut,
    getUrlSafeName,
    getUrlSafeEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {/* Logout Loader */}
      <AnimatePresence>
        {isLoggingOut && (
          <TransitionLoader 
            duration={10000} 
            message={`Logging out ${user?.name || 'user'}...`} 
          />
        )}
      </AnimatePresence>
    </AuthContext.Provider>
  );
};