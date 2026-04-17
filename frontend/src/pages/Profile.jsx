import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Heart, Save, Edit, ArrowLeft, Camera, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MALE_AVATAR = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop';
const FEMALE_AVATAR = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    profileImage: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.weddingRole || 'Planner',
        profileImage: user.profileImage || ''
      });
      if (user.profileImage !== MALE_AVATAR && user.profileImage !== FEMALE_AVATAR) {
        setCustomAvatarUrl(user.profileImage);
      }
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile(formData);
      setSuccess(true);
      setIsEditing(false);
      setShowAvatarPicker(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('❌ Update Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectMode = (mode) => {
    if (mode === 'male') setFormData({ ...formData, profileImage: MALE_AVATAR });
    if (mode === 'female') setFormData({ ...formData, profileImage: FEMALE_AVATAR });
    if (mode === 'custom') setFormData({ ...formData, profileImage: customAvatarUrl });
  };

  const handleCustomUrlChange = (url) => {
    setCustomAvatarUrl(url);
    setFormData({ ...formData, profileImage: url });
  };

  return (
    <div className="max-w-6xl mx-auto py-4 space-y-12">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase italic mb-2 flex items-center gap-4">
            Identity Hub <User className="text-primary" size={32} />
          </h1>
          <p className="text-xs font-black text-primary/40 uppercase tracking-[0.3em] italic">Manage your planner credentials and expert reach</p>
        </div>
        
        <button 
          onClick={() => {
            if (isEditing) setShowAvatarPicker(false);
            setIsEditing(!isEditing);
          }}
          className={`px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center gap-3 ${isEditing ? 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-lg shadow-red-500/5' : 'btn-primary shadow-xl shadow-primary/20'}`}
        >
          {isEditing ? (
            <>Abandon Changes</>
          ) : (
            <><Edit size={16} className="stroke-[3]" /> Refine Profile</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Avatar & Summary */}
        <div className="space-y-8">
          <div className="auth-glass p-10 rounded-[3rem] relative overflow-hidden text-center group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
             
             <div className="relative mx-auto w-48 h-48 mb-8 group/avatar">
                <div className="w-full h-full bg-primary/5 rounded-[3rem] overflow-hidden border-2 border-primary/20 flex items-center justify-center relative shadow-inner">
                  {formData.profileImage ? (
                    <motion.img 
                      key={formData.profileImage}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      src={formData.profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <User size={80} className="text-primary/20" />
                  )}
                </div>
                {isEditing && (
                  <button 
                    onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                    className="absolute inset-0 bg-primary/90 backdrop-blur-md rounded-[3rem] flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all cursor-pointer z-10 scale-95 group-hover/avatar:scale-100"
                  >
                    <div className="text-center text-white">
                      <Camera className="mx-auto mb-2" size={36} />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em]">Switch Visual</p>
                    </div>
                  </button>
                )}
             </div>

             <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase italic mb-1">{formData.name}</h2>
             <p className="text-[11px] font-black text-primary/40 uppercase tracking-[0.3em] italic mb-8 decoration-primary/20 underline underline-offset-8 decoration-2 italic">{formData.role}</p>
             
             <div className="pt-8 border-t border-primary/5 space-y-5">
                <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                  <span className="text-primary/20 italic">Authentication</span>
                  <span className="text-green-500 flex items-center gap-2 bg-green-500/5 px-3 py-1 rounded-full"><CheckCircle2 size={12} /> SECURE</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                  <span className="text-primary/20 italic">System Access</span>
                  <span className="text-secondary bg-secondary/10 px-3 py-1 rounded-full">{user?.role?.toUpperCase() || 'USER'}</span>
                </div>
             </div>
          </div>
          
          <AnimatePresence>
            {success && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-green-500/10 border border-green-500/20 text-green-600 p-8 rounded-[2.5rem] text-center shadow-lg shadow-green-600/5"
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <CheckCircle2 size={24} className="stroke-[3]" />
                  <span className="text-xs font-black uppercase tracking-widest">Registry Sync Complete</span>
                </div>
                <p className="text-[10px] font-medium opacity-70">Your wedding planner profile is now updated in the master vault.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: details */}
        <div className="lg:col-span-2">
           <AnimatePresence mode="wait">
             {showAvatarPicker ? (
               <motion.div 
                 key="avatar-picker"
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="auth-glass p-12 rounded-[4rem] relative overflow-hidden"
               >
                 <div className="flex items-center justify-between mb-12">
                   <div>
                     <h3 className="text-2xl font-black text-foreground uppercase tracking-tight italic mb-1">Select Identity Mode</h3>
                     <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Choose a preset or upload your custom vision</p>
                   </div>
                   <button onClick={() => setShowAvatarPicker(false)} className="bg-primary/5 hover:bg-primary/10 p-4 rounded-2xl text-primary transition-all flex items-center gap-2">
                      <ArrowLeft size={18} />
                   </button>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* Male Option */}
                    <button 
                      onClick={() => selectMode('male')}
                      className={`relative group rounded-[3rem] overflow-hidden border-4 transition-all ${formData.profileImage === MALE_AVATAR ? 'border-primary shadow-2xl shadow-primary/20 scale-105' : 'border-white hover:border-primary/20 grayscale hover:grayscale-0'}`}
                    >
                       <img src={MALE_AVATAR} alt="Male Preset" className="w-full h-64 object-cover" />
                       <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                          <p className="text-xs font-black text-white uppercase tracking-widest italic">Male Identity</p>
                       </div>
                    </button>

                    {/* Female Option */}
                    <button 
                      onClick={() => selectMode('female')}
                      className={`relative group rounded-[3rem] overflow-hidden border-4 transition-all ${formData.profileImage === FEMALE_AVATAR ? 'border-primary shadow-2xl shadow-primary/20 scale-105' : 'border-white hover:border-primary/20 grayscale hover:grayscale-0'}`}
                    >
                       <img src={FEMALE_AVATAR} alt="Female Preset" className="w-full h-64 object-cover" />
                       <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                          <p className="text-xs font-black text-white uppercase tracking-widest italic">Female Identity</p>
                       </div>
                    </button>

                    {/* Custom Mode */}
                    <div 
                      className={`p-6 rounded-[3rem] border-4 flex flex-col items-center justify-center text-center transition-all ${ (formData.profileImage !== MALE_AVATAR && formData.profileImage !== FEMALE_AVATAR) ? 'border-secondary bg-secondary/5 rotate-1' : 'border-white bg-white/40'}`}
                    >
                       <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-4">
                          <Camera size={32} />
                       </div>
                       <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-4">Custom Vision</p>
                       <input 
                         type="text" 
                         placeholder="Image URL..." 
                         className="w-full bg-white px-4 py-3 rounded-xl text-[10px] font-medium focus:ring-2 focus:ring-secondary/20 outline-none border border-secondary/10"
                         value={customAvatarUrl}
                         onChange={(e) => handleCustomUrlChange(e.target.value)}
                         onFocus={() => selectMode('custom')}
                       />
                    </div>
                 </div>

                 <button 
                    onClick={() => setShowAvatarPicker(false)}
                    className="w-full btn-primary py-6 text-sm tracking-[0.3em]"
                 >
                    CONFIRM SELECTION <CheckCircle2 size={18} />
                 </button>
               </motion.div>
             ) : (
               <motion.div 
                 key="details-form"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="auth-glass p-12 rounded-[4rem] relative overflow-hidden"
               >
                 <div className="absolute top-0 right-0 w-48 h-1 bg-gradient-to-l from-primary/20 to-transparent" />
                 
                 <form onSubmit={handleSubmit} className="space-y-10">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="flex flex-col gap-3">
                       <label className="text-[11px] font-black text-primary/60 px-2 uppercase tracking-[0.2em] italic">Full Legal Name</label>
                       <div className="relative group">
                          <User className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/20 group-focus-within:text-primary transition-colors" size={18} />
                          <input
                            type="text"
                            disabled={!isEditing}
                            className="input-field w-full pl-14 bg-white/40 disabled:opacity-50"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                       </div>
                     </div>

                     <div className="flex flex-col gap-3">
                       <label className="text-[11px] font-black text-primary/60 px-2 uppercase tracking-[0.2em] italic">Cloud Registry Email</label>
                       <div className="relative group opacity-60">
                          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                          <input
                            type="email"
                            disabled={true}
                            className="input-field w-full pl-14 bg-white/20 cursor-not-allowed"
                            value={formData.email}
                          />
                       </div>
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="flex flex-col gap-3">
                       <label className="text-[11px] font-black text-primary/60 px-2 uppercase tracking-[0.2em] italic">Mobile Contact</label>
                       <div className="relative group">
                          <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/20" size={18} />
                          <input
                            type="text"
                            disabled={!isEditing}
                            className="input-field w-full pl-14 bg-white/40"
                            placeholder="+91 XXXXX XXXXX"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                       </div>
                     </div>

                     <div className="flex flex-col gap-3">
                       <label className="text-[11px] font-black text-primary/60 px-2 uppercase tracking-[0.2em] italic">Wedding Designation</label>
                       <div className="relative">
                          <Heart className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/20 pointer-events-none" size={18} />
                          <select
                            disabled={!isEditing}
                            className="input-field w-full pl-14 bg-white/40 appearance-none cursor-pointer"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          >
                            <option value="Planner">Managing Planner</option>
                            <option value="Brother">Brother of Couple</option>
                            <option value="Sister">Sister of Couple</option>
                            <option value="Associate">Wedding Associate</option>
                            <option value="Other">External Partner</option>
                          </select>
                       </div>
                     </div>
                   </div>

                   {isEditing && (
                     <motion.div 
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       className="pt-10"
                     >
                       <button
                         type="submit"
                         disabled={isLoading}
                         className="w-full btn-primary py-7 rounded-[2rem] shadow-2xl shadow-primary/20"
                       >
                         {isLoading ? (
                           <CheckCircle2 className="animate-spin mx-auto text-white" size={24} />
                         ) : (
                           <span className="flex items-center justify-center gap-4 tracking-[0.4em] font-black uppercase text-sm italic">
                             <Save size={20} className="stroke-[3]" /> PERSIST GLOBAL IDENTITY
                           </span>
                         )}
                       </button>
                     </motion.div>
                   )}
                 </form>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>

      {/* Contact Experts Section */}
      <div className="space-y-8">
        <div className="flex items-center gap-6">
           <h3 className="text-2xl font-black text-foreground uppercase tracking-tight italic">Contact Design Experts</h3>
           <div className="h-px flex-1 bg-gradient-to-r from-primary/10 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* GitHub */}
           <a 
             href="https://github.com/shettyprasad-git" 
             target="_blank" 
             rel="noopener noreferrer"
             className="auth-glass p-8 rounded-[2.5rem] group hover:bg-black hover:text-white transition-all overflow-hidden relative"
           >
              <Github className="absolute -right-4 -bottom-4 w-24 h-24 text-primary/5 group-hover:text-white/5 transition-colors rotate-12" />
              <div className="flex items-center justify-between mb-6">
                 <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <User size={24} />
                 </div>
                 <ChevronRight size={16} className="text-primary/30 group-hover:text-white/50" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 group-hover:text-white/40 mb-1">Source Architect</p>
              <h4 className="text-lg font-black uppercase italic tracking-tight">GitHub Profile</h4>
           </a>

           {/* LinkedIn */}
           <a 
             href="https://www.linkedin.com/in/durgaprasadshetty/" 
             target="_blank" 
             rel="noopener noreferrer"
             className="auth-glass p-8 rounded-[2.5rem] group hover:bg-[#0077b5] hover:text-white transition-all overflow-hidden relative"
           >
              <Linkedin className="absolute -right-4 -bottom-4 w-24 h-24 text-[#0077b5]/5 group-hover:text-white/5 transition-colors rotate-12" />
              <div className="flex items-center justify-between mb-6">
                 <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <User size={24} />
                 </div>
                 <ChevronRight size={16} className="text-primary/30 group-hover:text-white/50" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 group-hover:text-white/40 mb-1">Professional Lead</p>
              <h4 className="text-lg font-black uppercase italic tracking-tight">LinkedIn Connect</h4>
           </a>

           {/* Email */}
           <a 
             href="mailto:prasadshetty1275@gmail.com"
             className="auth-glass p-8 rounded-[2.5rem] group hover:bg-primary hover:text-white transition-all overflow-hidden relative"
           >
              <Mail className="absolute -right-4 -bottom-4 w-24 h-24 text-primary/5 group-hover:text-white/5 transition-colors rotate-12" />
              <div className="flex items-center justify-between mb-6">
                 <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <Mail size={24} />
                 </div>
                 <ArrowRight size={16} className="text-primary/30 group-hover:text-white/50 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 group-hover:text-white/40 mb-1">Direct Counsel</p>
              <h4 className="text-lg font-black uppercase italic tracking-tight">Send Inquiry Email</h4>
           </a>
        </div>
      </div>
    </div>
  );
};

export default Profile;
