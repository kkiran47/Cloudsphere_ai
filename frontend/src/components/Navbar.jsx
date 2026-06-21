import React, { useContext, useEffect, useState } from 'react';
import { Menu, Search, Bell, User as UserIcon, Moon, Sun } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check local storage or system preference on mount
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  return (
    <header className="h-20 border-b border-slate-200/50 dark:border-slate-700/50 glass-panel flex items-center justify-between px-6 lg:px-10 z-10 sticky top-0">
      <div className="flex items-center gap-6">
        <button className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
          <Menu size={24} />
        </button>
        <div className="hidden md:flex items-center gap-3 bg-slate-100/80 dark:bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-inner focus-within:ring-2 focus-within:ring-brand-500/30 transition-all w-80">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search files using natural language..." 
            className="bg-transparent border-none focus:outline-none text-sm w-full text-slate-700 dark:text-slate-200 placeholder-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleDarkMode}
          className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
        >
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-accent-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
        </motion.button>
        
        <div className="flex items-center gap-4 pl-5 border-l border-slate-200 dark:border-slate-700">
          <Link to="/profile" className="hidden md:block text-right group">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-brand-500 transition-colors">{user?.name || 'User'}</p>
            <p className="text-xs font-medium text-brand-600 dark:text-brand-400">{user?.role || 'Guest'}</p>
          </Link>
          <Link to="/profile">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-600 to-accent-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30 cursor-pointer"
            >
              <UserIcon size={20} />
            </motion.div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
