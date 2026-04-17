import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Heart, Sparkles, Church, Utensils, TrendingUp, Percent } from 'lucide-react';
import api from '../utils/api';
import StatCard from '../components/StatCard';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const totalBudget = 1000000; // Example budget

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await api.get('/expenses');
        setExpenses(res.data);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchExpenses();
  }, []);

  const totals = expenses.reduce((acc, exp) => {
    acc.overall += exp.amount;
    acc[exp.section] = (acc[exp.section] || 0) + exp.amount;
    return acc;
  }, { overall: 0, Engagement: 0, Mehndi: 0, Marriage: 0, Dinner: 0 });

  const categoryData = Object.entries(
    expenses.reduce((acc, exp) => ({ ...acc, [exp.category]: (acc[exp.category] || 0) + exp.amount }), {})
  ).map(([name, value]) => ({ name, value }));

  const COLORS = ['#9D76C1', '#E88D67', '#D4AF37', '#713ABE', '#D06224', '#B3A492', '#86B6BB'];

  const budgetProgress = Math.min((totals.overall / totalBudget) * 100, 100);

  if (loading) return <div className="flex h-full items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" /></div>;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <span className="text-primary font-bold tracking-widest uppercase text-sm">Overview</span>
          <h1 className="text-5xl font-black text-foreground mt-1">Wedding Dashboard</h1>
        </div>
        <div className="glass-card px-8 py-5 border-primary/10 shadow-primary/5 flex items-center gap-6">
          <div>
            <p className="text-xs text-primary/60 uppercase font-black tracking-tighter">Total Spent</p>
            <p className="text-3xl font-black text-primary">₹{totals.overall.toLocaleString()}</p>
          </div>
          <div className="w-px h-10 bg-primary/10" />
          <div className="text-right">
            <p className="text-xs text-primary/60 uppercase font-black tracking-tighter">Budget Utilization</p>
            <p className="text-2xl font-black text-secondary">{budgetProgress.toFixed(1)}%</p>
          </div>
        </div>
      </header>

      {/* Budget Progress Bar */}
      <div className="glass-card p-8 group">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" />
            <h3 className="font-bold text-lg">Budget Progress</h3>
          </div>
          <p className="text-sm font-medium text-foreground/40">Goal: ₹{totalBudget.toLocaleString()}</p>
        </div>
        <div className="w-full h-4 bg-primary-light/30 rounded-full overflow-hidden shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${budgetProgress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-primary to-secondary relative"
          >
             <div className="absolute top-0 right-0 h-full w-2 bg-white/30 blur-[2px]" />
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { t: 'Engagement', icon: Heart, color: 'bg-primary' },
          { t: 'Mehndi', icon: Sparkles, color: 'bg-secondary' },
          { t: 'Marriage', icon: Church, color: 'bg-primary-dark' },
          { t: 'Dinner', icon: Utensils, color: 'bg-secondary-dark' }
        ].map(item => (
          <StatCard 
            key={item.t}
            title={item.t} 
            amount={totals[item.t]} 
            icon={item.icon} 
            color={item.color} 
            percentage={totals.overall > 0 ? ((totals[item.t] / totals.overall) * 100).toFixed(1) : 0}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 glass-card p-8">
          <h3 className="text-xl font-black mb-8 border-b border-primary/5 pb-4">Category Analysis</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={8} dataKey="value">
                  {categoryData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-3 glass-card p-8">
          <h3 className="text-xl font-black mb-8 border-b border-primary/5 pb-4">Event Comparison</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Object.entries(totals).filter(([k]) => k !== 'overall').map(([name, value]) => ({ name, value }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                <XAxis dataKey="name" stroke="#9D76C1" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                <YAxis stroke="#9D76C1" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'rgba(157, 118, 193, 0.05)' }} contentStyle={{ background: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: '15px' }} />
                <Bar dataKey="value" fill="#9D76C1" radius={[12, 12, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
