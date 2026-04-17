import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertCircle } from 'lucide-react';

const StatCard = ({ title, amount, icon: Icon, color, budget }) => {
  const percentage = budget > 0 ? Math.min((amount / budget) * 100, 100) : 0;
  const isOverBudget = budget > 0 && amount > budget;

  return (
    <motion.div 
      whileHover={{ scale: 1.02, translateY: -5 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`glass-card p-6 md:p-8 flex flex-col gap-6 group relative overflow-hidden border-white/40 shadow-2xl ${isOverBudget ? 'ring-2 ring-red-500/20' : ''}`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-[0.03] rounded-full translate-x-12 -translate-y-12 group-hover:scale-125 transition-transform duration-1000`} />
      
      <div className="flex items-center gap-6">
        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-lg ${color} bg-opacity-10 group-hover:scale-110 transition-transform duration-300 border border-current/10`}>
          <Icon className={color.replace('bg-', 'text-')} size={28} />
        </div>
        
        <div className="flex-1">
          <h3 className="text-primary/60 text-[10px] font-black uppercase tracking-[0.2em]">{title}</h3>
          <p className="text-3xl font-black text-foreground tracking-tighter mt-1">₹{amount?.toLocaleString()}</p>
        </div>
      </div>
      
      {budget > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-end">
             <div className="flex flex-col">
                <span className="text-[9px] font-black text-primary/40 uppercase tracking-widest italic leading-none">Actual vs Target</span>
                <span className={`text-[11px] font-black tracking-tight ${isOverBudget ? 'text-red-500' : 'text-primary'}`}>
                  {percentage.toFixed(1)}% Utilized
                </span>
             </div>
             <div className="text-right">
                <span className="text-[9px] font-black text-foreground/30 uppercase tracking-widest block leading-none mb-1 text-center">Budget</span>
                <span className="text-xs font-black text-foreground/50 tracking-tighter">₹{budget.toLocaleString()}</span>
             </div>
          </div>
          
          <div className="relative h-2 bg-primary/5 rounded-full overflow-hidden border border-white/10">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className={`h-full relative ${isOverBudget ? 'bg-red-500' : color}`}
            >
              <div className="absolute top-0 right-0 h-full w-2 bg-white/20 blur-[2px]" />
            </motion.div>
          </div>

          {isOverBudget && (
            <div className="flex items-center gap-1.5 text-red-500 font-bold text-[9px] uppercase tracking-widest animate-pulse">
               <AlertCircle size={10} /> Budget Exceeded
            </div>
          )}
        </div>
      )}

      {budget === 0 && (
         <div className="pt-4 border-t border-white/10">
            <p className="text-[9px] text-foreground/30 font-black uppercase tracking-widest italic text-center">No Budget Set</p>
         </div>
      )}
    </motion.div>
  );
};

export default StatCard;
