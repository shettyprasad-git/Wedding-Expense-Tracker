import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Save, IndianRupee, Heart, Sparkles, Church, Utensils } from 'lucide-react';

const BudgetModal = ({ isOpen, onClose, onSave, currentBudgets }) => {
  const [budgets, setBudgets] = useState({
    Engagement: 0,
    Mehndi: 0,
    Marriage: 0,
    Dinner: 0
  });

  const categories = [
    { name: 'Engagement', icon: Heart, color: 'text-pink-500' },
    { name: 'Mehndi', icon: Sparkles, color: 'text-amber-500' },
    { name: 'Marriage', icon: Church, color: 'text-purple-600' },
    { name: 'Dinner', icon: Utensils, color: 'text-emerald-500' }
  ];

  useEffect(() => {
    if (currentBudgets) {
      setBudgets(currentBudgets);
    }
  }, [currentBudgets, isOpen]);

  const handleChange = (e) => {
    setBudgets({
      ...budgets,
      [e.target.name]: Number(e.target.value)
    });
  };

  const handleSave = () => {
    onSave(budgets);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="auth-glass w-full max-w-2xl p-10 md:p-14 rounded-[3.5rem] relative shadow-2xl overflow-hidden border-white/60"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -translate-y-12 translate-x-12" />
        
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-4xl font-black text-foreground tracking-tighter uppercase italic mb-2">Budget Target Hub</h2>
            <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.3em] italic">Set ceremony investment thresholds</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/20 rounded-full transition-colors text-foreground/40 group">
             <X size={28} className="group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {categories.map((cat) => (
            <div key={cat.name} className="flex flex-col gap-3 bg-white/40 p-6 rounded-[2rem] border border-white/60 hover:bg-white transition-all shadow-inner group">
              <div className="flex items-center gap-3">
                <cat.icon className={`${cat.color} group-hover:scale-110 transition-transform`} size={18} />
                <label className="text-[11px] font-black uppercase tracking-widest text-primary italic leading-none">{cat.name} Portfolio</label>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-primary/20 italic">₹</span>
                  <input
                    type="number"
                    name={cat.name}
                    value={budgets[cat.name]}
                    onChange={handleChange}
                    className="w-full bg-transparent p-0 text-3xl font-black text-foreground tracking-tighter focus:outline-none placeholder:text-primary/10 italic"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 px-8 py-5 rounded-2xl border border-primary/10 text-primary font-black uppercase text-xs tracking-widest hover:bg-primary/5 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex-[2] btn-primary shadow-2xl shadow-primary/30"
          >
            <Save size={20} className="stroke-3" />
            <span className="tracking-[0.2em] uppercase font-black text-xs">Commit New Targets</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default BudgetModal;
