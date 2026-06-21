import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';
import { Users, Database, FileText, Link as LinkIcon } from 'lucide-react';

const Admin = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users')
        ]);
        setStats(statsRes.data.data);
        setUsers(usersRes.data.data);
      } catch (error) {
        console.error('Failed to fetch admin data', error);
      }
      setLoading(false);
    };

    fetchAdminData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Admin Panel</h1>
        <p className="text-slate-500">System overview and user management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">Total Users</p>
            <h3 className="text-2xl font-bold">{stats?.totalUsers || 0}</h3>
          </div>
          <div className="p-3 bg-brand-50 text-brand-600 rounded-xl">
            <Users size={24} />
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">Total Files</p>
            <h3 className="text-2xl font-bold">{stats?.totalFiles || 0}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <FileText size={24} />
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">Total Shares</p>
            <h3 className="text-2xl font-bold">{stats?.totalShares || 0}</h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <LinkIcon size={24} />
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">Total Storage</p>
            <h3 className="text-2xl font-bold">{stats ? (stats.totalStorageUsed / 1024 / 1024 / 1024).toFixed(2) : 0} GB</h3>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Database size={24} />
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold">User Management</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Storage Used</th>
                <th className="px-6 py-4 font-medium text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {users.map(user => (
                <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{user.name}</td>
                  <td className="px-6 py-4 text-slate-500">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'Admin' ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{(user.storageUsed / 1024 / 1024).toFixed(2)} MB</td>
                  <td className="px-6 py-4 text-slate-500 text-right">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
