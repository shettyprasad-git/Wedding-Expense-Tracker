import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Heart, ArrowRight, Loader2, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Auth = ({ mode }) => {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  
  React.useEffect(() => {
    setIsLogin(mode === 'login');
  }, [mode]);

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
      navigate('/dashboard'); // Correct route based on latest overhaul
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden font-sans bg-soft-gradient">
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 bg-wedding-bg bg-cover bg-center z-0 scale-105"
        style={{ filter: 'brightness(0.9) saturate(1.1)' }}
      />
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] z-0" />
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/10 z-0 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg z-10"
      >
        <div className="auth-glass relative overflow-hidden p-10 md:p-14 border-white/60 shadow-[0_32px_120px_-15px_rgba(45,27,77,0.3)]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          
          <div className="flex justify-center mb-10">
            <img 
              src="/branding/auth_logo.png" 
              alt="Wedding Tracker Logo" 
              className="h-24 w-auto drop-shadow-2xl"
            />
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-foreground mb-3 tracking-tighter uppercase italic">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </h1>
            <p className="text-primary/60 text-[10px] font-black uppercase tracking-[0.3em] italic">
              {isLogin ? 'Manage your wedding investment' : 'Start your wedding planning'}
            </p>
          </div>

          {/* REBUILT FORM: Explicit Flex Column with forced gaps */}
          <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  key="signup-name"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col gap-2"
                >
                  <label className="text-[11px] font-black text-primary px-1 uppercase tracking-[0.2em] italic">Partner / Planner Name</label>
                  <input
                    type="text"
                    className="input-field w-full bg-white/50 border-white/60 focus:bg-white px-5 py-4"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required={!isLogin}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-black text-primary px-1 uppercase tracking-[0.2em] italic">Email Address</label>
              <input
                type="email"
                className="input-field w-full bg-white/50 border-white/60 focus:bg-white px-5 py-4"
                placeholder="bride_groom@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-black text-primary px-1 uppercase tracking-[0.2em] italic">Secret Key / Password</label>
              <input
                type="password"
                className="input-field w-full bg-white/50 border-white/60 focus:bg-white px-5 py-4"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-500/10 text-red-600 p-5 rounded-3xl text-[10px] font-black border border-red-500/20 text-center uppercase tracking-widest italic shadow-inner"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-5 rounded-[2rem] shadow-2xl shadow-primary/30 mt-4 h-16 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              {isLoading ? (
                <Loader2 className="animate-spin mx-auto text-white" size={28} />
              ) : (
                <span className="relative z-10 tracking-[0.3em] ml-1 uppercase font-black text-sm">
                  {isLogin ? 'Sign In Center' : 'Create Account'}
                </span>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="group text-foreground/40 hover:text-primary transition-all duration-300 text-[10px] font-black uppercase tracking-[0.2em] italic"
            >
              {isLogin ? "New to the hub?" : "Already a planner?"}{' '}
              <span className="text-primary group-hover:underline underline-offset-8 decoration-2 ml-1">
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
