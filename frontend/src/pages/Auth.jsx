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
        await signup(formData);
      }
      navigate('/');
    } catch (err) {
      console.error('❌ Auth Error Details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url,
        config: err.config
      });
      setError(err.response?.data?.message || err.message || 'Something went wrong');
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
        <div className="auth-glass relative overflow-hidden">
          {/* Internal Glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          
          <div className="flex justify-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 transform -rotate-6">
              <Heart className="text-white" size={32} fill="white" />
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-4xl font-display font-bold text-foreground mb-3 tracking-tight">
              {isLogin ? 'Welcome Back' : 'Join the Celebration'}
            </h1>
            <p className="text-foreground/50 text-sm font-medium">
              {isLogin ? 'Manage your wedding with elegance.' : 'Step into a world of organized planning.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="signup-name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col"
                >
                  <label className="block text-xs font-black text-primary/80 ml-2 mb-2 uppercase tracking-[0.2em]">Partner Name</label>
                  <div className="relative group">
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col">
              <label className="block text-xs font-black text-primary/80 ml-2 mb-2 uppercase tracking-[0.2em]">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors" size={20} />
                <input
                  type="email"
                  className="input-field pl-14"
                  placeholder="bride_groom@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="block text-xs font-black text-primary/80 ml-2 mb-2 uppercase tracking-[0.2em]">Secret Key</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors" size={20} />
                <input
                  type="password"
                  className="input-field pl-14"
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
                className="bg-red-500/10 text-red-600 p-4 rounded-2xl text-[10px] font-black border border-red-500/20 flex items-center justify-center gap-2 text-center uppercase tracking-widest"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={28} />
              ) : (
                <>
                  <span className="tracking-widest uppercase">{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="group text-foreground/40 hover:text-primary transition-all duration-300 text-xs font-black uppercase tracking-[0.1em]"
            >
              {isLogin ? "New to the Tracker?" : "Already joined?"}{' '}
              <span className="text-primary group-hover:underline underline-offset-4 decoration-2">
                {isLogin ? 'Register Here' : 'Log In Instead'}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
