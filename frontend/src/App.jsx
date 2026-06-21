import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { FileProvider } from './context/FileContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Files from './pages/Files';
import Search from './pages/Search';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Shared from './pages/Shared';
import Settings from './pages/Settings';

// Layouts/Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

const ProtectedLayout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 ambient-bg">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative z-10">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <FileProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/shared/:linkId" element={<Shared />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
              <Route path="/files" element={<ProtectedLayout><Files /></ProtectedLayout>} />
              <Route path="/search" element={<ProtectedLayout><Search /></ProtectedLayout>} />
              <Route path="/chat" element={<ProtectedLayout><Chat /></ProtectedLayout>} />
              <Route path="/profile" element={<ProtectedLayout><Profile /></ProtectedLayout>} />
              <Route path="/admin" element={<ProtectedLayout><Admin /></ProtectedLayout>} />
              <Route path="/settings" element={<ProtectedLayout><Settings /></ProtectedLayout>} />
            </Routes>
          </FileProvider>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
