import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles, Church, Utensils, TrendingUp, IndianRupee, Layers, ArrowUpRight, FileJson, FileText, Wallet, ArrowRight } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import BudgetModal from '../components/BudgetModal';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { expenses, loading, totals, exportAllToCSV, exportAllToPDF } = useExpenses();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  const totalBudget = user?.budgets?.GrandTotal || 0;
  const budgetProgress = totalBudget > 0 ? Math.min(((totals.GrandTotal || 0) / totalBudget) * 100, 100) : 0;

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const events = [
    { title: 'Engagement', key: 'engagement', icon: Heart, color: 'bg-primary' },
    { title: 'Mehndi', key: 'mehndi', icon: Sparkles, color: 'bg-secondary' },
    { title: 'Marriage', key: 'marriage', icon: Church, color: 'bg-primary-dark' },
    { title: 'Dinner', key: 'dinner', icon: Utensils, color: 'bg-secondary-dark' }
  ];

  return (
    <div className="space-y-10 md:space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-1000 pb-24 px-1 md:px-0">
      {/* Header with Quick Stats */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
        <div>
          <span className="text-primary font-black tracking-[0.3em] uppercase text-xs italic opacity-60">Wedding Hub</span>
          <h1 className="text-5xl md:text-7xl font-black text-foreground mt-3 tracking-tighter leading-none">The Grand Budget</h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 w-full xl:w-auto">
          <div className="glass-card p-1 border-white/40 shadow-2xl flex items-stretch">
            <div className="px-8 py-6 md:px-12 md:py-8">
              <p className="text-[10px] md:text-xs text-primary font-black uppercase tracking-[0.2em] mb-2 opacity-60 italic">Expense Done in Total</p>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-black text-primary/50">₹</span>
                <p className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">{(totals.GrandTotal || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-row">
            <button 
              onClick={() => setIsBudgetModalOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-secondary text-white rounded-3xl font-black uppercase text-[10px] tracking-widest hover:bg-secondary-dark transition-all shadow-xl shadow-secondary/20 group"
            >
              <Wallet size={16} className="group-hover:rotate-12 transition-transform" />
              Settings
            </button>
            <div className="flex gap-2">
              <button 
                onClick={exportAllToCSV}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white/40 border border-white/40 rounded-3xl text-primary font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all shadow-lg"
              >
                CSV
              </button>
              <button 
                onClick={exportAllToPDF}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white/40 border border-white/40 rounded-3xl text-primary font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all shadow-lg"
              >
                PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Global Progress Bar */}
      <div className="glass-card p-10 md:p-14 relative overflow-hidden group border-white/40 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div className="flex items-center gap-3">
            <TrendingUp size={32} className="text-primary" />
            <h2 className="font-black text-2xl md:text-4xl tracking-tighter">Marriage Investment</h2>
          </div>
          <p className="text-xl md:text-2xl font-black text-foreground/40 tracking-tight">
            ₹{(totals.GrandTotal || 0).toLocaleString()} / <span className="text-primary/40">₹{totalBudget.toLocaleString()}</span>
          </p>
        </div>
        <div className="w-full h-6 bg-primary/10 rounded-full overflow-hidden border border-white/10 shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${budgetProgress}%` }}
            transition={{ duration: 2, ease: "circOut" }}
            className={`h-full relative ${budgetProgress > 100 ? 'bg-red-500' : 'bg-gradient-to-r from-primary via-secondary to-primary'}`}
          />
        </div>
        <p className="mt-4 text-[10px] font-black text-primary uppercase tracking-widest italic">{budgetProgress.toFixed(1)}% of planned budget consumed</p>
      </div>

      {/* Event Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
        {events.map((event) => (
          <motion.div 
            key={event.key}
            whileHover={{ translateY: -10 }}
            className="glass-card p-10 md:p-12 border-white/40 shadow-2xl relative overflow-hidden group flex flex-col justify-between"
          >
            <div className={`absolute top-0 right-0 w-48 h-48 ${event.color} opacity-[0.03] rounded-full translate-x-16 -translate-y-16 group-hover:scale-125 transition-transform duration-1000`} />
            
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl ${event.color} bg-opacity-10 border border-current/10`}>
                   <event.icon className={event.color.replace('bg-', 'text-')} size={40} />
                </div>
                <div className="text-right">
                  <span className="text-primary/40 text-[10px] font-black uppercase tracking-[0.3em] italic">Ceremony Target</span>
                  <p className="text-sm font-black text-foreground/60 tracking-tight mt-1">₹{(user?.budgets?.[event.title] || 0).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <h3 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter">{event.title}</h3>
                <div className="flex items-baseline gap-1 mt-2">
                   <span className="text-sm font-black text-primary/50">₹</span>
                   <p className="text-4xl md:text-5xl font-black text-primary tracking-tighter">{(totals[event.key] || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => navigate(`/event/${event.key}`)}
              className="mt-12 w-full py-5 bg-white/40 hover:bg-white border border-white/50 rounded-[2rem] text-primary font-black uppercase text-[10px] tracking-[0.3em] transition-all flex items-center justify-center gap-3 group/btn shadow-lg"
            >
              Manage Expenses <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
