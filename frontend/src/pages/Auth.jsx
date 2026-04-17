import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Heart, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Auth = ({ mode }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const isLogin = mode === 'login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-primary-light/20">
      {/* Illustrative Background */}
      <div 
        className="absolute inset-0 bg-wedding-bg bg-cover bg-center z-0 scale-105"
        style={{ filter: 'blur(2px) saturate(1.2)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-secondary/30 z-1" />

      {/* Decorative Floating Elements */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-[15%] text-accent/40 z-1 hidden lg:block"
      >
        <Sparkles size={80} />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-[10%] text-primary/40 z-1 hidden lg:block"
      >
        <Heart size={100} className="fill-current" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-glass w-full max-w-lg p-12 relative z-10 rounded-[3rem]"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/40 mb-6"
          >
            <Heart className="text-white fill-white" size={40} />
          </motion.div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            {isLogin ? 'Welcome Back!' : 'Start Your Journey'}
          </h1>
          <p className="text-foreground/50 mt-3 max-w-[280px] leading-relaxed">
            {isLogin 
              ? 'Login to manage your special day expenses.' 
              : 'Create an account to begin tracking every detail.'}
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl mb-8 text-sm font-medium text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="text"
                placeholder="Full Name"
                className="input-field w-full pl-14 h-14"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          )}

          <div className="relative group">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors" size={20} />
            <input
              type="email"
              placeholder="Email Address"
              className="input-field w-full pl-14 h-14"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors" size={20} />
            <input
              type="password"
              placeholder="Password"
              className="input-field w-full pl-14 h-14"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary h-14 flex items-center justify-center gap-3 mt-6 text-xl font-black disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight size={22} />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center text-foreground/50 font-medium">
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
