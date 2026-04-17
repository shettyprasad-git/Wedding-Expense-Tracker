import React, { useState, useEffect, useRef } from 'react';
import { X, Save, IndianRupee, Calendar, Tag, AlignLeft, PlusCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExpenseForm = ({ isOpen, onClose, onSubmit, initialData, forcedEvent }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Catering',
    price: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    event: forcedEvent || 'marriage'
  });

  const [manualCategory, setManualCategory] = useState('');
  const [isOther, setIsOther] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dateInputRef = useRef(null);

  const categories = [
    { label: 'Venue & Hall', icon: 'Home' },
    { label: 'Catering & Food', icon: 'Utensils' },
    { label: 'Decoration & Setup', icon: 'Palette' },
    { label: 'Travel & Logistics', icon: 'Truck' },
    { label: 'Wedding Attire & Styling', icon: 'Watch' },
    { label: 'Photography & Videography', icon: 'Camera' },
    { label: 'Entertainment & Music', icon: 'Music' },
    { label: 'Invitations & Printing', icon: 'FileText' },
    { label: 'Gifts & Return Gifts', icon: 'Gift' },
    { label: 'Miscellaneous', icon: 'Layers' },
    { label: 'Other (Custom)', icon: 'PlusCircle' }
  ];

  useEffect(() => {
    if (initialData) {
      const standardCategory = categories.find(c => c.label === initialData.category);
      const isCustom = !standardCategory;
      
      setFormData({
        name: initialData.name || '',
        category: isCustom ? 'Other (Custom)' : (initialData.category || ''),
        price: initialData.price || '',
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        description: initialData.description || '',
        event: initialData.event || forcedEvent || 'marriage'
      });
      if (isCustom) {
        setManualCategory(initialData.category);
        setIsOther(true);
      } else {
        setManualCategory('');
        setIsOther(false);
      }
    } else {
      setFormData({
        name: '',
        category: '', // Select Category default
        price: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        event: forcedEvent || 'marriage'
      });
      setManualCategory('');
      setIsOther(false);
    }
  }, [initialData, isOpen, forcedEvent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      setIsOther(value === 'Other (Custom)');
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) {
      alert('Please select a category');
      return;
    }
    setIsSubmitting(true);
    const finalData = {
      ...formData,
      category: isOther ? manualCategory : formData.category
    };
    await onSubmit(finalData);
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="auth-glass w-full max-w-2xl p-10 md:p-14 rounded-[3.5rem] relative shadow-2xl overflow-hidden border-white/60"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-[80px] translate-x-12 translate-y-12" />
        
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-4xl font-black text-foreground tracking-tighter uppercase italic mb-2">{initialData ? 'Refine Record' : 'Index Expense'}</h2>
            <p className="text-[10px] text-primary/40 font-black uppercase tracking-[0.3em] mt-1 italic leading-none">Ceremony Portfolio: {forcedEvent || formData.event}</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/20 rounded-full transition-colors text-foreground/40 group">
            <X size={32} className="group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black text-primary/60 px-1 uppercase tracking-[0.2em] italic leading-none">Transaction Identification</label>
            <div className="relative group">
              <PlusCircle className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Grand Ballroom Deposit"
                className="input-field w-full pl-14 bg-white/40 focus:bg-white"
                required
              />
            </div>
          </div>

          {/* Category & Price Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-black text-primary/60 px-1 uppercase tracking-[0.2em] italic leading-none">Ceremony Category</label>
              <div className="relative group">
                <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/20 pointer-events-none" size={20} />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field w-full pl-14 appearance-none cursor-pointer bg-white/40 focus:bg-white"
                  required
                >
                  <option value="" disabled>Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.label} value={cat.label} className="text-foreground">
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-black text-primary/60 px-1 uppercase tracking-[0.2em] italic leading-none">Financial Value (₹)</label>
              <div className="relative group">
                <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-primary transition-colors" size={20} />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="input-field w-full pl-14 bg-white/40 focus:bg-white font-black text-xl tracking-tighter italic"
                  required
                />
              </div>
            </div>
          </div>

          {/* Conditional Manual Category Input */}
          <AnimatePresence mode="popLayout">
            {isOther && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-2"
              >
                <label className="text-[11px] font-black text-secondary px-1 uppercase tracking-[0.2em] italic leading-none">Enter Custom Category</label>
                <input
                  type="text"
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value)}
                  placeholder="e.g., Jewelry, Flower Garlands..."
                  className="input-field w-full border-secondary/20 focus:ring-secondary/20 focus:border-secondary/40 bg-white/40 focus:bg-white"
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Date Field */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black text-primary/60 px-1 uppercase tracking-[0.2em] italic leading-none">Effective Transaction Date</label>
            <input
              type="date"
              name="date"
              ref={dateInputRef}
              value={formData.date}
              onChange={handleChange}
              className="input-field w-full cursor-pointer bg-white/40 focus:bg-white uppercase text-xs font-black tracking-widest italic px-5 py-4"
              required
            />
          </div>

          {/* Description Field */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black text-primary/60 px-1 uppercase tracking-[0.2em] italic leading-none">Internal Transaction Notes</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Include payment milestones, vendor contact details..."
              className="input-field w-full h-32 resize-none bg-white/40 focus:bg-white text-xs font-medium italic px-5 py-6"
            />
          </div>

          {/* SaaS Actions */}
          <div className="flex gap-6 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-5 rounded-2xl border border-primary/10 text-primary font-black uppercase text-xs tracking-[0.2em] hover:bg-primary/5 transition-all italic"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] btn-primary shadow-2xl shadow-primary/30 h-16"
            >
              {isSubmitting ? (
                <CheckCircle2 size={24} className="animate-spin text-white" />
              ) : (
                <>
                  <Save size={20} className="stroke-[3]" />
                  <span className="tracking-[0.3em] uppercase font-black text-sm italic ml-1">
                    {initialData ? 'Commit Record' : 'Finalize Entry'}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ExpenseForm;
