import React, { useContext, useEffect, useState } from 'react';
import { Upload, FolderPlus, Grid, List } from 'lucide-react';
import { FileContext } from '../context/FileContext';
import FileCard from '../components/FileCard';
import UploadModal from '../components/UploadModal';
import ShareModal from '../components/ShareModal';
import OCRViewer from '../components/OCRViewer';
import Loading from '../components/Loading';
import { motion, AnimatePresence } from 'framer-motion';

const Files = () => {
  const { files, loading, fetchFiles, removeFile } = useContext(FileContext);
  const [view, setView] = useState('grid');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [shareFile, setShareFile] = useState(null);
  const [viewFile, setViewFile] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      removeFile(id);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col space-y-8 pb-10"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 tracking-tight mb-2">My Files</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Manage and organize your AI-analyzed documents</p>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center glass-panel rounded-xl p-1.5">
            <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-white dark:bg-slate-700 shadow-md text-brand-600 dark:text-brand-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
              <Grid size={18} />
            </button>
            <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white dark:bg-slate-700 shadow-md text-brand-600 dark:text-brand-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
              <List size={18} />
            </button>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 glass-panel text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <FolderPlus size={18} className="text-brand-500" />
            <span className="hidden sm:inline">New Folder</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsUploadOpen(true)} 
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-brand-500/30 border border-brand-400/50"
          >
            <Upload size={18} />
            Upload
          </motion.button>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : files.length === 0 ? (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center border-[3px] border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] glass-card min-h-[400px]"
        >
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-brand-500 blur-2xl opacity-20 rounded-full animate-pulse-slow"></div>
            <div className="relative w-24 h-24 bg-gradient-to-tr from-brand-100 to-accent-50 dark:from-slate-800 dark:to-slate-700 text-brand-600 dark:text-brand-400 rounded-3xl flex items-center justify-center shadow-xl rotate-3">
              <Upload size={40} />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-3 tracking-tight">No files uploaded yet</h3>
          <p className="text-slate-500 dark:text-slate-400 text-center max-w-md mb-8 font-medium">Upload your first document to let our AI automatically categorize, extract text, and unlock insights.</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsUploadOpen(true)} 
            className="bg-gradient-to-r from-brand-600 to-accent-500 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-xl shadow-brand-500/30"
          >
            Upload your first file
          </motion.button>
        </motion.div>
      ) : (
        <motion.div 
          layout
          className={view === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-4"}
        >
          <AnimatePresence>
            {files.map(file => (
              <FileCard 
                key={file._id} 
                file={file} 
                onDelete={handleDelete}
                onShare={setShareFile}
                onView={setViewFile}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onSuccess={() => fetchFiles()}
      />
      
      {shareFile && (
        <ShareModal 
          isOpen={true} 
          file={shareFile} 
          onClose={() => setShareFile(null)} 
        />
      )}

      {viewFile && (
        <OCRViewer
          isOpen={true}
          file={viewFile}
          onClose={() => setViewFile(null)}
        />
      )}
    </motion.div>
  );
};

export default Files;
