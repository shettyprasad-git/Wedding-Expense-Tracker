import React, { useState, useEffect } from 'react';
import { X, Save, IndianRupee, Target, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const BudgetModal = ({ isOpen, onClose }) => {
  const { user, updateBudgets } = useAuth();
  const [formData, setFormData] = useState({
    Engagement: 0,
    Mehndi: 0,
    Marriage: 0,
    Dinner: 0,
    GrandTotal: 0
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.budgets) {
      setFormData({
        Engagement: user.budgets.Engagement || 0,
        Mehndi: user.budgets.Mehndi || 0,
        Marriage: user.budgets.Marriage || 0,
        Dinner: user.budgets.Dinner || 0,
        GrandTotal: user.budgets.GrandTotal || 0
      });
    }
  }, [user, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseInt(e.target.value) || 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateBudgets(formData);
      onClose();
    } catch (err) {
      alert('Failed to update budgets');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="auth-glass w-full max-w-lg p-8 md:p-10 rounded-[2.5rem] relative shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Finance Center</h2>
            <p className="text-[10px] text-secondary font-black uppercase tracking-widest mt-1 italic">Set your savings targets</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors text-foreground/40">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {['Engagement', 'Mehndi', 'Marriage', 'Dinner'].map((section) => (
              <div key={section} className="flex flex-col">
                <label className="block text-[10px] font-black text-primary/70 ml-2 mb-2 uppercase tracking-[0.2em]">{section} Budget</label>
                <div className="relative group">
                  <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors" size={16} />
                  <input
                    type="number"
                    name={section}
                    value={formData[section]}
                    onChange={handleChange}
                    className="input-field pl-12 h-12 text-sm"
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col bg-secondary/5 p-6 rounded-[2rem] border border-secondary/10">
            <label className="block text-[10px] font-black text-secondary/70 ml-2 mb-2 uppercase tracking-[0.2em]">Grand Wedding Target</label>
            <div className="relative group">
              <Target className="absolute left-5 top-1/2 -translate-y-1/2 text-secondary/30 group-focus-within:text-secondary transition-colors" size={20} />
              <input
                type="number"
                name="GrandTotal"
                value={formData.GrandTotal}
                onChange={handleChange}
                className="input-field pl-14 h-14 text-lg font-black"
                placeholder="Global Budget"
                required
              />
            </div>
            <p className="mt-3 text-[9px] text-secondary/40 font-black uppercase tracking-widest italic text-center">Calculated total from sections: ₹{(formData.Engagement + formData.Mehndi + formData.Marriage + formData.Dinner).toLocaleString()}</p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl border border-primary/10 text-primary font-black uppercase text-xs tracking-widest hover:bg-primary/5 transition-all"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-[2] flex items-center justify-center gap-3 py-4 bg-secondary text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-secondary-dark transition-all shadow-xl shadow-secondary/20"
            >
              {isSaving ? <ShieldCheck className="animate-pulse" /> : <Save size={20} />}
              <span>{isSaving ? 'Saving...' : 'Update Targets'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default BudgetModal;
