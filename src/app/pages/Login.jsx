import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Mail, Lock, User, ArrowRight, Menu, X, Eye, EyeOff, Shield } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState('user');
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Update URL when activeTab or isLogin changes
  useEffect(() => {
    const path = location.pathname;
    
    // Determine the correct route based on activeTab and isLogin
    let targetPath;
    if (activeTab === 'user') {
      if (isLogin) {
        targetPath = '/Zyndex/User/Log-In';
      } else {
        targetPath = '/Zyndex/User/Sign-Up';
      }
    } else { // admin
      if (isLogin) {
        targetPath = '/Zyndex/Admin/Log-In';
      } else {
        // For admin signup, navigate to the admin request page
        targetPath = '/Zyndex/Admin/Sign-Up';
      }
    }
    
    // Only navigate if the current path is different and it's a login-related path
    if (path !== targetPath && (
      path.includes('/Log-In') || 
      path.includes('/Sign-In') || 
      path.includes('/Sign-Up') ||
      path === '/Zyndex/User/Log-In' ||
      path === '/Zyndex/Admin/Log-In'
    )) {
      navigate(targetPath, { replace: true });
    }
  }, [activeTab, isLogin, navigate, location.pathname]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // If admin wants to sign up, redirect to admin request page
    if (activeTab === 'admin' && !isLogin) {
      navigate('/Zyndex/Admin/Sign-Up');
      return;
    }
    
    sessionStorage.setItem('pending_auth', JSON.stringify({
      name,
      email,
      password,
      role: activeTab,
      isLogin
    }));
    
    if (activeTab === 'admin') {
      navigate('/Zyndex/Admin/authenticator-page');
    } else {
      navigate('/Zyndex/User/authenticator-page');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] bg-[size:32px_32px]" />
        
        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-red-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Header */}
      <motion.header 
        className="relative z-10 py-6 px-8 backdrop-blur-sm border-b border-orange-200/50 depth-3d-elevated glass-3d"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-orange-600/20 rounded-xl blur-xl" />
              <div className="relative bg-gradient-to-br from-orange-600 to-red-600 p-2.5 rounded-xl shadow-lg">
                <BookOpen className="size-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Zyndex
              </h1>
              <p className="text-xs text-slate-500 font-medium">Educational Excellence</p>
            </div>
          </motion.div>

          <nav className="hidden lg:flex items-center gap-1 flex-wrap">
            <Link to="/Zyndex/About/About-Us" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
              About Us
            </Link>
            <Link to="/Zyndex/About/Contact" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
              Contact
            </Link>
            <span className="text-slate-300">|</span>
            <Link to="/Zyndex/Resources/Browse" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
              Browse
            </Link>
            <Link to="/Zyndex/Resources/Categories" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
              Categories
            </Link>
            <span className="text-slate-300">|</span>
            <Link to="/Zyndex/Support/Help-Center" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
              Help Center
            </Link>
            <Link to="/Zyndex/Support/FAQ" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
              FAQ
            </Link>
            <span className="text-slate-300">|</span>
            <Link to="/Zyndex/Legal/Privacy" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
              Privacy
            </Link>
            <Link to="/Zyndex/Legal/Terms" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
              Terms
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 hover:bg-orange-50 rounded-lg transition-colors"
          >
            {showMobileMenu ? <X className="size-6 text-slate-600" /> : <Menu className="size-6 text-slate-600" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-orange-200/50 overflow-hidden"
            >
              <nav className="py-4 px-2 space-y-1">
                <Link to="/Zyndex/About/About-Us" className="block px-3 py-2 text-sm font-medium text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
                  About Us
                </Link>
                <Link to="/Zyndex/About/Contact" className="block px-3 py-2 text-sm font-medium text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
                  Contact
                </Link>
                <Link to="/Zyndex/Resources/Browse" className="block px-3 py-2 text-sm font-medium text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
                  Browse
                </Link>
                <Link to="/Zyndex/Resources/Categories" className="block px-3 py-2 text-sm font-medium text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
                  Categories
                </Link>
                <Link to="/Zyndex/Support/Help-Center" className="block px-3 py-2 text-sm font-medium text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
                  Help Center
                </Link>
                <Link to="/Zyndex/Support/FAQ" className="block px-3 py-2 text-sm font-medium text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
                  FAQ
                </Link>
                <Link to="/Zyndex/Legal/Privacy" className="block px-3 py-2 text-sm font-medium text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
                  Privacy
                </Link>
                <Link to="/Zyndex/Legal/Terms" className="block px-3 py-2 text-sm font-medium text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
                  Terms
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-200px)]">
          {/* Left Side - Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-slate-900">Unlock the Power of</span>
                <br />
                <span className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 bg-clip-text text-transparent">
                  Shared Knowledge
                </span>
              </h1>

              <p className="text-xl text-slate-600 leading-relaxed">
                Access a curated library of educational resources, connect with fellow educators, and transform your teaching experience.
              </p>
            </div>
          </motion.div>

          {/* Right Side - Auth Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl blur-3xl opacity-10" />
            
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-200/50 p-8 lg:p-10 depth-3d-float glass-3d surface-highlight">
              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  {isLogin ? 'Welcome Back' : 'Get Started'}
                </h2>
                <p className="text-slate-600">
                  {isLogin ? 'Enter your credentials to continue' : 'Create your account to begin'}
                </p>
              </motion.div>

              {/* Role Tabs */}
              <div className="relative mb-8 p-1 bg-slate-100 rounded-2xl">
                <motion.div
                  className={`absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-xl shadow-md ${
                    activeTab === 'user' 
                      ? 'bg-gradient-to-br from-orange-500 to-red-600' 
                      : 'bg-gradient-to-br from-blue-600 to-indigo-600'
                  }`}
                  animate={{
                    x: activeTab === 'user' ? '0.25rem' : 'calc(100% + 0.25rem)'
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 35
                  }}
                />
                <div className="relative flex gap-2">
                  <button
                    onClick={() => setActiveTab('user')}
                    className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-colors duration-200 z-10 flex items-center justify-center gap-2 ${
                      activeTab === 'user'
                        ? 'text-white'
                        : 'text-slate-600'
                    }`}
                  >
                    <User className="size-4" />
                    User Access
                  </button>
                  <button
                    onClick={() => setActiveTab('admin')}
                    className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-colors duration-200 z-10 flex items-center justify-center gap-2 ${
                      activeTab === 'admin'
                        ? 'text-white'
                        : 'text-slate-600'
                    }`}
                  >
                    <Shield className="size-4" />
                    Admin Access
                  </button>
                </div>
              </div>

              {/* Form */}
              <AnimatePresence mode="wait">
                <motion.form
                  key={`${activeTab}-${isLogin}`}
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {/* Name Field */}
                  <AnimatePresence>
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Full Name
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl opacity-0 group-focus-within:opacity-10 blur transition-opacity" />
                          <div className="relative flex items-center">
                            <User className="absolute left-4 size-5 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Enter your full name"
                              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-600 focus:ring-4 focus:ring-orange-600/10 outline-none transition-all depth-3d-input"
                              required
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl opacity-0 group-focus-within:opacity-10 blur transition-opacity" />
                      <div className="relative flex items-center">
                        <Mail className="absolute left-4 size-5 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          pattern="[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}"
                          title="Email must contain @ and a domain (e.g., .com, .org)"
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-600 focus:ring-4 focus:ring-orange-600/10 outline-none transition-all depth-3d-input"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl opacity-0 group-focus-within:opacity-10 blur transition-opacity" />
                      <div className="relative flex items-center">
                        <Lock className="absolute left-4 size-5 text-slate-400 group-focus-within:text-orange-600 transition-colors z-10" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-orange-600 focus:ring-4 focus:ring-orange-600/10 outline-none transition-all depth-3d-input"
                          required
                        />
                        <motion.button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 p-1 text-slate-400 hover:text-orange-600 transition-colors z-10"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    className="w-full relative group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                    <div className="relative flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-600/30">
                      {isLogin ? 'Sign In' : 'Create Account'}
                      <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.button>

                  {/* Toggle Login/Register */}
                  {activeTab === 'user' && (
                    <div className="text-center pt-4">
                      <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm text-slate-600 hover:text-orange-600 font-medium transition-colors"
                      >
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span className="text-orange-600 font-semibold">
                          {isLogin ? 'Sign Up' : 'Sign In'}
                        </span>
                      </button>
                      {/* Forgot Password Link */}
                      {isLogin && (
                        <div className="mt-3">
                          <Link
                            to="/Zyndex/Auth/Forgot-Password"
                            className="text-sm text-slate-500 hover:text-orange-600 font-medium transition-colors"
                          >
                            Reset or Forgot your password?
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Admin Request Link */}
                  {activeTab === 'admin' && (
                    <div className="space-y-3 pt-4">
                      {isLogin && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center"
                        >
                          <Link
                            to="/Zyndex/Admin/Sign-Up"
                            className="text-sm text-slate-600 hover:text-orange-600 font-medium transition-colors"
                          >
                            Need admin access? <span className="text-orange-600 font-semibold">Request Here</span>
                          </Link>
                          {/* Forgot Password Link for Admin */}
                          <div className="mt-3">
                            <Link
                              to="/Zyndex/Auth/Forgot-Password"
                              className="text-sm text-slate-500 hover:text-orange-600 font-medium transition-colors"
                            >
                              Reset or Forgot your password?
                            </Link>
                          </div>
                        </motion.div>
                      )}
                      {!isLogin && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center"
                        >
                          <button
                            type="button"
                            onClick={() => setIsLogin(true)}
                            className="text-sm text-slate-600 hover:text-orange-600 font-medium transition-colors"
                          >
                            Already have admin access? <span className="text-orange-600 font-semibold">Sign In</span>
                          </button>
                        </motion.div>
                      )}
                    </div>
                  )}
                </motion.form>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-orange-200/50 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-slate-600">
              © 2026 Zyndex. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/Zyndex/Legal/Privacy" className="text-sm text-slate-600 hover:text-orange-600 transition-colors">
                Privacy
              </Link>
              <Link to="/Zyndex/Legal/Terms" className="text-sm text-slate-600 hover:text-orange-600 transition-colors">
                Terms
              </Link>
              <Link to="/Zyndex/Support/FAQ" className="text-sm text-slate-600 hover:text-orange-600 transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}