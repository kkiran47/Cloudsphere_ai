import React from 'react';
import { File, FileText, Image as ImageIcon, Video, Trash2, Share2, Eye, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const FileCard = ({ file, onDelete, onShare, onView }) => {
  const getIcon = () => {
    if (file.mimetype.startsWith('image')) return <ImageIcon size={32} className="text-cyan-500" />;
    if (file.mimetype.startsWith('video')) return <Video size={32} className="text-accent-500" />;
    if (file.mimetype === 'application/pdf') return <FileText size={32} className="text-rose-500" />;
    return <File size={32} className="text-brand-500" />;
  };

  const getCategoryColor = (category) => {
    const cats = {
      'Resume': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
      'Invoice': 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
      'Contract': 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
      'Other': 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400'
    };
    return cats[category] || cats['Other'];
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="glass-card p-5 rounded-3xl flex flex-col group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/40 to-transparent dark:from-white/5 opacity-50 rounded-bl-full pointer-events-none"></div>

      <div className="flex items-start justify-between mb-5 relative z-10">
        <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-inner rounded-2xl border border-white/50 dark:border-slate-700/50">
          {getIcon()}
        </div>
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
          <motion.button whileHover={{ scale: 1.1 }} onClick={() => onView(file)} className="p-2 text-slate-500 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/20 rounded-xl transition-colors">
            <Eye size={18} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} onClick={() => onShare(file)} className="p-2 text-slate-500 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/20 rounded-xl transition-colors">
            <Share2 size={18} />
          </motion.button>
          <motion.a whileHover={{ scale: 1.1 }} href={file.cloudinaryUrl} download={file.originalName} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/20 rounded-xl transition-colors">
            <Download size={18} />
          </motion.a>
          <motion.button whileHover={{ scale: 1.1 }} onClick={() => onDelete(file._id)} className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/20 rounded-xl transition-colors">
            <Trash2 size={18} />
          </motion.button>
        </div>
      </div>
      <div className="flex-1 relative z-10">
        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 truncate mb-1" title={file.originalName}>
          {file.originalName}
        </h3>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <span>{formatSize(file.size)}</span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
          <span>{new Date(file.createdAt).toLocaleDateString()}</span>
        </p>
      </div>
      <div className="mt-5 pt-4 border-t border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center relative z-10">
        <span className={`text-[11px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-lg shadow-sm ${getCategoryColor(file.category)}`}>
          {file.category}
        </span>
        {file.isDuplicate && (
          <span className="text-[11px] uppercase tracking-widest font-bold text-amber-700 bg-amber-100 dark:bg-amber-500/20 dark:text-amber-400 px-3 py-1.5 rounded-lg shadow-sm">
            Duplicate
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default FileCard;
