import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Search, 
  MessageSquare, 
  Settings, 
  ShieldAlert,
  LogOut,
  Cloud
} from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'My Files', icon: <FolderOpen size={20} />, path: '/files' },
    { name: 'Semantic Search', icon: <Search size={20} />, path: '/search' },
    { name: 'Chat with Files', icon: <MessageSquare size={20} />, path: '/chat' },
  ];

  if (user?.role === 'Admin') {
    navItems.push({ name: 'Admin Panel', icon: <ShieldAlert size={20} />, path: '/admin' });
  }

  return (
    <aside className="w-64 border-r border-white/20 dark:border-slate-700/50 glass-panel hidden lg:flex flex-col z-20">
      <div className="h-20 flex items-center px-6 border-b border-white/20 dark:border-slate-700/50">
        <div className="flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-500 font-extrabold text-2xl tracking-tight">
          <Cloud size={28} className="text-brand-600" />
          <span>CloudSphere</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-8 px-4 flex flex-col gap-3">
        <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-3">Main Menu</div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-medium ${
                isActive 
                ? 'text-white shadow-lg shadow-brand-500/20' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-brand-600 dark:hover:text-brand-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div 
                    layoutId="active-nav"
                    className="absolute inset-0 bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-3">
                  {item.icon}
                  <span>{item.name}</span>
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-white/20 dark:border-slate-700/50 flex flex-col gap-2 mb-4">
        <NavLink
          to="/settings"
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium ${
              isActive 
              ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50'
            }`
          }
        >
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all w-full text-left font-medium"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
