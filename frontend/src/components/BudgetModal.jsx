import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, IndianRupee, Save, Loader2, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BudgetModal = ({ isOpen, onClose, eventName, currentBudget }) => {
  const [budget, setBudget] = useState(currentBudget || 0);
  const [isLoading, setIsLoading] = useState(false);
  const { updateBudgets } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setBudget(currentBudget || 0);
    }
  }, [isOpen, currentBudget]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Map eventName to the correct key in the budgets object
      // If no eventName, update GrandTotal
      const budgetKey = eventName || 'GrandTotal';
      await updateBudgets({ [budgetKey]: Number(budget) });
      onClose();
    } catch (err) {
      console.error('❌ Failed to update budget:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/20 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-md auth-glass p-8 md:p-10 border-white/60 shadow-2xl relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Target size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-foreground uppercase tracking-tight italic leading-none">
                  {eventName ? `${eventName} Budget` : 'Overall Budget'}
                </h3>
                <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest mt-1 italic">
                  Set your financial target
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-primary/40 hover:text-primary transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-primary px-1 uppercase tracking-[0.2em] italic">
                Target Amount (₹)
              </label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors">
                  <IndianRupee size={20} />
                </div>
                <input
                  type="number"
                  className="input-field pl-16 h-16 bg-white/50 border-white/60 focus:bg-white transition-all text-xl font-black italic"
                  placeholder="0.00"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  required
                  min="0"
                />
              </div>
              <p className="text-[9px] font-semibold text-primary/30 px-1 uppercase tracking-widest italic">
                This will update your dashboard progress tracking.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-5 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 h-16 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Save size={18} className="relative z-10" />
                  <span className="relative z-10 tracking-[0.2em] uppercase font-black text-xs">Save Target</span>
                </>
              )}
            </button>
          </form>

          {/* Decorative background flourish */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl -z-10" />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BudgetModal;
