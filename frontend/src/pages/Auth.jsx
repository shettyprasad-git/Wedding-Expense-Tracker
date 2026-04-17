import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Heart, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.name, formData.email, formData.password);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Wedding Background */}
      <div 
        className="absolute inset-0 bg-wedding-bg bg-cover bg-center z-0 scale-105"
        style={{ filter: 'brightness(0.95) saturate(1.1)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10 z-0 pointer-events-none" />

      {/* Floating Sparkles/Hearts Decor */}
      <motion.div 
        animate={{ y: [0, -20, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-[15%] text-primary/30 z-0 pointer-events-none hidden md:block"
      >
        <Heart size={48} fill="currentColor" stroke="none" />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 20, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 right-[15%] text-secondary/40 z-0 pointer-events-none hidden md:block"
      >
        <Sparkles size={40} />
      </motion.div>

      {/* Auth Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "backOut" }}
        className="w-full max-w-md z-10"
      >
        <div className="auth-glass p-8 md:p-10 rounded-[2.5rem] relative">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 transform -rotate-6">
              <Heart className="text-white" size={32} fill="white" />
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              {isLogin ? 'Welcome Back!' : 'Start Your Journey'}
            </h1>
            <p className="text-foreground/60">
              {isLogin ? 'Login to manage your special day expenses.' : 'Create an account to track your wedding budget.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium text-foreground/70 ml-1">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70 ml-1 font-sans">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={20} />
                <input
                  type="email"
                  className="input-field pl-12"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70 ml-1 font-sans">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={20} />
                <input
                  type="password"
                  className="input-field pl-12"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50/50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100 flex items-center justify-center gap-2"
              >
                {error}
              </motion.div>
            )}
          <p>
            {isLogin ? "New to Wedding Tracker?" : "Already prepared?"}{' '}
            <Link 
              to={isLogin ? '/signup' : '/login'} 
              className="text-primary font-black hover:text-primary-dark transition-colors"
            >
              {isLogin ? 'Sign Up Now' : 'Sign In Here'}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
