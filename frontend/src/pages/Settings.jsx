import React from 'react';

const Settings = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pt-4">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Settings</h1>
      
      <div className="glass-panel p-8 rounded-2xl space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Appearance</h3>
          <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-slate-500">System preference is used by default.</p>
            </div>
            <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
              <option>System</option>
              <option>Light</option>
              <option>Dark</option>
            </select>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Notifications</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Alerts</p>
                <p className="text-sm text-slate-500">Receive emails for new shares.</p>
              </div>
              <input type="checkbox" className="w-5 h-5 text-brand-600 rounded" defaultChecked />
            </label>
            <label className="flex items-center justify-between">
              <div>
                <p className="font-medium">AI Insights Ready</p>
                <p className="text-sm text-slate-500">Notify when file processing is complete.</p>
              </div>
              <input type="checkbox" className="w-5 h-5 text-brand-600 rounded" defaultChecked />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
