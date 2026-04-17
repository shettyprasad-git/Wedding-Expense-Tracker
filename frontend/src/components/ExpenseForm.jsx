import React, { useState, useEffect, useRef } from 'react';
import { X, Save, IndianRupee, Calendar, Tag, AlignLeft, PlusCircle } from 'lucide-react';
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
  const dateInputRef = useRef(null);

  const categories = ['Hall', 'Catering', 'Decoration', 'Travel', 'Misc', 'Other'];

  useEffect(() => {
    if (initialData) {
      const isCustom = !['Hall', 'Catering', 'Decoration', 'Travel', 'Misc'].includes(initialData.category);
      setFormData({
        name: initialData.name || '',
        category: isCustom ? 'Other' : (initialData.category || 'Catering'),
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
        category: 'Catering',
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
      setIsOther(value === 'Other');
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      category: isOther ? manualCategory : formData.category
    };
    onSubmit(finalData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="auth-glass w-full max-w-lg p-10 md:p-12 rounded-[2.5rem] relative shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black text-foreground tracking-tight">{initialData ? 'Edit Item' : 'Add New Item'}</h2>
            <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1 italic">Ceremony: <span className="text-foreground">{forcedEvent || formData.event}</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors text-foreground/40">
            <X size={28} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Name Field */}
          <div className="flex flex-col">
            <label className="block text-[10px] font-black text-primary/70 ml-2 mb-2 uppercase tracking-[0.2em]">Item Name</label>
            <div className="relative group">
              <Tag className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Stage Decor"
                className="input-field pl-16 h-14"
                required
              />
            </div>
          </div>

          {/* Category & Price Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col">
              <label className="block text-[10px] font-black text-primary/70 ml-2 mb-2 uppercase tracking-[0.2em]">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field shadow-sm appearance-none cursor-pointer h-14"
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
                <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors" size={20} />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0"
                  className="input-field pl-16 h-14"
                  required
                />
              </div>
            </div>
          </div>

          {/* Conditional Manual Category Input */}
          <AnimatePresence mode="popLayout">
            {isOther && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="flex flex-col"
              >
                <label className="block text-[10px] font-black text-secondary ml-2 mb-2 uppercase tracking-[0.2em]">Custom Category Name</label>
                <div className="relative group">
                  <PlusCircle className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary/30 group-focus-within:text-secondary transition-colors" size={20} />
                  <input
                    type="text"
                    value={manualCategory}
                    onChange={(e) => setManualCategory(e.target.value)}
                    placeholder="e.g., Photography, Jewelry..."
                    className="input-field pl-16 h-14 border-secondary/20 focus:ring-secondary/20 focus:border-secondary/40"
                    required
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Date Field */}
          <div className="flex flex-col">
            <label className="block text-[10px] font-black text-primary/70 ml-2 mb-2 uppercase tracking-[0.2em]">Date of Expense</label>
            <div 
              className="relative group cursor-pointer"
              onClick={() => dateInputRef.current?.showPicker()}
            >
              <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="date"
                name="date"
                ref={dateInputRef}
                value={formData.date}
                onChange={handleChange}
                className="input-field pl-16 cursor-pointer h-14"
                required
              />
            </div>
          </div>

          {/* Description Field */}
          <div className="flex flex-col">
            <label className="block text-[10px] font-black text-primary/70 ml-2 mb-2 uppercase tracking-[0.2em]">Brief Description</label>
            <div className="relative group">
              <AlignLeft className="absolute left-6 top-5 text-primary/30 group-focus-within:text-primary transition-colors" size={20} />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Include any important booking details..."
                className="input-field pl-16 h-28 resize-none pt-5"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-5 rounded-2xl border border-primary/10 text-primary font-black uppercase text-xs tracking-widest hover:bg-primary/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[2] btn-primary shadow-2xl shadow-primary/20"
            >
              <Save size={22} className="stroke-2" />
              <span className="tracking-widest uppercase font-black">{initialData ? 'Update Record' : 'Save Record'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ExpenseForm;
