import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Heart, Sparkles, Church, Utensils, LogOut, User as UserIcon, Diamond } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Engagement', path: '/engagement', icon: Heart },
    { name: 'Mehndi', path: '/mehndi', icon: Sparkles },
    { name: 'Marriage', path: '/marriage', icon: Church },
    { name: 'Dinner', path: '/dinner', icon: Utensils },
  ];

  return (
    <div className="w-72 h-screen bg-white shadow-2xl fixed left-0 top-0 flex flex-col p-8 z-20 border-r border-primary/5">
      <div className="flex items-center gap-4 mb-12 px-2">
        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30">
          <Diamond className="text-white fill-current" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tighter italic">Wedding Tracker</h1>
          <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] -mt-1">By Prasad</p>
        </div>
      </div>

      <nav className="flex-1 space-y-3">
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => `flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold group ${isActive ? 'bg-primary text-white shadow-xl shadow-primary/20 translate-x-2' : 'text-primary/40 hover:bg-primary-light/20 hover:text-primary hover:translate-x-1'}`}>
            <item.icon size={22} className={({ isActive }) => `${isActive ? 'text-white' : 'text-primary/30 group-hover:text-primary'}`} />
            <span className="text-lg">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-8 border-t border-primary/5">
        <div className="glass-card p-4 flex items-center gap-4 mb-4 bg-primary/5 border-primary/10">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center border border-primary/20 shadow-inner">
             <UserIcon size={24} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-foreground truncate">{user?.name}</p>
            <p className="text-[10px] text-primary/40 font-bold truncate uppercase">{user?.email}</p>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-4 px-6 py-4 w-full rounded-2xl text-red-400 font-black hover:bg-red-50 hover:shadow-lg transition-all duration-300 group">
          <LogOut size={22} className="group-hover:translate-x-1 transition-transform" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
