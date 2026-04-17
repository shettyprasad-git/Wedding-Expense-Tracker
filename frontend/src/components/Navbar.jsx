import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, LogOut, User as UserIcon, Settings, ChevronDown, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ onMenuClick }) => {
  const { user, logout, notifications } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 right-0 left-0 h-20 bg-white/60 backdrop-blur-3xl border-b border-white/40 z-[50] px-6 flex items-center justify-between">
      {/* Left: Mobile Toggle & Brand */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-primary/10 rounded-xl text-primary transition-all"
        >
          <div className="w-6 h-0.5 bg-current mb-1.5" />
          <div className="w-6 h-0.5 bg-current mb-1.5" />
          <div className="w-4 h-0.5 bg-current" />
        </button>
        
        <Link to="/dashboard" className="flex items-center group">
            <img 
              src="/branding/navbar_logo.png" 
              alt="Wedding Tracker" 
              className="h-14 w-auto group-hover:scale-105 transition-transform"
            />
        </Link>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => { setIsNotifyOpen(!isNotifyOpen); setIsDropdownOpen(false); }}
            className="p-3 text-primary/40 hover:text-primary transition-colors relative"
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute top-3 right-3 w-4 h-4 bg-secondary text-white text-[8px] font-black rounded-full border-2 border-white flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          <AnimatePresence>
            {isNotifyOpen && (
              <>
                <div className="fixed inset-0 z-0" onClick={() => setIsNotifyOpen(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 bg-white/90 backdrop-blur-3xl border border-white/60 rounded-[2rem] shadow-2xl p-6 z-10"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-primary/40 italic">Notifications Hub</h4>
                    <span className="text-[10px] font-black text-secondary uppercase tracking-widest">{notifications.length} New</span>
                  </div>
                  
                  <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="text-center py-10">
                        <Bell size={32} className="mx-auto text-primary/10 mb-2" />
                        <p className="text-[10px] font-black text-primary/30 uppercase tracking-widest">No Alerts Yet</p>
                      </div>
                    ) : (
                      notifications.slice(0, 10).map((n, idx) => (
                        <div key={idx} className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                          <p className="text-xs font-medium text-foreground leading-relaxed">{n.message}</p>
                          <p className="text-[9px] font-black text-primary/40 uppercase tracking-widest mt-2">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <button 
            onClick={() => { setIsDropdownOpen(!isDropdownOpen); setIsNotifyOpen(false); }}
            className="flex items-center gap-3 p-1.5 pr-4 bg-white/40 border border-white/60 rounded-2xl hover:bg-white transition-all group"
          >
            <div className="w-9 h-9 bg-primary/20 rounded-xl overflow-hidden border border-primary/10 flex items-center justify-center">
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="text-primary" size={18} />
              )}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest leading-none mb-1 italic">
                {user?.role === 'admin' ? 'Super Admin' : (user?.weddingRole || 'Planner')}
              </p>
              <p className="text-xs font-black text-foreground tracking-tight leading-none uppercase">{user?.name || 'Guest'}</p>
            </div>
            <ChevronDown size={14} className={`text-primary/40 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-0" onClick={() => setIsDropdownOpen(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-3xl border border-white/60 rounded-[2rem] shadow-2xl p-4 z-10"
                >
                  <div className="space-y-1">
                    {user?.role === 'admin' && (
                       <button 
                         onClick={() => { navigate('/admin/dashboard'); setIsDropdownOpen(false); }}
                         className="w-full flex items-center gap-3 p-4 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-2xl transition-all"
                       >
                         <Settings size={18} />
                         <span className="text-xs font-black uppercase tracking-widest">Admin Portal</span>
                       </button>
                    )}
                    <button 
                      onClick={() => { navigate('/profile'); setIsDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 p-4 hover:bg-primary/10 text-primary rounded-2xl transition-all"
                    >
                      <UserIcon size={18} />
                      <span className="text-xs font-black uppercase tracking-widest">My Profile</span>
                    </button>
                    <button 
                      onClick={() => { navigate('/support'); setIsDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 p-4 hover:bg-primary/10 text-primary rounded-2xl transition-all"
                    >
                      <Heart size={18} className="fill-primary/10" />
                      <span className="text-xs font-black uppercase tracking-widest">Get Support</span>
                    </button>
                    <div className="h-px bg-primary/10 my-2 mx-4" />
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-4 hover:bg-red-500/10 text-red-500 rounded-2xl transition-all"
                    >
                      <LogOut size={18} />
                      <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
