import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link as LinkIcon, Check, Copy } from 'lucide-react';
import { createShareLink } from '../services/file';

const ShareModal = ({ isOpen, onClose, file }) => {
  const [isPublic, setIsPublic] = useState(false);
  const [password, setPassword] = useState('');
  const [expiresInDays, setExpiresInDays] = useState('');
  const [shareLink, setShareLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    setLoading(true);
    try {
      const payload = { fileId: file._id, isPublic, password, expiresInDays };
      const res = await createShareLink(payload);
      const link = `${window.location.origin}/shared/${res.data.linkId}`;
      setShareLink(link);
    } catch (error) {
      alert('Error creating share link');
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const reset = () => {
    setShareLink(null);
    setIsPublic(false);
    setPassword('');
    setExpiresInDays('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
          >
            <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <LinkIcon size={20} className="text-brand-500" />
                Share File
              </h2>
              <button onClick={reset} className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-slate-500 mb-4 truncate">Sharing: <span className="font-medium text-slate-800 dark:text-slate-200">{file?.originalName}</span></p>

              {!shareLink ? (
                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} className="w-4 h-4 text-brand-600 rounded" />
                    <div>
                      <p className="font-medium text-sm">Public Link</p>
                      <p className="text-xs text-slate-500">Anyone with the link can view</p>
                    </div>
                  </label>

                  {!isPublic && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password Protection</label>
                      <input 
                        type="text" 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Leave blank for no password"
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Expiration (Days)</label>
                    <input 
                      type="number" 
                      value={expiresInDays}
                      onChange={e => setExpiresInDays(e.target.value)}
                      placeholder="e.g. 7"
                      min="1"
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto">
                    <Check size={24} />
                  </div>
                  <p className="font-medium">Link Created Successfully!</p>
                  
                  <div className="flex items-center gap-2 p-2 border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-900/20 rounded-lg">
                    <input 
                      type="text" 
                      readOnly 
                      value={shareLink} 
                      className="flex-1 bg-transparent border-none focus:outline-none text-sm text-slate-600 dark:text-slate-300 px-2"
                    />
                    <button onClick={copyToClipboard} className="p-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 transition-colors">
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  {!isPublic && password && (
                    <p className="text-xs text-slate-500 text-left">Password: {password}</p>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/20">
              {shareLink ? (
                <button onClick={reset} className="px-6 py-2 rounded-lg font-medium bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                  Close
                </button>
              ) : (
                <>
                  <button onClick={reset} className="px-4 py-2 rounded-lg font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleShare} disabled={loading} className="px-6 py-2 rounded-lg font-medium bg-brand-600 text-white hover:bg-brand-700 transition-colors disabled:opacity-50">
                    {loading ? 'Generating...' : 'Generate Link'}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
