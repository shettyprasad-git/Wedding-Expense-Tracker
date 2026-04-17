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
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div 
        className="absolute inset-0 bg-wedding-bg bg-cover bg-center z-0 scale-105"
        style={{ filter: 'brightness(0.9) saturate(1.1)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10 z-0 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "backOut" }}
        className="w-full max-w-md z-10"
      >
        <div className="auth-glass relative overflow-hidden p-8 md:p-12">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          
          <div className="flex justify-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
              <Heart className="text-white" size={28} fill="white" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-foreground mb-2 tracking-tight uppercase">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </h1>
            <p className="text-foreground/40 text-[10px] font-black uppercase tracking-widest italic">
              {isLogin ? 'Manage your wedding budget' : 'Start your wedding planning'}
            </p>
          </div>

          {/* Spacing Fix: Using space-y-4 for the form container */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="signup-name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1.5"
                >
                  <label className="block text-[10px] font-black text-primary/70 ml-2 uppercase tracking-[0.2em]">Partner Name</label>
                  <div className="relative group">
                    <input
                      type="text"
                      className="input-field w-full p-4 mt-1"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-primary/70 ml-2 uppercase tracking-[0.2em]">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="email"
                  className="input-field w-full pl-14 p-4 mt-1"
                  placeholder="bride_groom@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-primary/70 ml-2 uppercase tracking-[0.2em]">Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="password"
                  className="input-field w-full pl-14 p-4 mt-1"
                  placeholder="Enter secret key"
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
                className="bg-red-500/10 text-red-600 p-4 rounded-2xl text-[10px] font-black border border-red-500/20 text-center uppercase tracking-widest italic"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full p-4 mt-4"
            >
              {isLoading ? (
                <Loader2 className="animate-spin mx-auto" size={24} />
              ) : (
                <span className="tracking-widest uppercase font-black">{isLogin ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="group text-foreground/40 hover:text-primary transition-all duration-300 text-[10px] font-black uppercase tracking-[0.2em]"
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
