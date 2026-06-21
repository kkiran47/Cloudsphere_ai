import React from 'react';
import { Database, FileIcon, Layers, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const formatSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const AnalyticsCards = ({ stats }) => {
  if (!stats) return null;

  const storageUsed = stats.storageUsed || 0;
  const storageLimit = stats.storageLimit || 5368709120; // 5GB default
  const percentage = Math.min(100, Math.round((storageUsed / storageLimit) * 100));

  const cards = [
    {
      title: 'Total Files',
      value: stats.totalFiles || 0,
      icon: <FileIcon size={26} className="text-white" />,
      gradient: 'from-blue-500 to-cyan-400',
      shadow: 'shadow-blue-500/30'
    },
    {
      title: 'Storage Used',
      value: formatSize(storageUsed),
      subtext: `${percentage}% of ${formatSize(storageLimit)}`,
      icon: <Database size={26} className="text-white" />,
      gradient: 'from-brand-600 to-indigo-500',
      shadow: 'shadow-brand-500/30',
      progress: percentage
    },
    {
      title: 'AI Tasks Run',
      value: (stats.recentActivity || []).length * 12, // mock metric for demo
      icon: <Zap size={26} className="text-white" />,
      gradient: 'from-amber-500 to-orange-400',
      shadow: 'shadow-orange-500/30'
    },
    {
      title: 'Categories',
      value: (stats.categoryBreakdown || []).length,
      icon: <Layers size={26} className="text-white" />,
      gradient: 'from-emerald-500 to-teal-400',
      shadow: 'shadow-emerald-500/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className={`relative overflow-hidden rounded-3xl p-6 glass-card shadow-lg ${card.shadow}`}
        >
          {/* Background subtle gradient mesh */}
          <div className={`absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br ${card.gradient} opacity-10 rounded-full blur-2xl`}></div>
          
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">{card.title}</p>
              <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">{card.value}</h3>
              {card.subtext && <p className="text-xs font-medium text-slate-400 mt-2">{card.subtext}</p>}
            </div>
            <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${card.gradient} shadow-lg ${card.shadow}`}>
              {card.icon}
            </div>
          </div>
          {card.progress !== undefined && (
            <div className="mt-5 w-full bg-slate-200 dark:bg-slate-700/50 rounded-full h-2 relative overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${card.progress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${percentage > 90 ? 'from-rose-500 to-red-500' : 'from-brand-500 to-cyan-400'}`} 
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default AnalyticsCards;
