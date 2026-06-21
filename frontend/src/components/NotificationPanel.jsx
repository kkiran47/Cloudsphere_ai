import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Info, AlertTriangle } from 'lucide-react';
import { SocketContext } from '../context/SocketContext';

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (socket) {
      socket.on('notification', (data) => {
        setNotifications(prev => [data, ...prev]);
      });
    }
    return () => {
      if (socket) socket.off('notification');
    };
  }, [socket]);

  const getIcon = (type) => {
    switch(type) {
      case 'success': return <Check size={16} className="text-green-500" />;
      case 'warning': return <AlertTriangle size={16} className="text-amber-500" />;
      case 'error': return <AlertTriangle size={16} className="text-red-500" />;
      default: return <Info size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
      >
        <Bell size={20} />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50"
          >
            <div className="p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
              <h3 className="font-semibold text-sm">Notifications</h3>
              {notifications.length > 0 && (
                <button onClick={() => setNotifications([])} className="text-xs text-brand-600 hover:underline">Clear all</button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-sm">
                  No new notifications
                </div>
              ) : (
                notifications.map((notif, idx) => (
                  <div key={idx} className="p-3 border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-start gap-3 transition-colors">
                    <div className="mt-0.5">{getIcon(notif.type)}</div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{notif.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{notif.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationPanel;
