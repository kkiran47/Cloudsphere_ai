import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Cloud, Lock, Download, FileText, Loader2 } from 'lucide-react';
import api from '../services/api';

const Shared = () => {
  const { linkId } = useParams();
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsPassword, setNeedsPassword] = useState(false);

  useEffect(() => {
    fetchSharedFile();
    // eslint-disable-next-line
  }, []);

  const fetchSharedFile = async (pwd = null) => {
    setLoading(true);
    setError('');
    try {
      const payload = pwd ? { password: pwd } : {};
      const { data } = await api.post(`/share/${linkId}`, payload);
      setFile(data.data);
      setNeedsPassword(false);
    } catch (err) {
      if (err.response?.status === 401) {
        setNeedsPassword(true);
      } else {
        setError(err.response?.data?.error || 'Link expired or invalid');
      }
    }
    setLoading(false);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    fetchSharedFile(password);
  };

  if (loading && !file && !needsPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex items-center gap-2 text-brand-600 dark:text-brand-500 font-bold text-2xl">
        <Cloud size={32} />
        <span>CloudSphere AI</span>
      </div>

      <div className="w-full max-w-md glass-panel p-8 rounded-2xl shadow-xl text-center border border-slate-200 dark:border-slate-800">
        {error ? (
          <div>
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={32} />
            </div>
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p className="text-slate-500">{error}</p>
          </div>
        ) : needsPassword ? (
          <form onSubmit={handlePasswordSubmit}>
            <div className="w-16 h-16 bg-brand-100 text-brand-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={32} />
            </div>
            <h2 className="text-xl font-bold mb-2">Protected File</h2>
            <p className="text-slate-500 text-sm mb-6">This shared link is password protected.</p>
            
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl mb-4 bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 text-white font-medium py-3 rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Access File'}
            </button>
          </form>
        ) : file ? (
          <div>
            <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/30 text-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <FileText size={40} />
            </div>
            <h2 className="text-xl font-bold mb-2 truncate" title={file.originalName}>{file.originalName}</h2>
            <p className="text-sm text-slate-500 mb-8 font-medium">Shared with you via CloudSphere AI</p>
            
            <a 
              href={file.cloudinaryUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              download={file.originalName}
              className="w-full flex items-center justify-center gap-2 bg-brand-600 text-white font-medium py-3 rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20"
            >
              <Download size={20} />
              Download File
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Shared;
