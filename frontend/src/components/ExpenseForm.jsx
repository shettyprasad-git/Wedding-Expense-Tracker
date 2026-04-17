import React, { useState, useEffect, useRef } from 'react';
import { X, Save, IndianRupee, Calendar, Tag, AlignLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExpenseForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Hall Booking',
    price: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const dateInputRef = useRef(null);

  const categories = [
    'Hall Booking', 
    'Decorations', 
    'Catering / Food', 
    'Photography', 
    'Makeup / Dressing', 
    'Travel / Transport', 
    'Miscellaneous'
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || 'Hall Booking',
        price: initialData.price || '',
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        description: initialData.description || ''
      });
    } else {
      setFormData({
        name: '',
        category: 'Hall Booking',
        price: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="auth-glass w-full max-w-lg p-8 md:p-10 rounded-[2.5rem] relative shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-foreground">{initialData ? 'Edit Expense' : 'Add Expense'}</h2>
            <p className="text-xs text-primary font-bold uppercase tracking-widest mt-1 italic">Fill in the wedding details</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors text-foreground/40">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label className="block text-[10px] font-black text-primary/70 ml-2 mb-2 uppercase tracking-[0.2em]">Expense Name</label>
            <div className="relative group">
              <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Venue Deposit"
                className="input-field pl-14"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="block text-[10px] font-black text-primary/70 ml-2 mb-2 uppercase tracking-[0.2em]">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field appearance-none cursor-pointer"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className="text-foreground">{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="block text-[10px] font-black text-primary/70 ml-2 mb-2 uppercase tracking-[0.2em]">Price (₹)</label>
              <div className="relative group">
                <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0"
                  className="input-field pl-14"
                  required
                />
              </div>
            </div>
          </div>

          {/* Optimized Date Selector - satisfying "date (should show select option)" */}
          <div className="flex flex-col">
            <label className="block text-[10px] font-black text-primary/70 ml-2 mb-2 uppercase tracking-[0.2em]">Event Date</label>
            <div 
              className="relative group cursor-pointer"
              onClick={() => dateInputRef.current?.showPicker()}
            >
              <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="date"
                name="date"
                ref={dateInputRef}
                value={formData.date}
                onChange={handleChange}
                className="input-field pl-14 cursor-pointer"
                required
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-primary/40 uppercase tracking-widest pointer-events-none group-hover:text-primary transition-colors">
                 Select Date
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="block text-[10px] font-black text-primary/70 ml-2 mb-2 uppercase tracking-[0.2em]">Description</label>
            <div className="relative group">
              <AlignLeft className="absolute left-5 top-4 text-primary/30 group-focus-within:text-primary transition-colors" size={18} />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add some details about this cost..."
                className="input-field pl-14 h-28 resize-none pt-4"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl border border-primary/10 text-primary font-black uppercase text-xs tracking-widest hover:bg-primary/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[2] btn-primary"
            >
              <Save size={20} />
              <span className="tracking-widest uppercase">{initialData ? 'Update Expense' : 'Save Expense'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ExpenseForm;
