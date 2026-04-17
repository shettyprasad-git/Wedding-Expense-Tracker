import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, amount, icon: Icon, color, percentage }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05, translateY: -5 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="glass-card p-8 flex items-center gap-6 group relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-[0.03] rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-700`} />
      
      <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-lg ${color} bg-opacity-10 group-hover:scale-110 transition-transform duration-300 border border-current/10`}>
        <Icon className={color.replace('bg-', 'text-')} size={32} />
      </div>
      
      <div className="flex-1">
        <h3 className="text-primary/60 text-xs font-black uppercase tracking-widest">{title}</h3>
        <p className="text-3xl font-black text-foreground mt-2">₹{amount?.toLocaleString()}</p>
        
        {percentage && (
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-primary/10 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${percentage}%` }}
                 className={`h-full ${color}`}
               />
            </div>
            <span className="text-[10px] font-black text-primary/40 whitespace-nowrap">{percentage}%</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
