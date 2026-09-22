import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Shield, Activity, Lock, Key, Clock, CheckCircle, AlertTriangle, XCircle, Settings, RefreshCw, LayoutDashboard, PlayCircle, ClipboardList, List } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Simulate from './pages/Simulate';
import LiveRequests from './pages/LiveRequests';
import ActivityLogs from './pages/ActivityLogs';
import Agents from './pages/Agents';
import { resetData } from './store';

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Agent Identities', path: '/agents', icon: Key },
    { name: 'Simulate Request', path: '/simulate', icon: PlayCircle },
    { name: 'Live & Approvals', path: '/live', icon: ClipboardList },
    { name: 'Activity Logs', path: '/logs', icon: List },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 flex items-center gap-3">
        <Shield className="w-8 h-8 text-blue-500" />
        <div>
          <h1 className="text-white font-bold text-lg leading-tight">Agent Security</h1>
          <p className="text-xs text-blue-400 font-medium tracking-wider uppercase">Gateway</p>
        </div>
      </div>
      
      <nav className="flex-1 mt-6 px-4">
        {links.map(link => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive ? 'bg-blue-600/20 text-blue-400 font-medium' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => { resetData(); window.location.reload(); }}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white w-full justify-center py-2 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Reset Demo Data
        </button>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div className="flex bg-slate-50 min-h-screen font-sans">
        <Sidebar />
        <main className="ml-64 flex-1 p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/simulate" element={<Simulate />} />
            <Route path="/live" element={<LiveRequests />} />
            <Route path="/logs" element={<ActivityLogs />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
