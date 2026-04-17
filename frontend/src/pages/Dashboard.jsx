import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Heart, Sparkles, Church, Utensils, TrendingUp, IndianRupee, Layers, Calendar, ArrowUpRight, FileJson, FileText, Settings2, Wallet } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import BudgetModal from '../components/BudgetModal';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { expenses, loading, totals, exportAllToCSV, exportAllToPDF } = useExpenses();
  const { user } = useAuth();
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  // Global Budget from User Profile (falling back to user preference or 1M)
  const totalBudget = user?.budgets?.GrandTotal || 0;

  const categoryData = useMemo(() => {
    const data = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + (exp.price || 0);
      return acc;
    }, {});
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const COLORS = ['#9D76C1', '#E88D67', '#D4AF37', '#713ABE', '#D06224', '#B3A492', '#86B6BB'];

  const budgetProgress = totalBudget > 0 ? Math.min(((totals.GrandTotal || 0) / totalBudget) * 100, 100) : 0;

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-10 md:space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-1000 pb-24 px-1 md:px-0">
      {/* Header with quick stats and controls */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
        <div>
          <span className="text-primary font-black tracking-[0.3em] uppercase text-xs italic opacity-60">Wedding Overview</span>
          <h1 className="text-5xl md:text-7xl font-black text-foreground mt-3 tracking-tighter leading-none">The Grand Budget</h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 w-full xl:w-auto">
          <div className="glass-card p-1 border-white/40 shadow-2xl flex items-stretch">
            <div className="px-8 py-6 md:px-12 md:py-8">
              <p className="text-[10px] md:text-xs text-primary font-black uppercase tracking-[0.2em] mb-2 opacity-60 italic">Total Investment</p>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-black text-primary/50">₹</span>
                <p className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">{(totals.GrandTotal || 0).toLocaleString()}</p>
              </div>
            </div>
            <div className="w-px bg-white/20 self-center h-16" />
            <div className="px-8 py-6 md:px-12 md:py-8 text-right bg-primary/10 rounded-r-[1.5rem] md:rounded-r-[2rem]">
              <p className="text-[10px] md:text-xs text-secondary font-black uppercase tracking-[0.2em] mb-2 opacity-60 italic">Global Target</p>
              <p className="text-2xl md:text-3xl font-black text-secondary tracking-tighter">₹{totalBudget.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-row">
            <button 
              onClick={() => setIsBudgetModalOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-secondary text-white rounded-3xl font-black uppercase text-[10px] tracking-widest hover:bg-secondary-dark transition-all shadow-xl shadow-secondary/20 group"
            >
              <Wallet size={16} className="group-hover:rotate-12 transition-transform" />
              Manage Budgets
            </button>
            <div className="flex gap-2">
              <button 
                onClick={exportAllToCSV}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white/40 backdrop-blur-md border border-white/40 rounded-3xl text-primary font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all shadow-lg"
              >
                <FileJson size={16} /> CSV
              </button>
              <button 
                onClick={exportAllToPDF}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white/40 backdrop-blur-md border border-white/40 rounded-3xl text-primary font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all shadow-lg"
              >
                <FileText size={16} /> PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar & Summary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-8 md:p-12 relative overflow-hidden group border-white/40 shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
            <div className="flex justify-between items-end mb-8">
              <div className="flex items-center gap-3">
                <TrendingUp size={24} className="text-primary" />
                <h3 className="font-black text-xl md:text-2xl tracking-tight">Financial Progress</h3>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1 italic">Actual vs Target</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl md:text-2xl font-black text-foreground">₹{(totals.GrandTotal || 0).toLocaleString()}</span>
                  <span className="text-sm font-black text-foreground/30">/ ₹{totalBudget.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="w-full h-4 md:h-6 bg-primary/10 rounded-full overflow-hidden shadow-inner border border-white/10">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${budgetProgress}%` }}
                transition={{ duration: 2, ease: "circOut" }}
                className={`h-full relative ${budgetProgress > 100 ? 'bg-red-500' : 'bg-gradient-to-r from-primary via-secondary to-primary'} bg-[length:200%_auto] animate-gradient`}
              >
                <div className="absolute top-0 right-0 h-full w-4 bg-white/20 blur-[4px]" />
              </motion.div>
            </div>
            
            <div className="flex justify-between mt-4 text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] italic">
               <span className="text-primary font-black uppercase">{budgetProgress.toFixed(1)}% Consumed</span>
               <span>{totals.GrandTotal > totalBudget && totalBudget > 0 ? 'Exceeding Global Budget' : 'Within Financial Target'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
            {[
              { t: 'Engagement', icon: Heart, color: 'bg-primary' },
              { t: 'Mehndi', icon: Sparkles, color: 'bg-secondary' },
              { t: 'Marriage', icon: Church, color: 'bg-primary-dark' },
              { t: 'Dinner', icon: Utensils, color: 'bg-secondary-dark' }
            ].map((item, idx) => (
              <StatCard 
                key={item.t}
                title={item.t} 
                amount={totals[item.t] || 0} 
                icon={item.icon} 
                color={item.color} 
                budget={user?.budgets?.[item.t] || 0}
              />
            ))}
          </div>
        </div>

        <div className="glass-card p-10 md:p-12 flex flex-col items-center justify-center text-center border-white/40 shadow-2xl relative overflow-hidden">
           <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-secondary/10 rounded-full blur-3xl" />
           <div className="w-24 h-24 rounded-[2.5rem] bg-secondary/10 flex items-center justify-center border border-secondary/20 shadow-xl mb-8">
              <Layers size={40} className="text-secondary" />
           </div>
           <h3 className="text-3xl font-black text-foreground mb-4 tracking-tighter">Event Items</h3>
           <p className="text-sm font-bold text-foreground/40 mb-8 italic uppercase tracking-widest">Total services booked across all wedding functions</p>
           <p className="text-7xl font-black text-secondary tracking-tighter">{expenses.length}</p>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 md:gap-16">
        <div className="glass-card p-10 md:p-14 border-white/40 shadow-2xl">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-2xl md:text-3xl font-black tracking-tighter">Category Distribution</h3>
            <div className="p-3 bg-primary/10 rounded-2xl text-primary"><ArrowUpRight size={20} /></div>
          </div>
          <div className="h-80 md:h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={categoryData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={window.innerWidth < 768 ? 60 : 80} 
                  outerRadius={window.innerWidth < 768 ? 90 : 120} 
                  paddingAngle={10} 
                  dataKey="value"
                  animationDuration={1500}
                >
                  {categoryData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />)}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', border: 'none', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }} 
                  itemStyle={{ color: '#2d1b4d' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px', fontWeight: 'bold', textTransform: 'uppercase' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-10 md:p-14 border-white/40 shadow-2xl">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-2xl md:text-3xl font-black tracking-tighter">Section Comparison</h3>
            <div className="p-3 bg-secondary/10 rounded-2xl text-secondary"><ArrowUpRight size={20} /></div>
          </div>
          <div className="h-80 md:h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={['Engagement', 'Mehndi', 'Marriage', 'Dinner'].map(s => ({ name: s, value: totals[s] || 0 }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                <XAxis dataKey="name" stroke="#9D76C1" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase' }} dy={10} />
                <YAxis stroke="#9D76C1" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 800 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(157, 118, 193, 0.05)' }} 
                  contentStyle={{ background: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }} 
                />
                <Bar dataKey="value" fill="url(#colorBar)" radius={[15, 15, 0, 0]} barSize={window.innerWidth < 768 ? 30 : 60} />
                <defs>
                   <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#9D76C1" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#713ABE" stopOpacity={1}/>
                   </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <BudgetModal isOpen={isBudgetModalOpen} onClose={() => setIsBudgetModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
