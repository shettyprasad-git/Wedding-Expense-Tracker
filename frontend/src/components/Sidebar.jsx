import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Heart, Sparkles, Church, Utensils, LogOut, User as UserIcon, Diamond, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Engagement', path: '/engagement', icon: Heart },
    { name: 'Mehndi', path: '/mehndi', icon: Sparkles },
    { name: 'Marriage', path: '/marriage', icon: Church },
    { name: 'Dinner', path: '/dinner', icon: Utensils },
  ];

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  return (
    <motion.aside 
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
      className={`w-72 h-screen bg-white shadow-2xl fixed left-0 top-0 flex flex-col p-8 z-50 border-r border-primary/5 lg:translate-x-0 transition-none`}
    >
      <div className="flex items-center justify-between mb-12 px-2">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 rotate-3">
            <Diamond className="text-white fill-current" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black text-foreground tracking-tight italic">Wedding Tracker</h1>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-primary/10 rounded-xl text-primary lg:hidden transition-colors">
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            onClick={() => window.innerWidth < 1024 && onClose()}
            className={({ isActive }) => `flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 font-bold group ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20 translate-x-1' : 'text-primary/40 hover:bg-primary-light/20 hover:text-primary hover:translate-x-1'}`}
          >
            <item.icon size={20} className="transition-transform group-hover:scale-110" />
            <span className="text-md">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-primary/5">
        <div className="bg-primary/5 rounded-2xl p-4 flex items-center gap-3 mb-4 border border-primary/10">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center border border-primary/20">
             <UserIcon size={20} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-foreground truncate">{user?.name}</p>
            <p className="text-[10px] text-primary/40 font-bold truncate uppercase">{user?.email}</p>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-4 px-6 py-3.5 w-full rounded-2xl text-red-500/70 font-black hover:bg-red-50 transition-all duration-300 group">
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
