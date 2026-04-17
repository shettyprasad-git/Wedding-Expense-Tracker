import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, Download, Table, Calendar, IndianRupee } from 'lucide-react';
import { json2csv } from 'json-2-csv';
import api from '../utils/api';
import ExpenseForm from '../components/ExpenseForm';
import { motion, AnimatePresence } from 'framer-motion';

const SectionPage = ({ section }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const categories = ['All', 'Hall Booking', 'Decorations', 'Catering / Food', 'Photography', 'Makeup / Dressing', 'Travel / Transport', 'Miscellaneous'];

  useEffect(() => { fetchExpenses(); }, [section]);

  const fetchExpenses = async () => {
    try {
      const res = await api.get(`/expenses/section/${section}`);
      setExpenses(res.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const handleAddSubmit = async (formData) => {
    try {
      if (editingExpense) await api.put(`/expenses/${editingExpense._id}`, formData);
      else await api.post('/expenses', { ...formData, section });
      fetchExpenses();
      setIsFormOpen(false);
      setEditingExpense(null);
    } catch (err) { alert('Failed to save'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this expense?')) {
      try { await api.delete(`/expenses/${id}`); fetchExpenses(); } 
      catch (err) { alert('Failed to delete'); }
    }
  };

  const exportToCSV = () => {
     try {
       const csv = json2csv(filteredExpenses.map(e => ({
         Title: e.title, Category: e.category, Amount: e.amount, Date: new Date(e.date).toLocaleDateString(), Notes: e.notes || ''
       })));
       const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
       const link = document.createElement('a');
       link.href = URL.createObjectURL(blob);
       link.download = `${section}_Expenses.csv`;
       link.click();
     } catch (err) { console.error(err); }
  };

  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || exp.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  if (loading) return <div className="flex h-[50vh] items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" /></div>;

  return (
    <div className="space-y-6 md:space-y-10 animate-in slide-in-from-bottom-5 duration-700 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-primary font-bold tracking-widest uppercase text-xs md:text-sm italic">{section} Page</span>
          <h1 className="text-3xl md:text-5xl font-black text-foreground mt-1 leading-tight">{section} Expenses</h1>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={exportToCSV} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white/50 border border-primary/10 rounded-2xl hover:bg-white/80 transition-all font-bold text-primary shadow-sm text-sm">
            <Download size={18} /> Export
          </button>
          <button onClick={() => { setEditingExpense(null); setIsFormOpen(true); }} className="flex-1 md:flex-none btn-primary flex items-center justify-center gap-2 text-sm">
            <Plus size={20} /> Add New
          </button>
        </div>
      </header>

      <div className="glass-card p-6 md:p-10 flex flex-col md:flex-row items-center justify-between border-primary/5 highlight relative overflow-hidden group gap-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700" />
        <div className="flex items-center gap-4 md:gap-8 relative z-10 w-full md:w-auto shadow-sm md:shadow-none p-4 md:p-0 rounded-2xl md:rounded-none">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-[2rem] bg-primary/10 flex items-center justify-center border border-primary/10 shadow-inner shrink-0">
            <div className="text-primary"><IndianRupee size={window.innerWidth < 768 ? 24 : 32} /></div>
          </div>
          <div>
            <p className="text-[10px] md:text-xs text-primary font-black uppercase tracking-widest mb-1">Total Allocated</p>
            <p className="text-2xl md:text-4xl font-black text-foreground">₹{totalAmount.toLocaleString()}</p>
          </div>
        </div>
        <div className="text-center md:text-right border-t md:border-t-0 md:border-l border-primary/5 pt-6 md:pt-0 md:pl-10 w-full md:w-auto relative z-10 flex md:block justify-between items-center">
          <p className="text-[10px] md:text-xs text-primary font-black uppercase tracking-widest mb-1">Items Listed</p>
          <p className="text-2xl md:text-4xl font-black text-foreground">{filteredExpenses.length}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors" size={20} />
          <input type="text" placeholder="Search..." className="input-field w-full pl-14 h-12 md:h-14 text-md md:text-lg" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-4 md:pb-0 no-scrollbar -mx-2 px-2 md:mx-0 md:px-0">
          {categories.slice(0, 5).map(cat => (
            <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-5 py-3 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-sm font-black whitespace-nowrap transition-all ${categoryFilter === cat ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/50 text-primary/60 hover:bg-white/80 border border-primary/5'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card border border-primary/5 shadow-2xl relative overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left min-w-[600px] md:min-w-full">
            <thead>
              <tr className="bg-primary/5 border-b border-primary/10">
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] md:text-xs font-black uppercase tracking-widest text-primary/50">Item Title</th>
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] md:text-xs font-black uppercase tracking-widest text-primary/50">Category</th>
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] md:text-xs font-black uppercase tracking-widest text-primary/50">Date</th>
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] md:text-xs font-black uppercase tracking-widest text-primary/50 text-right">Amount</th>
                <th className="px-6 md:px-8 py-4 md:py-6 text-[10px] md:text-xs font-black uppercase tracking-widest text-primary/50 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5 bg-white/30 backdrop-blur-sm">
              <AnimatePresence>
                {filteredExpenses.length > 0 ? filteredExpenses.map((exp) => (
                  <motion.tr key={exp._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-primary/[0.02] transition-colors group">
                    <td className="px-6 md:px-8 py-4 md:py-6 font-bold text-foreground">
                      <div>
                        <p className="text-md md:text-lg">{exp.title}</p>
                        {exp.notes && <p className="text-[10px] text-primary/40 mt-0.5 font-medium">{exp.notes}</p>}
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6">
                      <span className="bg-primary/10 px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl text-[10px] font-black text-primary uppercase tracking-tighter shadow-sm">{exp.category}</span>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6 text-[10px] md:text-sm font-bold text-foreground/50">
                      <div className="flex items-center gap-2 truncate"><Calendar size={14} className="text-primary/30" /> {new Date(exp.date).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-6 text-right font-black text-xl md:text-2xl text-primary-dark whitespace-nowrap">₹{exp.amount.toLocaleString()}</td>
                    <td className="px-6 md:px-8 py-4 md:py-6 text-center">
                      <div className="flex items-center justify-center gap-2 bg-white/50 border border-primary/5 rounded-xl md:rounded-2xl p-1 md:p-2 shadow-sm">
                        <button onClick={() => { setEditingExpense(exp); setIsFormOpen(true); }} className="p-1.5 md:p-2 hover:bg-primary/10 text-primary transition-colors rounded-lg md:rounded-xl"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(exp._id)} className="p-1.5 md:p-2 hover:bg-red-50 text-red-400 transition-colors rounded-lg md:rounded-xl"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </motion.tr>
                )) : (
                  <tr><td colSpan="5" className="px-8 py-20 text-center text-primary/20 italic font-bold">No items found.</td></tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      <ExpenseForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleAddSubmit} initialData={editingExpense} />
    </div>
  );
};

export default SectionPage;
