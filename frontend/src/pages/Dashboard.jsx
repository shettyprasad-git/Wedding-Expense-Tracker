import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import { 
  Heart, Sparkles, Church, Utensils, 
  TrendingUp, IndianRupee, PieChart, 
  ChevronRight, Calendar, ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { totals } = useExpense();
  const { user } = useAuth();
  const navigate = useNavigate();

  const grandTotal = totals.GrandTotal || 0;
  const totalBudget = user?.budgets?.GrandTotal || 
    (user?.budgets ? Object.values(user.budgets).reduce((a, b) => (typeof b === 'number' ? a + b : a), 0) : 0);

  const events = [
    { title: 'Engagement', path: '/event/engagement', icon: Heart, color: 'from-pink-500 to-rose-500', amount: totals.engagement || 0, budget: user?.budgets?.Engagement || 0 },
    { title: 'Mehndi', path: '/event/mehndi', icon: Sparkles, color: 'from-amber-400 to-orange-500', amount: totals.mehndi || 0, budget: user?.budgets?.Mehndi || 0 },
    { title: 'Marriage', path: '/event/marriage', icon: Church, color: 'from-purple-600 to-indigo-600', amount: totals.marriage || 0, budget: user?.budgets?.Marriage || 0 },
    { title: 'Dinner', path: '/event/dinner', icon: Utensils, color: 'from-emerald-400 to-teal-500', amount: totals.dinner || 0, budget: user?.budgets?.Dinner || 0 },
  ];

  const percentageSpent = totalBudget > 0 ? (grandTotal / totalBudget) * 100 : 0;

  return (
    <div className="space-y-12 pb-12">
      {/* Header & Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase italic mb-2">Dashboard</h1>
          <p className="text-xs font-black text-primary/40 uppercase tracking-[0.3em] italic">Hello, {user?.name.split(' ')[0] || 'Planner'}! Welcome to your wedding hub.</p>
        </motion.div>

        <div className="flex gap-4">
          <div className="bg-white/40 backdrop-blur-3xl border border-white/60 p-4 px-6 rounded-[2rem] shadow-xl flex items-center gap-4">
            <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-primary/30 uppercase tracking-widest leading-none mb-1">Planning Date</p>
              <p className="text-xs font-black text-foreground uppercase italic">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Financial Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-10 md:p-14 rounded-[3.5rem] overflow-hidden shadow-2xl bg-primary shadow-primary/30"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/20 rounded-full -translate-x-1/4 translate-y-1/4 blur-2xl" />
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 items-center">
            <div className="space-y-4">
                <p className="text-white/60 text-sm font-black uppercase tracking-[0.3em] italic">Total Wedding Investment</p>
                <div className="flex items-center gap-4">
                    <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic">₹{grandTotal.toLocaleString()}</h2>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md">
                        <TrendingUp size={24} />
                    </div>
                </div>
                <p className="text-white/40 text-xs font-black uppercase tracking-widest">Calculated across all ceremonies</p>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between text-white/80 text-xs font-black uppercase tracking-widest italic">
                    <span>Overall Budget Progress</span>
                    <span>{Math.round(percentageSpent)}%</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(percentageSpent, 100)}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={`h-full bg-gradient-to-r from-secondary to-orange-400 rounded-full`}
                    />
                </div>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Target: ₹{totalBudget.toLocaleString()}</p>
            </div>

            <div className="hidden lg:flex justify-center">
               <div className="w-32 h-32 border-4 border-white/10 rounded-full flex items-center justify-center relative">
                  <div className="absolute inset-2 border-2 border-white/20 rounded-full animate-spin-slow" />
                  <PieChart size={40} className="text-white/80" />
               </div>
            </div>
        </div>
      </motion.div>

      {/* Ceremony Hub Grid */}
      <div>
        <div className="flex items-center justify-between mb-8 px-4">
           <h3 className="text-xl font-black text-foreground tracking-tighter uppercase italic underline decoration-primary/20 underline-offset-8">Ceremony Portfolios</h3>
           <p className="text-[10px] font-black text-primary/30 uppercase tracking-[0.3em] italic">4 Active Ceremonies</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {events.map((event, index) => (
                <motion.div
                    key={event.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="auth-glass p-8 rounded-[2.5rem] group cursor-pointer border-white/60 hover:border-primary/20 transition-all shadow-xl"
                    onClick={() => navigate(event.path)}
                >
                    <div className="flex justify-between items-start mb-10">
                        <div className={`p-5 rounded-2xl bg-gradient-to-br ${event.color} shadow-lg shadow-current/20 group-hover:rotate-6 transition-transform`}>
                            <event.icon className="text-white" size={24} />
                        </div>
                        <div className="p-3 bg-primary/5 rounded-full text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0">
                            <ArrowUpRight size={18} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-[13px] font-black text-primary/40 uppercase tracking-[0.2em] italic leading-none mb-1.5">{event.title}</p>
                            <h4 className="text-2xl font-black text-foreground tracking-tight underline italic decoration-primary/5">₹{event.amount.toLocaleString()}</h4>
                        </div>
                        
                        <div className="pt-4 border-t border-primary/5 flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
                            <span>Manage Plan</span>
                            <ChevronRight size={14} className="text-primary" />
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>

      {/* Analytics Shortcut Section (Sample) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="auth-glass p-10 rounded-[3rem] border-white/60">
              <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <TrendingUp size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-foreground uppercase tracking-tight italic">Category Analysis</h4>
                    <p className="text-[10px] uppercase font-black tracking-widest text-primary/40 italic leading-none">Global Expense Breakdown</p>
                  </div>
              </div>
              <div className="space-y-6">
                 {categoryBreakdown.length > 0 ? (
                   categoryBreakdown.slice(0, 5).map(item => (
                    <div key={item.label}>
                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-2 italic">
                          <span className="text-primary">{item.label}</span>
                          <span className="text-foreground">{item.val}%</span>
                       </div>
                       <div className="h-2 bg-primary/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.val}%` }}
                            className="h-full bg-primary rounded-full transition-all duration-1000" 
                          />
                       </div>
                    </div>
                   ))
                 ) : (
                   <div className="py-8 text-center border-2 border-dashed border-primary/5 rounded-3xl">
                      <p className="text-[10px] font-black uppercase text-primary/20 tracking-widest">Awaiting Data Breakdown</p>
                   </div>
                 )}
              </div>
          </div>

          <div className="auth-glass p-10 rounded-[3rem] border-white/40 bg-secondary/5 flex flex-col justify-center text-center">
              <div className="w-20 h-20 bg-white/60 rounded-[2rem] flex items-center justify-center text-secondary mx-auto mb-6 shadow-xl">
                 <Sparkles size={40} />
              </div>
              <h4 className="text-xl font-black text-foreground uppercase tracking-tight italic mb-3">Professional Planning Tip</h4>
              <p className="text-sm font-medium text-primary/60 max-w-xs mx-auto mb-8">Remember to verify your catering quotes against the final guest list for the Dinner ceremony.</p>
              <button className="px-8 py-4 bg-white border border-secondary/20 rounded-2xl text-xs font-black uppercase tracking-widest text-secondary hover:bg-secondary hover:text-white transition-all">Dismiss Tip</button>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
