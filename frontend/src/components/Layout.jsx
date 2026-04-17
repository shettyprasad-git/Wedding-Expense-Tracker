import React from 'react';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className="min-h-screen bg-soft-gradient text-foreground relative font-sans overflow-x-hidden selection:bg-primary/20">
      {/* Dynamic Background Flourishes */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] -z-10 -translate-x-1/4 translate-y-1/4" />

      {/* Simplified Global Header (Top-Right Actions) */}
      <div className="fixed top-8 right-8 z-[100] flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-1000">
        {!isDashboard && (
          <div className="hidden sm:flex items-center gap-3 px-5 py-3 bg-white/40 backdrop-blur-3xl border border-white/40 rounded-3xl shadow-2xl">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-black text-xs border border-primary/10">
              <UserIcon size={14} />
            </div>
            <span className="text-xs font-black text-primary uppercase tracking-widest">{user?.name || 'Planner'}</span>
          </div>
        )}
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-3.5 bg-white/60 backdrop-blur-3xl border border-white/40 rounded-3xl shadow-2xl text-primary font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all group active:scale-95"
        >
          <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>

      {/* Main Content Area - Center Aligned Hub Architecture */}
      <main className="relative z-10 w-full min-h-screen pt-24 md:pt-32 pb-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Branded Footer */}
      <footer className="relative z-10 py-12 text-center opacity-30">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Wedding Expense Tracker Premium</p>
      </footer>
    </div>
  );
};

export default Layout;
