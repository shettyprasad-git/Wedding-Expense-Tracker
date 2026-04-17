import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, ArrowLeft, LogOut, IndianRupee, Tag, Info, Calendar } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import ExpenseForm from '../components/ExpenseForm';
import { motion, AnimatePresence } from 'framer-motion';

const EventPage = ({ eventType }) => {
  const { expenses, loading, addExpense, updateExpense, deleteExpense, totals, fetchExpenses } = useExpenses();
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // Strictly filter items for this specific ceremony
  const eventExpenses = expenses.filter(exp => exp.event?.toLowerCase() === eventType.toLowerCase());

  const filteredExpenses = eventExpenses.filter(exp => 
    exp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFormSubmit = async (formData) => {
    try {
      if (editingExpense) {
        await updateExpense(editingExpense._id, { ...formData, event: eventType });
      } else {
        await addExpense({ ...formData, event: eventType });
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-10 md:space-y-14 animate-in slide-in-from-bottom-5 duration-700 pb-24">
      {/* Header with Navigation and Branding */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-white/10 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/20 shadow-2xl">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-4 bg-white/20 hover:bg-white/40 rounded-2xl transition-all text-primary"
          >
            <ArrowLeft size={24} strokeWidth={3} />
          </button>
          <div>
            <span className="text-primary font-black tracking-widest uppercase text-[10px] italic opacity-70">Wedding Ceremony</span>
            <h1 className="text-3xl md:text-5xl font-black text-foreground capitalize tracking-tighter leading-none">{eventType} Expenses</h1>
          </div>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <button 
             onClick={handleLogout}
             className="flex flex-1 md:flex-none items-center justify-center gap-2 px-6 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl transition-all font-black text-xs uppercase tracking-widest border border-red-500/10"
          >
            <LogOut size={18} /> Logout
          </button>
          <button 
            onClick={() => { setEditingExpense(null); setIsFormOpen(true); }}
            className="flex-1 md:flex-none btn-primary shadow-2xl shadow-primary/20"
          >
            <Plus size={20} strokeWidth={3} /> <span className="uppercase tracking-widest">Add Expense</span>
          </button>
        </div>
      </header>

      {/* Ceremony Total Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-10 md:p-12 border-primary/20 bg-primary/5 shadow-2xl flex items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full translate-x-12 -translate-y-12 blur-3xl" />
          <div className="w-20 h-20 rounded-[1.75rem] bg-primary/20 flex items-center justify-center border border-primary/20 shadow-inner">
             <IndianRupee size={32} className="text-primary" />
          </div>
          <div>
            <p className="text-[10px] text-primary/60 font-black uppercase tracking-[0.2em] mb-1">Ceremony Total Spent</p>
            <p className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">₹{(totals[eventType.toLowerCase()] || 0).toLocaleString()}</p>
          </div>
        </div>

        <div className="glass-card p-10 md:p-12 border-white/40 shadow-2xl flex items-center gap-8">
           <div className="w-20 h-20 rounded-[1.75rem] bg-white/40 flex items-center justify-center border border-white/60">
              <Tag size={32} className="text-primary" />
           </div>
           <div>
              <p className="text-[10px] text-primary/60 font-black uppercase tracking-[0.2em] mb-1">Total Items Logged</p>
              <p className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">{eventExpenses.length}</p>
           </div>
        </div>
      </div>

      {/* Search and Content */}
      <div className="space-y-8">
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors" size={22} />
          <input 
            type="text" 
            placeholder={`Search ${eventType} expenses...`} 
            className="input-field w-full pl-16 h-14 md:h-16 text-lg" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>

        <div className="glass-card border-white/40 shadow-2xl overflow-hidden backdrop-blur-3xl">
          {filteredExpenses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-primary/5 border-b border-white/10">
                  <tr>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Details</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Category</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 text-right">Price</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredExpenses.map((exp) => (
                    <tr key={exp._id} className="hover:bg-white/30 transition-all group">
                      <td className="px-10 py-8">
                        <div>
                          <p className="text-xl font-black text-foreground tracking-tight">{exp.name}</p>
                          {exp.description && (
                            <p className="text-xs font-bold text-primary/40 italic flex items-center gap-1.5 mt-1">
                              <Info size={12} /> {exp.description}
                            </p>
                          )}
                          <p className="text-[10px] font-medium text-foreground/20 mt-2 uppercase tracking-widest flex items-center gap-1.5">
                             <Calendar size={12} /> {new Date(exp.date).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className="bg-white/60 border border-white/60 px-5 py-2 rounded-2xl text-[10px] font-black text-primary uppercase tracking-widest shadow-sm">
                          {exp.category}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <p className="text-3xl font-black text-primary tracking-tighter">₹{exp.price.toLocaleString()}</p>
                      </td>
                      <td className="px-10 py-8 text-center">
                        <div className="inline-flex items-center gap-2 bg-white/40 border border-white/40 rounded-2xl p-2 shadow-inner">
                          <button onClick={() => { setEditingExpense(exp); setIsFormOpen(true); }} className="p-3 hover:bg-primary/20 text-primary transition-all rounded-xl hover:scale-110"><Edit2 size={16} /></button>
                          <button onClick={() => handleDelete(exp._id)} className="p-3 hover:bg-red-500/20 text-red-500 transition-all rounded-xl hover:scale-110"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-32 text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Tag size={40} className="text-primary/20" />
              </div>
              <p className="text-sm font-black text-primary/30 uppercase tracking-[0.2em] italic">No expenses yet for {eventType}</p>
              <button 
                onClick={() => { setEditingExpense(null); setIsFormOpen(true); }}
                className="mt-6 text-primary hover:underline text-[10px] font-black uppercase tracking-widest"
              >
                Let's add the first one
              </button>
            </div>
          )}
        </div>
      </div>

      <ExpenseForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleFormSubmit} 
        initialData={editingExpense} 
        forcedEvent={eventType}
      />
    </div>
  );
};

export default EventPage;
