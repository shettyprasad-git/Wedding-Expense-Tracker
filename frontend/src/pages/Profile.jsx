import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Heart, Save, Edit, ArrowLeft, Camera, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const avatars = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
  'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop'
];

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
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
        role: user.role || 'Planner',
        profileImage: user.profileImage || ''
      });
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

  const selectAvatar = (url) => {
    setFormData({ ...formData, profileImage: url });
    setShowAvatarPicker(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-4">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase italic mb-2">My Profile</h1>
          <p className="text-xs font-black text-primary/40 uppercase tracking-[0.3em] italic">Manage your account and wedding details</p>
        </div>
        
        <button 
          onClick={() => {
            if (isEditing) setShowAvatarPicker(false);
            setIsEditing(!isEditing);
          }}
          className={`px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center gap-3 ${isEditing ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'btn-primary'}`}
        >
          {isEditing ? (
            <>Cancel Edit</>
          ) : (
            <><Edit size={16} className="stroke-[3]" /> Edit Profile</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Avatar & Summary */}
        <div className="space-y-8">
          <div className="auth-glass p-8 rounded-[2.5rem] relative overflow-hidden text-center">
             <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
             
             <div className="relative mx-auto w-40 h-40 mb-6 group">
                <div className="w-full h-full bg-primary/10 rounded-[2.5rem] overflow-hidden border-2 border-primary/20 flex items-center justify-center relative">
                  {formData.profileImage ? (
                    <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={64} className="text-primary/30" />
                  )}
                </div>
                {isEditing && (
                  <button 
                    onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                    className="absolute inset-0 bg-primary/80 backdrop-blur-sm rounded-[2.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                  >
                    <div className="text-center text-white">
                      <Camera className="mx-auto mb-1" size={32} />
                      <p className="text-[10px] font-black uppercase tracking-widest">Change</p>
                    </div>
                  </button>
                )}
             </div>

             <h2 className="text-2xl font-black text-foreground tracking-tight uppercase italic">{formData.name}</h2>
             <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.3em] italic mb-6">{formData.role}</p>
             
             <div className="pt-6 border-t border-primary/5 space-y-4">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-primary/30">Email Persistence</span>
                  <span className="text-green-500 flex items-center gap-1.5"><CheckCircle2 size={12} /> Verified</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-primary/30">Marriage Role</span>
                  <span className="text-primary">{formData.role}</span>
                </div>
             </div>
          </div>
          
          <AnimatePresence>
            {success && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-green-500/10 border border-green-500/20 text-green-600 p-6 rounded-[2rem] text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <CheckCircle2 size={20} className="stroke-[3]" />
                  <span className="text-xs font-black uppercase tracking-widest">Profile Updated!</span>
                </div>
                <p className="text-[10px] font-medium opacity-70">Your changes are now live across the platform.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Form & Avatar Selector */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {showAvatarPicker ? (
              <motion.div 
                key="avatar-picker"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="auth-glass p-10 md:p-14 rounded-[3rem] relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-2xl font-black text-foreground uppercase tracking-tight italic decoration-primary/10 underline underline-offset-8">Select Your Identity</h3>
                  <button onClick={() => setShowAvatarPicker(false)} className="text-primary/40 hover:text-primary transition-colors uppercase text-[10px] font-black tracking-widest flex items-center gap-2">
                    <ArrowLeft size={14} /> Back to details
                  </button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {avatars.map((url, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => selectAvatar(url)}
                      className={`relative w-full aspect-square rounded-3xl overflow-hidden border-4 transition-all ${formData.profileImage === url ? 'border-primary ring-4 ring-primary/10' : 'border-transparent hover:border-primary/20'}`}
                    >
                      <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                      {formData.profileImage === url && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center backdrop-blur-[1px]">
                          <CheckCircle2 className="text-white" size={32} />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="details-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="auth-glass p-10 md:p-14 rounded-[3rem] relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col">
                      <label className="block text-[11px] font-black text-primary/60 ml-2 mb-3 uppercase tracking-[0.2em] italic">Full Legal Name</label>
                      <div className="relative group">
                        <User className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors" size={20} />
                        <input
                          type="text"
                          disabled={!isEditing}
                          className="input-field pl-16 h-16 bg-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="block text-[11px] font-black text-primary/60 ml-2 mb-3 uppercase tracking-[0.2em] italic">Contact Email</label>
                      <div className="relative group">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors" size={20} />
                        <input
                          type="email"
                          disabled={true}
                          className="input-field pl-16 h-16 bg-white/20 opacity-50 cursor-not-allowed"
                          value={formData.email}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col">
                      <label className="block text-[11px] font-black text-primary/60 ml-2 mb-3 uppercase tracking-[0.2em] italic">Phone Number</label>
                      <div className="relative group">
                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors" size={20} />
                        <input
                          type="text"
                          disabled={!isEditing}
                          className="input-field pl-16 h-16 bg-white/40 disabled:opacity-50"
                          placeholder="+91 XXXXX XXXXX"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="block text-[11px] font-black text-primary/60 ml-2 mb-3 uppercase tracking-[0.2em] italic">Wedding Role</label>
                      <div className="relative group focus-within:ring-4 focus-within:ring-primary/10 rounded-3xl transition-all">
                        <Heart className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors" size={20} />
                        <select
                          disabled={!isEditing}
                          className="input-field pl-16 h-16 bg-white/40 appearance-none disabled:opacity-50 cursor-pointer"
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                          <option value="Planner">Head Planner</option>
                          <option value="Brother">Brother of Groom/Bride</option>
                          <option value="Sister">Sister of Groom/Bride</option>
                          <option value="Other">Wedding Associate</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="pt-6">
                       <button
                         type="button"
                         onClick={() => setShowAvatarPicker(true)}
                         className="w-full p-6 bg-primary/5 border border-dashed border-primary/20 rounded-3xl flex items-center justify-between group hover:bg-primary/10 transition-all"
                       >
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-2xl bg-white overflow-hidden border-2 border-primary/10">
                                {formData.profileImage ? (
                                  <img src={formData.profileImage} alt="Selected" className="w-full h-full object-cover" />
                                ) : (
                                  <User size={20} className="text-primary/30 mx-auto mt-3" />
                                )}
                             </div>
                             <div className="text-left">
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none mb-1">Visual Identity</p>
                                <p className="text-xs font-black text-foreground uppercase italic tracking-tight">Choose Curated Avatar</p>
                             </div>
                          </div>
                          <ChevronRight className="text-primary/40 group-hover:translate-x-1 transition-transform" />
                       </button>
                    </div>
                  )}

                  {isEditing && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="pt-10 flex gap-4"
                    >
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-[2] btn-primary py-6 rounded-3xl shadow-2xl shadow-primary/30"
                      >
                        {isLoading ? (
                          <CheckCircle2 className="animate-spin mx-auto text-white" size={24} />
                        ) : (
                          <span className="flex items-center gap-3 tracking-[0.3em] font-black uppercase text-sm italic">
                            <Save size={20} className="stroke-[3]" /> Commit Changes
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
    </div>
  );
};

export default Profile;
