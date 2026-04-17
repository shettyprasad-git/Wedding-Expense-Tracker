import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Download, Table, Calendar, IndianRupee, Tag, Info, Filter, X } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import ExpenseForm from '../components/ExpenseForm';
import { motion, AnimatePresence } from 'framer-motion';

const SectionPage = ({ section }) => {
  const { 
    expenses, 
    loading, 
    addExpense, 
    updateExpense, 
    deleteExpense, 
    totals,
    dateRange,
    setDateRange,
    globalCategory,
    setGlobalCategory,
    exportAllToCSV,
    exportAllToPDF
  } = useExpenses();

  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'Hall Booking', 'Decorations', 'Catering / Food', 'Photography', 'Makeup / Dressing', 'Travel / Transport', 'Miscellaneous'];

  // Data is already filtered by Date and Global Category in the Context
  const sectionExpenses = expenses.filter(exp => exp.section === section);

  const filteredExpenses = sectionExpenses.filter(exp => {
    return exp.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleFormSubmit = async (formData) => {
    try {
      if (editingExpense) {
        await updateExpense(editingExpense._id, formData);
      } else {
        await addExpense({ ...formData, section });
      }
      setIsFormOpen(false);
      setEditingExpense(null);
    } catch (err) {
      alert('Failed to save expense');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
      } catch (err) {
        alert('Failed to delete expense');
      }
    }
  };

  return (
    <div className="space-y-8 md:space-y-12 animate-in slide-in-from-bottom-5 duration-700 pb-24">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-primary font-black tracking-widest uppercase text-xs italic opacity-70">{section} Management</span>
          <h1 className="text-4xl md:text-6xl font-black text-foreground mt-2 leading-none tracking-tight">{section}</h1>
        </div>
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <button 
            onClick={() => setShowFilters(!showFilters)} 
            className={`flex items-center justify-center gap-3 px-6 py-4 rounded-3xl transition-all font-black text-xs uppercase tracking-widest border ${showFilters ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-105' : 'bg-white/40 backdrop-blur-md border-white/40 text-primary hover:bg-white'}`}
          >
            <Filter size={18} /> Filters
          </button>
          <button 
            onClick={() => { setEditingExpense(null); setIsFormOpen(true); }} 
            className="flex-1 md:flex-none btn-primary shadow-2xl shadow-primary/30"
          >
            <Plus size={22} strokeWidth={3} /> <span className="uppercase tracking-widest">Add Item</span>
          </button>
        </div>
      </header>

      {/* Advanced Filters Drawer */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-6 md:p-8 border-primary/20 space-y-6">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-sm font-black text-primary uppercase tracking-widest">Advanced Filtering</h3>
                 <button onClick={() => { setDateRange({start: '', end: ''}); setGlobalCategory('All'); }} className="text-[10px] font-black text-foreground/40 hover:text-red-400 uppercase tracking-widest flex items-center gap-1 transition-colors">
                    <X size={14} /> Reset Filters
                 </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col">
                  <label className="text-[10px] font-black text-primary/50 uppercase tracking-widest mb-2">Start Date</label>
                  <input 
                    type="date" 
                    value={dateRange.start} 
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                    className="input-field h-12 text-sm border-white/40"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-black text-primary/50 uppercase tracking-widest mb-2">End Date</label>
                  <input 
                    type="date" 
                    value={dateRange.end} 
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                    className="input-field h-12 text-sm border-white/40"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-black text-primary/50 uppercase tracking-widest mb-2">Global Category</label>
                  <select 
                    value={globalCategory} 
                    onChange={(e) => setGlobalCategory(e.target.value)}
                    className="input-field h-12 text-sm border-white/40 cursor-pointer"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary Card */}
      <div className="glass-card p-8 md:p-12 relative overflow-hidden group border-white/40 shadow-2xl">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
          <div className="flex items-center gap-6 md:gap-10 w-full md:w-auto">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-white/40 shadow-2xl backdrop-blur-xl">
              <IndianRupee size={window.innerWidth < 768 ? 28 : 36} className="text-primary" />
            </div>
            <div>
              <p className="text-[10px] md:text-xs text-primary font-black uppercase tracking-[0.2em] mb-2 opacity-60">Total Spent in Section</p>
              <p className="text-4xl md:text-6xl font-black text-foreground tracking-tighter">₹{(totals[section] || 0).toLocaleString()}</p>
            </div>
          </div>
          <div className="w-full md:w-px h-px md:h-16 bg-white/20" />
          <div className="flex justify-between items-center w-full md:w-auto md:block text-center md:text-right">
            <div>
              <p className="text-[10px] md:text-xs text-primary font-black uppercase tracking-[0.2em] mb-2 opacity-60">Items Listed</p>
              <p className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">{sectionExpenses.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors" size={22} />
        <input 
          type="text" 
          placeholder="Search by name..." 
          className="input-field w-full pl-16 h-14 md:h-16 text-lg border-white/40" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>

      {/* Expense List Container */}
      <div className="glass-card border-white/40 shadow-2xl overflow-hidden backdrop-blur-2xl">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-primary/5 border-b border-white/20">
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-primary/50">Item Details</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-primary/50">Category</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-primary/50">Date</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-primary/50 text-right">Price</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-primary/50 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              <AnimatePresence mode="popLayout">
                {filteredExpenses.length > 0 ? filteredExpenses.map((exp) => (
                  <motion.tr 
                    key={exp._id} 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="hover:bg-white/30 transition-all group"
                  >
                    <td className="px-10 py-8">
                       <div className="flex items-start gap-4">
                        <div className="mt-1 p-2 bg-primary/10 rounded-lg text-primary"><Tag size={16} /></div>
                        <div>
                          <p className="text-xl font-black text-foreground tracking-tight">{exp.name}</p>
                          {exp.description && (
                            <div className="flex items-center gap-1.5 mt-1.5 text-primary/40 font-bold text-xs italic">
                              <Info size={12} /> {exp.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="bg-white/50 border border-white/40 px-5 py-2 rounded-2xl text-[10px] font-black text-primary uppercase tracking-wider shadow-sm">{exp.category}</span>
                    </td>
                    <td className="px-10 py-8 text-xs font-black text-foreground/40 italic">
                      <div className="flex items-center gap-2"><Calendar size={14} className="opacity-40" /> {new Date(exp.date).toLocaleDateString()}</div>
                    </td>
                    <td className="px-10 py-8 text-right font-black text-3xl text-primary tracking-tighter">₹{exp.price.toLocaleString()}</td>
                    <td className="px-10 py-8 text-center">
                       <div className="flex items-center justify-center gap-2 bg-white/40 border border-white/40 rounded-[1.5rem] p-2 shadow-inner">
                        <button onClick={() => { setEditingExpense(exp); setIsFormOpen(true); }} className="p-3 hover:bg-primary/20 text-primary transition-all rounded-xl hover:scale-110"><Edit2 size={18} /></button>
                        <button onClick={() => handleDelete(exp._id)} className="p-3 hover:bg-red-500/20 text-red-500 transition-all rounded-xl hover:scale-110"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </motion.tr>
                )) : (
                  <tr><td colSpan="5" className="px-10 py-24 text-center text-primary/30 italic font-black text-xs uppercase tracking-[0.2em]">No expenses found for this selection</td></tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-white/10">
          <AnimatePresence mode="popLayout">
            {filteredExpenses.length > 0 ? filteredExpenses.map((exp) => (
              <motion.div 
                key={exp._id} 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-8 space-y-6"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="text-2xl font-black text-foreground leading-tight">{exp.name}</p>
                    <div className="flex items-center gap-2 mt-2">
                       <span className="bg-primary/10 border border-primary/10 px-3 py-1 rounded-lg text-[10px] font-black text-primary uppercase">{exp.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-primary tracking-tighter">₹{exp.price.toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-foreground/40 italic mt-1 flex items-center justify-end gap-1">
                      <Calendar size={12} /> {new Date(exp.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {exp.description && (
                  <div className="bg-primary/5 rounded-2xl p-4 border border-white/40 italic">
                    <p className="text-[11px] text-primary/60 font-medium leading-relaxed">"{exp.description}"</p>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => { setEditingExpense(exp); setIsFormOpen(true); }} 
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-white/40 border border-white/40 rounded-2xl text-primary font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-md active:scale-95"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(exp._id)} 
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-500/20 transition-all shadow-md active:scale-95"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </motion.div>
            )) : (
              <div className="p-16 text-center text-primary/30 italic font-black text-xs uppercase tracking-[0.2em]">No items found</div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ExpenseForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} initialData={editingExpense} />
    </div>
  );
};

export default SectionPage;
