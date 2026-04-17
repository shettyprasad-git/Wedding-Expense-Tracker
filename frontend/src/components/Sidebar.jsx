import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { LayoutDashboard, Heart, Sparkles, Church, Utensils, X, User, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const menuItems = [
    { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { title: 'Engagement', path: '/event/engagement', icon: Heart },
    { title: 'Mehndi', path: '/event/mehndi', icon: Sparkles },
    { title: 'Marriage', path: '/event/marriage', icon: Church },
    { title: 'Dinner', path: '/event/dinner', icon: Utensils },
    { title: 'My Profile', path: '/profile', icon: User },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[60] lg:hidden" 
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed left-0 top-0 h-full w-72 bg-white/40 backdrop-blur-3xl border-r border-white/40 z-[70] transition-transform duration-500 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center group">
              <img 
                src="/branding/navbar_logo.png" 
                alt="Wedding Tracker" 
                className="h-10 w-auto group-hover:scale-105 transition-transform"
              />
            </div>
            <button onClick={onClose} className="lg:hidden p-2 text-primary/40 hover:text-primary transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-3">
            <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 italic mb-6">Ceremony Planning</p>
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                className={({ isActive }) => `
                  flex items-center gap-4 px-6 py-4 rounded-[1.75rem] transition-all duration-300 relative group
                  ${isActive 
                    ? 'bg-primary text-white shadow-2xl shadow-primary/20' 
                    : 'text-primary/60 hover:bg-primary/5 hover:text-primary'
                  }
                `}
              >
                <item.icon size={20} className="relative z-10" />
                <span className="text-xs font-black uppercase tracking-widest relative z-10">{item.title}</span>
                
                {/* Active Indicator */}
                <NavLink to={item.path}>
                    {({ isActive }) => isActive && (
                        <motion.div 
                        layoutId="active-pill"
                        className="absolute inset-0 bg-primary rounded-[1.75rem] -z-0"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                    )}
                </NavLink>
              </NavLink>
            ))}
          </nav>

          {/* Bottom Card */}
          <div className="mt-auto glass-card p-6 bg-primary/5 border-primary/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full translate-x-4 -translate-y-4 group-hover:scale-150 transition-transform duration-700" />
            <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-2 italic leading-tight">Elite Support</p>
            <p className="text-xs font-black text-foreground mb-4">Need help with your wedding budget?</p>
            <button 
              onClick={() => {
                navigate('/support');
                if (window.innerWidth < 1024) onClose();
              }}
              className="w-full py-3 bg-white border border-primary/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all shadow-lg flex items-center justify-center gap-2"
            >
              Contact Experts <HelpCircle size={14} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
