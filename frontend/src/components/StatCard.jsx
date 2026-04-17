import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertCircle, IndianRupee } from 'lucide-react';

const StatCard = ({ title, amount, icon: Icon, color, budget }) => {
  const percentage = budget > 0 ? Math.min((amount / budget) * 100, 100) : 0;
  const isOverBudget = budget > 0 && amount > budget;

  return (
    <motion.div 
      whileHover={{ scale: 1.02, translateY: -5 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`auth-glass p-8 md:p-10 flex flex-col gap-8 group relative overflow-hidden border-white/60 shadow-2xl rounded-[2.5rem] ${isOverBudget ? 'ring-2 ring-red-500/20' : ''}`}
    >
      <div className={`absolute top-0 right-0 w-40 h-40 ${color} opacity-[0.05] rounded-full translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-1000 blur-2xl`} />
      
      <div className="flex items-center gap-6">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br ${color} group-hover:rotate-6 transition-transform duration-300`}>
          <Icon className="text-white" size={28} />
        </div>
        
        <div className="flex-1">
          <h3 className="text-primary/40 text-[10px] font-black uppercase tracking-[0.3em] italic leading-none mb-2">{title}</h3>
          <p className="text-4xl font-black text-foreground tracking-tighter underline italic decoration-primary/5 italic">₹{amount?.toLocaleString()}</p>
        </div>
      </div>
      
      {budget > 0 && (
        <div className="space-y-4 pt-4 border-t border-primary/5">
          <div className="flex justify-between items-end">
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-primary/30 uppercase tracking-widest italic leading-none mb-1.5">Progress to Target</span>
                <span className={`text-xs font-black tracking-tight uppercase ${isOverBudget ? 'text-red-500' : 'text-primary'}`}>
                  {percentage.toFixed(1)}% Utilized
                </span>
             </div>
             <div className="text-right">
                <span className="text-[9px] font-black text-foreground/30 uppercase tracking-widest block leading-none mb-1.5 italic">Total Budget</span>
                <span className="text-sm font-black text-foreground/60 tracking-tighter italic">₹{budget.toLocaleString()}</span>
             </div>
          </div>
          
          <div className="relative h-3 bg-primary/5 rounded-full overflow-hidden border border-white/10 p-0.5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className={`h-full rounded-full relative ${isOverBudget ? 'bg-gradient-to-r from-red-500 to-rose-600' : 'bg-gradient-to-r ' + color}`}
            >
              <div className="absolute top-0 right-0 h-full w-2 bg-white/20 blur-[1px]" />
            </motion.div>
          </div>

          {isOverBudget && (
            <div className="flex items-center gap-2 text-red-500 font-black text-[9px] uppercase tracking-widest animate-pulse italic">
               <AlertCircle size={12} /> Budget Alert: Engagement Exceeded
            </div>
          )}
        </div>
      )}

      {budget === 0 && (
         <div className="pt-6 border-t border-primary/5">
            <p className="text-[10px] text-primary/20 font-black uppercase tracking-widest italic text-center">Budget Targets Disabled</p>
         </div>
      )}
    </motion.div>
  );
};

export default StatCard;
