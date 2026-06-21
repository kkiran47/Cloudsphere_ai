import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Loading...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full h-48 flex items-center justify-center">
      {content}
    </div>
  );
};

export default Loading;
