import React, { useEffect, useState } from 'react';
import api from '../services/api';
import AnalyticsCards from '../components/AnalyticsCards';
import Loading from '../components/Loading';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get('/analytics');
        setStats(data.data);
      } catch (error) {
        console.error('Failed to load analytics', error);
      }
      setLoading(false);
    };

    fetchAnalytics();
  }, []);

  if (loading) return <Loading />;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-10"
    >
      <div className="flex flex-col mb-4">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 tracking-tight mb-2">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Overview of your storage and AI activities.</p>
      </div>

      <AnalyticsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8 rounded-3xl"
        >
          <div className="flex items-center justify-between mb-6 border-b border-slate-200/50 dark:border-slate-700/50 pb-4">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Recent AI Activity</h3>
            <span className="text-xs font-semibold px-3 py-1 bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 rounded-full">Live</span>
          </div>
          
          <div className="space-y-5">
            {stats?.recentActivity?.length > 0 ? (
              stats.recentActivity.map((activity, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (idx * 0.1) }}
                  key={idx} 
                  className="group flex items-start gap-4 p-3 rounded-2xl hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="mt-1.5 w-2.5 h-2.5 bg-gradient-to-tr from-brand-500 to-accent-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)] group-hover:scale-125 transition-transform"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      <span className="font-bold text-brand-600 dark:text-brand-400 mr-2">{activity.action}</span> 
                      {activity.details}
                    </p>
                    <span className="text-xs text-slate-400 mt-1 block">{new Date(activity.createdAt).toLocaleString()}</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-slate-500">No recent activity found. Upload files to see AI insights.</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-8 rounded-3xl"
        >
          <h3 className="text-xl font-bold mb-6 border-b border-slate-200/50 dark:border-slate-700/50 pb-4 text-slate-800 dark:text-white">Storage by Category</h3>
          <div className="space-y-6">
            {stats?.categoryBreakdown?.length > 0 ? (
              stats.categoryBreakdown.map((cat, idx) => (
                <motion.div 
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.4 + (idx * 0.1) }}
                  className="origin-left"
                  key={idx}
                >
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{cat._id}</span>
                    <span className="font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 px-2 py-0.5 rounded-lg">{cat.count} files</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700/50 rounded-full h-2.5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, cat.count * 10)}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.5 + (idx * 0.1) }}
                      className="bg-gradient-to-r from-brand-500 to-accent-500 h-full rounded-full" 
                    />
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-slate-500">Upload files to see AI category breakdown.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
