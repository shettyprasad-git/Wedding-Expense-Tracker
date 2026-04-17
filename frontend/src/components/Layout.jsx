import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu, X, LogOut } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-soft-gradient text-foreground relative font-sans">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Header Actions (Top Right) */}
      <div className="fixed top-6 right-6 z-30 flex items-center gap-4">
        {/* User Badge - Hidden on small mobile */}
        <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white/40 backdrop-blur-md border border-white/40 rounded-2xl shadow-sm">
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-black text-xs">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <span className="text-sm font-bold text-foreground/70">{user?.name || 'User'}</span>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/40 backdrop-blur-md border border-white/40 rounded-2xl shadow-lg text-primary font-black hover:bg-white transition-all group active:scale-95"
          title="Sign Out"
        >
          <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>

      {/* Hamburger Toggle (Mobile Only) */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-6 left-6 z-30 p-3 bg-white/80 border border-primary/10 rounded-2xl shadow-lg lg:hidden text-primary hover:bg-white transition-all"
      >
        <Menu size={24} />
      </button>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 w-full lg:pl-72 p-6 md:p-12 relative min-h-screen max-w-full overflow-x-hidden">
        {/* Subtle background flourishes */}
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/5 rounded-full blur-[80px] md:blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[200px] md:w-[300px] h-[200px] md:h-[300px] bg-secondary/5 rounded-full blur-[60px] md:blur-[80px] -z-10 -translate-x-1/3 translate-y-1/3" />
        
        <div className="max-w-7xl mx-auto relative z-10 pt-16 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
