import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Send, MessageSquare, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import api from '../utils/api';

const Support = () => {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'Medium'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.post('/support', formData);
      setSuccess(true);
      setFormData({ subject: '', description: '', priority: 'Medium' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit ticket');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase italic mb-2 flex items-center gap-4">
            Support Center <HelpCircle className="text-primary animate-float" size={32} />
          </h1>
          <p className="text-xs font-black text-primary/40 uppercase tracking-[0.3em] italic">Get expert help with your wedding planning investment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Info */}
        <div className="space-y-6">
          <div className="auth-glass p-8 rounded-[2.5rem] relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
            <h3 className="text-xl font-black text-foreground uppercase italic mb-4">How it works</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-black text-primary">01</span>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">Submit Ticket</p>
                  <p className="text-xs font-medium text-foreground/70">Fill out the form with your query and priority level.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-black text-primary">02</span>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">Expert Review</p>
                  <p className="text-xs font-medium text-foreground/70">Our admin team analyzes your request based on priority.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-black text-primary">03</span>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">Resolution</p>
                  <p className="text-xs font-medium text-foreground/70">Get notified via the dashboard bell once resolved.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-black/5 rounded-[2rem] border border-black/5">
             <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="text-primary/40" size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">SLA Guarantee</span>
             </div>
             <p className="text-[10px] font-medium text-foreground/50">High priority tickets are typically reviewed within 4-12 hours of submission during business rotations.</p>
          </div>
        </div>

        {/* Right: Form */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="auth-glass p-12 rounded-[3.5rem] text-center"
              >
                <div className="w-20 h-20 bg-green-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="text-green-500" size={40} />
                </div>
                <h3 className="text-2xl font-black text-foreground uppercase italic mb-3">Ticket Dispatched!</h3>
                <p className="text-xs font-medium text-foreground/50 mb-8 px-6">Your inquiry has been logged in our secure vault. Keep an eye on your notification bell for updates.</p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="btn-primary"
                >
                  Raise Another Inquiry <ArrowRight size={18} />
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="auth-glass p-10 md:p-14 rounded-[3.5rem] relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-black text-primary/60 px-1 uppercase tracking-[0.2em] italic">Inquiry Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Budget calculation discrepancy"
                      className="input-field w-full"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                      <label className="text-[11px] font-black text-primary/60 px-1 uppercase tracking-[0.2em] italic">Urgency / Priority</label>
                      <select
                        className="input-field w-full appearance-none cursor-pointer"
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      >
                        <option value="Low">Low - Feedback Only</option>
                        <option value="Medium">Medium - Regular Help</option>
                        <option value="High">High - Critical Issue</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-black text-primary/60 px-1 uppercase tracking-[0.2em] italic">Detailed Description</label>
                    <textarea
                      required
                      placeholder="Describe your issue or request in detail..."
                      className="input-field w-full h-40 resize-none pt-6"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary py-6"
                  >
                    {isLoading ? (
                      <Send className="animate-pulse" />
                    ) : (
                      <>Commit Ticket <Send size={18} /></>
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Support;
