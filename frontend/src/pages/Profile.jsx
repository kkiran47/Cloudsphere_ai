import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Database, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-8 pt-6 pb-12"
    >
      <div className="flex flex-col mb-4">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 tracking-tight mb-2">My Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your personal information and storage.</p>
      </div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
        className="glass-card p-10 rounded-[2.5rem] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-brand-500/20 to-transparent dark:from-brand-500/10 rounded-bl-full pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10 relative z-10 text-center md:text-left">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-32 h-32 rounded-[2rem] bg-gradient-to-tr from-brand-600 to-accent-500 text-white flex items-center justify-center text-6xl font-extrabold shadow-2xl shadow-brand-500/40"
          >
            {user.name.charAt(0).toUpperCase()}
          </motion.div>
          <div className="flex-1 mt-2">
            <h2 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">{user.name}</h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
              <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2 font-medium bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-xl">
                <Mail size={18} className="text-brand-500" /> {user.email}
              </p>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-xl text-sm font-bold uppercase tracking-widest border border-brand-200 dark:border-brand-500/20">
                <Shield size={16} /> {user.role}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-slate-200/50 dark:border-slate-700/50 relative z-10">
          <div className="bg-slate-50/50 dark:bg-slate-800/50 p-6 rounded-3xl border border-white/50 dark:border-slate-700/50">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-3">
              <div className="p-2 bg-brand-100 dark:bg-brand-900/30 text-brand-600 rounded-lg"><Database size={18} /></div> 
              Storage Overview
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 font-medium">Storage Used</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">{(user.storageUsed / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 font-medium">Total Limit</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">{(user.storageLimit / 1024 / 1024 / 1024).toFixed(2)} GB</p>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (user.storageUsed / user.storageLimit) * 100)}%` }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="bg-gradient-to-r from-brand-500 to-accent-500 h-full rounded-full" 
                  />
                </div>
                <p className="text-xs text-right text-slate-500 mt-2 font-medium">
                  {((user.storageUsed / user.storageLimit) * 100).toFixed(1)}% Used
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
