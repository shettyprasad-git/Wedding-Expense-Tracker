import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExpense } from '../context/ExpenseContext';
import ExpenseForm from '../components/ExpenseForm';
import { 
  Plus, ArrowLeft, Trash2, Edit3, 
  IndianRupee, Tag, Calendar, AlignLeft,
  ChevronRight, MoreVertical, Search,
  Filter, DownloadCloud, AlertCircle,
  Target, TrendingDown, Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import BudgetModal from '../components/BudgetModal';

const EventPage = ({ eventType: propEventType }) => {
  const { type: paramEventType } = useParams();
  const eventType = propEventType || paramEventType;
  const navigate = useNavigate();
  const { expenses, deleteExpense, addExpense, updateExpense, fetchEventExpenses } = useExpense();
  
  const { user } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const eventExpenses = expenses.filter(exp => exp.event === eventType);
  const filteredExpenses = eventExpenses.filter(exp => 
    exp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const total = eventExpenses.reduce((sum, exp) => sum + exp.price, 0);

  // Map eventType to the correct budget key (First letter uppercase matches User.js)
  const budgetKey = eventType ? eventType.charAt(0).toUpperCase() + eventType.slice(1).toLowerCase() : null;
  const ceremonyBudget = user?.budgets?.[budgetKey] || 0;
  const isOverBudget = ceremonyBudget > 0 && total > ceremonyBudget;
  const remainingBudget = ceremonyBudget - total;
  const isRemainingPositive = remainingBudget >= 0;

  useEffect(() => {
    fetchEventExpenses(eventType);
  }, [eventType]);

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingExpense(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this expense record?')) {
      await deleteExpense(id);
    }
  };

  const handleFormSubmit = async (formData) => {
    if (editingExpense) {
      await updateExpense(editingExpense._id, formData);
    } else {
      await addExpense(formData);
    }
    setIsFormOpen(false);
    setEditingExpense(null);
  };

  return (
    <div className="space-y-10">
      {/* Ceremony Header */}
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-colors italic group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase italic mb-2">
              {eventType} <span className="text-primary/20 italic">Expenses</span>
            </h1>
            <div className="flex items-center gap-3">
               <div className="px-3 py-1 bg-primary/10 rounded-full border border-primary/10">
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none italic">{eventExpenses.length} Items Indexed</p>
               </div>
               <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] italic underline decoration-primary/10 decoration-2 underline-offset-4">
                 Full Ceremony Portfolio
               </p>
            </div>
          </div>
        </div>

        {/* Financial Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Ceremony Budget */}
            <div className={`auth-glass p-6 md:p-8 rounded-[2.5rem] border ${isOverBudget ? 'border-red-500/20' : 'border-white/60'} shadow-xl flex items-center gap-6 group relative overflow-hidden transition-all h-[110px]`}>
                <div className={`w-12 h-12 ${isOverBudget ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'} rounded-2xl flex items-center justify-center transition-colors`}>
                    <Target size={24} />
                </div>
                <div className="flex-1">
                    <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest leading-none mb-1.5 italic">Ceremony Budget</p>
                    <div className="flex items-center gap-2">
                        <h2 className={`text-2xl font-black ${isOverBudget ? 'text-red-500' : 'text-foreground'} tracking-tighter italic leading-none`}>₹{ceremonyBudget.toLocaleString()}</h2>
                        <button 
                            onClick={() => setIsBudgetModalOpen(true)}
                            className="p-1.5 bg-primary/5 rounded-lg text-primary opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-white"
                        >
                            <Edit3 size={12} />
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Total Ceremony Spend */}
            <div className="auth-glass p-6 md:p-8 rounded-[2.5rem] border-white/60 shadow-xl flex items-center gap-6 h-[110px]">
                <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                    <TrendingDown size={24} />
                </div>
                <div>
                    <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest leading-none mb-1.5 italic">Total Spent</p>
                    <h2 className="text-2xl font-black text-foreground tracking-tighter italic leading-none">₹{total.toLocaleString()}</h2>
                </div>
            </div>

            {/* 3. Remaining Balance */}
            <div className="auth-glass p-6 md:p-8 rounded-[2.5rem] border-white/60 shadow-xl flex items-center gap-6 h-[110px]">
                <div className={`w-12 h-12 ${isRemainingPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'} rounded-2xl flex items-center justify-center transition-colors`}>
                    <Wallet size={24} />
                </div>
                <div>
                    <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest leading-none mb-1.5 italic">Remaining</p>
                    <h2 className={`text-2xl font-black ${isRemainingPositive ? 'text-emerald-600' : 'text-red-600'} tracking-tighter italic leading-none`}>
                        {isRemainingPositive ? `₹${remainingBudget.toLocaleString()}` : `-₹${Math.abs(remainingBudget).toLocaleString()}`}
                    </h2>
                </div>
            </div>

            {/* 4. Add Item Action */}
            <button 
                onClick={handleAddNew}
                className="btn-primary h-[110px] rounded-[2.5rem] shadow-2xl shadow-primary/30 flex flex-col items-center justify-center gap-1 group w-full"
            >
                <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                <span className="text-[10px] uppercase font-black tracking-widest">Add Item</span>
            </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Search items, categories or vendors..."
            className="input-field pl-16 h-16 bg-white/40"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
           <button className="h-16 w-16 bg-white/40 backdrop-blur-3xl border border-white/60 rounded-3xl flex items-center justify-center text-primary/40 hover:text-primary transition-all">
              <Filter size={20} />
           </button>
           <button className="h-16 w-16 bg-white/40 backdrop-blur-3xl border border-white/60 rounded-3xl flex items-center justify-center text-primary/40 hover:text-primary transition-all">
              <DownloadCloud size={20} />
           </button>
        </div>
      </div>

      {/* Main Content Area: Responsive Toggle */}
      <div className="space-y-6">
        {filteredExpenses.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-4">
                    <thead>
                        <tr className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 italic px-6">
                            <th className="pb-4 pl-8">Item Description</th>
                            <th className="pb-4">Category</th>
                            <th className="pb-4">Date</th>
                            <th className="pb-4">Amount</th>
                            <th className="pb-4 text-right pr-8">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpenses.map((exp) => (
                            <motion.tr 
                                key={exp._id}
                                layout
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="group"
                            >
                                <td className="bg-white/40 backdrop-blur-3xl border-y border-l border-white/60 rounded-l-[2rem] p-6 pl-8">
                                    <div>
                                        <p className="font-black text-foreground tracking-tight uppercase italic">{exp.name}</p>
                                        <p className="text-[10px] font-medium text-primary/40 uppercase truncate max-w-xs">{exp.description || 'No notes provided'}</p>
                                    </div>
                                </td>
                                <td className="bg-white/40 backdrop-blur-3xl border-y border-white/60 p-6">
                                    <span className="px-4 py-1.5 bg-primary/5 border border-primary/10 rounded-full text-[10px] font-black text-primary uppercase tracking-widest italic">
                                        {exp.category}
                                    </span>
                                </td>
                                <td className="bg-white/40 backdrop-blur-3xl border-y border-white/60 p-6 text-xs font-black text-primary/60 uppercase tracking-widest italic">
                                    {new Date(exp.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                </td>
                                <td className="bg-white/40 backdrop-blur-3xl border-y border-white/60 p-6">
                                    <p className="text-xl font-black text-foreground tracking-tighter italic underline decoration-primary/5">₹{exp.price.toLocaleString()}</p>
                                </td>
                                <td className="bg-white/40 backdrop-blur-3xl border-y border-r border-white/60 rounded-r-[2rem] p-6 text-right pr-8">
                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleEdit(exp)}
                                            className="p-3 bg-primary/10 rounded-xl text-primary hover:bg-primary hover:text-white transition-all shadow-lg"
                                        >
                                            <Edit3 size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(exp._id)}
                                            className="p-3 bg-red-500/10 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredExpenses.map((exp) => (
                    <motion.div 
                        key={exp._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="auth-glass p-8 rounded-[2.5rem] space-y-6 relative overflow-hidden group"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-xl font-black text-foreground tracking-tight underline italic decoration-primary/5">{exp.name}</h4>
                                <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest">{exp.category}</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(exp)} className="p-2.5 bg-primary/5 rounded-xl text-primary"><Edit3 size={16} /></button>
                                <button onClick={() => handleDelete(exp._id)} className="p-2.5 bg-red-500/5 rounded-xl text-red-500"><Trash2 size={16} /></button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/40 rounded-2xl border border-white/60">
                                <p className="text-[8px] font-black text-primary/30 uppercase tracking-widest mb-1 leading-none italic">Amount Paid</p>
                                <p className="text-lg font-black text-foreground tracking-tighter italic">₹{exp.price.toLocaleString()}</p>
                            </div>
                            <div className="p-4 bg-white/40 rounded-2xl border border-white/60">
                                <p className="text-[8px] font-black text-primary/30 uppercase tracking-widest mb-1 leading-none italic">Event Date</p>
                                <p className="text-[13px] font-black text-primary uppercase italic">{new Date(exp.date).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {exp.description && (
                            <p className="text-[10px] font-medium text-primary/60 italic leading-relaxed line-clamp-2">
                                "{exp.description}"
                            </p>
                        )}
                    </motion.div>
                ))}
            </div>
          </>
        ) : (
          /* Empty State Illustration */
          <div className="py-24 flex flex-col items-center text-center">
             <div className="w-32 h-32 bg-primary/5 rounded-[2.5rem] flex items-center justify-center text-primary/20 mb-8 animate-float">
                <AlertCircle size={64} />
             </div>
             <h3 className="text-2xl font-black text-foreground uppercase italic tracking-tight mb-2">No Expense Records</h3>
             <p className="text-[10px] font-black uppercase text-primary/30 tracking-[0.3em] mb-12 max-w-sm italic">
                It looks like you haven't detailed any expenditures for this ceremony yet. 
                Start by indexing your first item.
             </p>
             <button 
                onClick={handleAddNew}
                className="btn-primary px-12 py-5 rounded-2xl shadow-xl shadow-primary/20"
             >
                <Plus size={18} />
                <span className="tracking-widest uppercase font-black text-xs">Create First Record</span>
             </button>
          </div>
        )}
      </div>

      <ExpenseForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleFormSubmit}
        initialData={editingExpense}
        forcedEvent={eventType}
      />
      <BudgetModal 
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        eventName={budgetKey}
        currentBudget={ceremonyBudget}
      />
    </div>
  );
};

export default EventPage;
