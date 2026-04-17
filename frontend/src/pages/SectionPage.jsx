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
    <div className="space-y-10 animate-in slide-in-from-bottom-5 duration-700 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="text-primary font-bold tracking-widest uppercase text-sm">{section} Page</span>
          <h1 className="text-5xl font-black text-foreground mt-1">{section} Expenses</h1>
        </div>
        <div className="flex gap-4">
          <button onClick={exportToCSV} className="flex items-center gap-2 px-6 py-3 bg-white/50 border border-primary/10 rounded-2xl hover:bg-white/80 transition-all font-bold text-primary shadow-sm">
            <Download size={20} /> Export
          </button>
          <button onClick={() => { setEditingExpense(null); setIsFormOpen(true); }} className="btn-primary flex items-center gap-2">
            <Plus size={22} /> Add New
          </button>
        </div>
      </header>

      <div className="glass-card p-10 flex flex-col md:flex-row items-center justify-between border-primary/5 highlight relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700" />
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center border border-primary/10 shadow-inner">
            <div className="text-primary"><IndianRupee size={32} /></div>
          </div>
          <div>
            <p className="text-xs text-primary font-black uppercase tracking-widest mb-1">Total Allocated</p>
            <p className="text-4xl font-black text-foreground">₹{totalAmount.toLocaleString()}</p>
          </div>
        </div>
        <div className="text-right border-l border-primary/5 pl-10 hidden md:block relative z-10">
          <p className="text-xs text-primary font-black uppercase tracking-widest mb-1">Items Listed</p>
          <p className="text-4xl font-black text-foreground">{filteredExpenses.length}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors" size={24} />
          <input type="text" placeholder="Search expenses..." className="input-field w-full pl-14 h-14 text-lg" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {categories.slice(0, 5).map(cat => (
            <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-6 py-4 rounded-2xl text-sm font-black whitespace-nowrap transition-all ${categoryFilter === cat ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-white/50 text-primary/60 hover:bg-white/80 border border-primary/5'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card overflow-hidden border border-primary/5 shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-primary/5 border-b border-primary/10">
              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-primary/50">Item Title</th>
              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-primary/50">Category</th>
              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-primary/50">Purchase Date</th>
              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-primary/50 text-right">Amount</th>
              <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-primary/50 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/5 bg-white/30 backdrop-blur-sm">
            <AnimatePresence>
              {filteredExpenses.length > 0 ? filteredExpenses.map((exp) => (
                <motion.tr key={exp._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-primary/[0.02] transition-colors group">
                  <td className="px-8 py-6 font-bold text-foreground">
                    <div>
                      <p className="text-lg">{exp.title}</p>
                      {exp.notes && <p className="text-xs text-primary/40 mt-1 font-medium">{exp.notes}</p>}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="bg-primary/10 px-4 py-2 rounded-xl text-xs font-black text-primary uppercase tracking-tighter shadow-sm">{exp.category}</span>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-foreground/50">
                    <div className="flex items-center gap-2"><Calendar size={18} className="text-primary/30" /> {new Date(exp.date).toLocaleDateString()}</div>
                  </td>
                  <td className="px-8 py-6 text-right font-black text-2xl text-primary-dark">₹{exp.amount.toLocaleString()}</td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex items-center justify-center gap-3 bg-white/50 border border-primary/5 rounded-2xl p-2 shadow-sm">
                      <button onClick={() => { setEditingExpense(exp); setIsFormOpen(true); }} className="p-2 hover:bg-primary/10 text-primary transition-colors rounded-xl"><Edit2 size={20} /></button>
                      <button onClick={() => handleDelete(exp._id)} className="p-2 hover:bg-red-50 text-red-400 transition-colors rounded-xl"><Trash2 size={20} /></button>
                    </div>
                  </td>
                </motion.tr>
              )) : (
                <tr><td colSpan="5" className="px-8 py-20 text-center text-primary/20 italic font-bold">No items found in this category.</td></tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <ExpenseForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleAddSubmit} initialData={editingExpense} />
    </div>
  );
};

export default SectionPage;
