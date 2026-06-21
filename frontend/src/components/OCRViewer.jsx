import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Loader2 } from 'lucide-react';
import { getFileInsights } from '../services/ai';

const OCRViewer = ({ isOpen, onClose, file }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && file) {
      fetchInsights();
    }
  }, [isOpen, file]);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await getFileInsights(file._id);
      setInsights(res.data);
    } catch (error) {
      console.error('Failed to fetch insights', error);
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
          >
            <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileText size={20} className="text-brand-500" />
                File Details: {file?.originalName}
              </h2>
              <button onClick={onClose} className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 flex overflow-hidden">
              {/* Left Side: Preview */}
              <div className="w-1/2 bg-slate-100 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 p-4 flex items-center justify-center">
                {file?.mimetype?.startsWith('image') ? (
                  <img src={file.cloudinaryUrl} alt="Preview" className="max-w-full max-h-full object-contain shadow-md rounded-lg" />
                ) : (
                  <div className="text-center text-slate-500">
                    <FileText size={64} className="mx-auto mb-4 opacity-50" />
                    <p>Preview not available for this file type</p>
                    <a href={file?.cloudinaryUrl} target="_blank" rel="noreferrer" className="text-brand-500 hover:underline mt-2 inline-block">Download to view</a>
                  </div>
                )}
              </div>

              {/* Right Side: AI Insights */}
              <div className="w-1/2 p-6 overflow-y-auto custom-scrollbar">
                <h3 className="text-xl font-bold mb-6 text-brand-600 dark:text-brand-400">AI Analysis & Extraction</h3>
                
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-40 space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
                    <p className="text-slate-500">Extracting intelligence...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">Category</h4>
                      <span className="bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 px-3 py-1 rounded-full text-sm font-medium">
                        {insights?.category || file?.category || 'Uncategorized'}
                      </span>
                    </div>

                    {insights?.summary && (
                      <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">AI Summary</h4>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-sm leading-relaxed whitespace-pre-wrap border border-slate-100 dark:border-slate-700">
                          {insights.summary}
                        </div>
                      </div>
                    )}

                    {(insights?.extractedText || file?.extractedText) && (
                      <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">Extracted Text (OCR)</h4>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs leading-relaxed font-mono overflow-x-auto whitespace-pre-wrap border border-slate-100 dark:border-slate-700 max-h-60 overflow-y-auto">
                          {insights?.extractedText || file?.extractedText}
                        </div>
                      </div>
                    )}

                    {insights?.metadata && (
                      <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">Structured Entities</h4>
                        <pre className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs overflow-x-auto border border-slate-100 dark:border-slate-700">
                          {JSON.stringify(insights.metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    {!insights?.summary && !insights?.extractedText && (
                      <p className="text-slate-500 italic text-sm">No AI insights generated for this file yet. Background processing may still be running.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OCRViewer;
