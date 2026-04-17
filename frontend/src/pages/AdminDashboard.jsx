import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Ticket, Bell, Send, CheckCircle2, AlertCircle, Clock, Search, Filter, Mail, User as UserIcon, Settings, Trash2 } from 'lucide-react';
import api from '../utils/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [notifications, setNotifications] = useState({ userId: '', message: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [msgStatus, setMsgStatus] = useState({ show: false, text: '', type: 'success' });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'users') {
        const res = await api.get('/admin/users');
        setUsers(res.data);
      } else if (activeTab === 'tickets') {
        const res = await api.get('/support/admin/tickets');
        setTickets(res.data);
      }
    } catch (err) {
      console.error('❌ Fetch Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTicket = async (id, status) => {
    try {
      await api.put(`/support/admin/tickets/${id}`, { status });
      setTickets(tickets.map(t => t._id === id ? { ...t, status } : t));
      showToast('Status Updated Successfully', 'success');
    } catch (err) {
      showToast('Update Failed', 'error');
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    try {
      await api.post('/notifications/admin', notifications);
      setNotifications({ userId: '', message: '' });
      showToast('Broadcast Dispatched!', 'success');
    } catch (err) {
      showToast('Broadcast Failed', 'error');
    }
  };

  const showToast = (text, type) => {
    setMsgStatus({ show: true, text, type });
    setTimeout(() => setMsgStatus({ show: false, text: '', type: 'success' }), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase italic mb-2 flex items-center gap-4">
            Command Center <Settings className="text-secondary" size={32} />
          </h1>
          <p className="text-xs font-black text-primary/40 uppercase tracking-[0.3em] italic">Manage system registries, inquiries, and broadcasts</p>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex bg-white/40 p-1.5 rounded-2xl border border-white/60 shadow-inner backdrop-blur-xl">
           <button 
             onClick={() => setActiveTab('users')}
             className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'users' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-primary/40 hover:text-primary'}`}
           >
             <Users size={14} /> Planners
           </button>
           <button 
             onClick={() => setActiveTab('tickets')}
             className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'tickets' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-primary/40 hover:text-primary'}`}
           >
             <Ticket size={14} /> Inquiries
           </button>
           <button 
             onClick={() => setActiveTab('notify')}
             className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'notify' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-primary/40 hover:text-primary'}`}
           >
             <Bell size={14} /> Broadcast
           </button>
        </div>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
               key="loading"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="flex flex-col items-center justify-center py-40"
            >
               <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
               <p className="mt-4 text-[10px] font-black text-primary/40 uppercase tracking-widest italic">Decrypting Registries...</p>
            </motion.div>
          ) : activeTab === 'users' ? (
            <motion.div 
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
               <div className="auth-glass overflow-hidden rounded-[2.5rem] border border-white/60">
                 <table className="w-full text-left">
                   <thead className="bg-primary/5 border-b border-primary/5">
                     <tr>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-primary/40 italic">Identity</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-primary/40 italic">Contact Details</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-primary/40 italic">System Role</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-primary/40 italic">Registry Entry</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-primary/5">
                     {users.map((u) => (
                       <tr key={u._id} className="hover:bg-primary/[0.02] transition-colors group">
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-2xl bg-primary/10 overflow-hidden border border-primary/10 flex items-center justify-center">
                                  {u.profileImage ? (
                                    <img src={u.profileImage} alt={u.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <UserIcon size={18} className="text-primary/30" />
                                  )}
                               </div>
                               <div>
                                  <p className="text-sm font-black text-foreground uppercase italic tracking-tight">{u.name}</p>
                                  <p className="text-[9px] font-black text-primary/40 uppercase tracking-widest">{u.weddingRole || 'General Planner'}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <div className="space-y-1">
                               <div className="flex items-center gap-2 text-[10px] font-medium text-foreground/60">
                                  <Mail size={12} className="text-primary/30" /> {u.email}
                               </div>
                               {u.phone && (
                                 <div className="flex items-center gap-2 text-[10px] font-medium text-foreground/60">
                                    <Clock size={12} className="text-primary/30" /> {u.phone}
                                 </div>
                               )}
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                               {u.role}
                            </span>
                         </td>
                         <td className="px-8 py-6 text-[10px] font-medium text-foreground/40 italic">
                            {new Date(u.createdAt).toLocaleDateString()}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </motion.div>
          ) : activeTab === 'tickets' ? (
            <motion.div 
              key="tickets"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
               <div className="grid grid-cols-1 gap-6">
                  {tickets.map((t) => (
                    <div key={t._id} className="auth-glass p-8 rounded-[2.5rem] border border-white/60 relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-8">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            t.priority === 'High' ? 'bg-red-500/10 text-red-500' : 
                            t.priority === 'Medium' ? 'bg-orange-500/10 text-orange-500' : 
                            'bg-blue-500/10 text-blue-500'
                          }`}>
                            {t.priority} UI
                          </span>
                       </div>

                       <div className="flex flex-col md:flex-row gap-8 items-start">
                          <div className="w-full md:w-2/3 space-y-4">
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                   <Ticket size={18} />
                                </div>
                                <h3 className="text-xl font-black text-foreground uppercase italic tracking-tight">{t.subject}</h3>
                             </div>
                             <p className="text-xs font-medium text-foreground/60 leading-relaxed pr-10">{t.description}</p>
                             
                             <div className="flex items-center gap-6 pt-4 border-t border-primary/5">
                                <div className="flex items-center gap-2">
                                   <UserIcon size={14} className="text-primary/20" />
                                   <p className="text-[10px] font-black text-primary uppercase tracking-widest">{t.userId?.name}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                   <Mail size={14} className="text-primary/20" />
                                   <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest italic">{t.userId?.email}</p>
                                </div>
                             </div>
                          </div>

                          <div className="w-full md:w-1/3 space-y-6 pt-6 md:pt-0 md:pl-8 md:border-l border-primary/5">
                             <p className="text-[10px] font-black text-primary/30 uppercase tracking-[0.2em] italic mb-4">Lifecycle Status</p>
                             <div className="grid grid-cols-1 gap-3">
                                {['open', 'in-progress', 'resolved'].map((s) => (
                                  <button
                                    key={s}
                                    onClick={() => handleUpdateTicket(t._id, s)}
                                    className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all text-left flex items-center justify-between group ${
                                      t.status === s ? 'bg-primary text-white' : 'bg-white hover:bg-primary/5 text-primary/40'
                                    }`}
                                  >
                                    {s}
                                    {t.status === s && <CheckCircle2 size={12} />}
                                  </button>
                                ))}
                             </div>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          ) : (
            <motion.div 
               key="notify"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="max-w-2xl mx-auto"
            >
               <div className="auth-glass p-12 rounded-[4rem] border border-white/60 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl" />
                  <div className="flex items-center gap-4 mb-10">
                     <div className="w-14 h-14 bg-secondary/10 rounded-[1.5rem] flex items-center justify-center text-secondary">
                        <Bell size={28} />
                     </div>
                     <div>
                        <h3 className="text-2xl font-black text-foreground uppercase italic tracking-tight">Broadcast Center</h3>
                        <p className="text-[10px] font-black text-secondary uppercase tracking-widest italic">Dispatch global alerts or individual mandates</p>
                     </div>
                  </div>

                  <form onSubmit={handleSendNotification} className="space-y-8">
                     <div className="flex flex-col gap-3">
                        <label className="text-[11px] font-black text-secondary/60 px-2 uppercase tracking-[0.2em] italic">Target Audience</label>
                        <select 
                          className="input-field w-full border-secondary/10 focus:border-secondary focus:ring-secondary/5"
                          value={notifications.userId}
                          onChange={(e) => setNotifications({ ...notifications, userId: e.target.value })}
                        >
                           <option value="">Global Broadcast (All Planners)</option>
                           {users.map(u => (
                             <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                           ))}
                        </select>
                        <p className="px-2 text-[9px] font-medium text-secondary/40 italic">Leave as Global to notify every user in the registry.</p>
                     </div>

                     <div className="flex flex-col gap-3">
                        <label className="text-[11px] font-black text-secondary/60 px-2 uppercase tracking-[0.2em] italic">Dispatch Message</label>
                        <textarea 
                          required
                          className="input-field w-full h-40 resize-none pt-6 border-secondary/10 focus:border-secondary focus:ring-secondary/5"
                          placeholder="Compose your administrative message here..."
                          value={notifications.message}
                          onChange={(e) => setNotifications({ ...notifications, message: e.target.value })}
                        />
                     </div>

                     <button type="submit" className="w-full btn-primary bg-secondary hover:bg-secondary/90 py-7 rounded-[2.5rem] shadow-2xl shadow-secondary/20 border-none">
                        <span className="flex items-center justify-center gap-4 tracking-[0.4em] font-black uppercase text-sm italic">
                          INITIATE BROADCAST <Send size={20} className="stroke-[3]" />
                        </span>
                     </button>
                  </form>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {msgStatus.show && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-10 right-10 px-8 py-5 rounded-[2rem] shadow-2xl z-[100] border backdrop-blur-3xl flex items-center gap-4 ${
              msgStatus.type === 'success' ? 'bg-secondary text-white border-secondary/20' : 'bg-red-500 text-white border-red-500/20'
            }`}
          >
             <CheckCircle2 size={24} className="stroke-[3]" />
             <span className="text-xs font-black uppercase tracking-widest italic">{msgStatus.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
