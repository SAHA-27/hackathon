import React from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Shield, Key, ClipboardList, List, PlayCircle, LayoutDashboard, ShieldCheck, CheckCircle2, FileWarning } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Simulate from './pages/Simulate';
import LiveRequests from './pages/LiveRequests';
import ApprovalCenter from './pages/ApprovalCenter';
import ActivityLogs from './pages/ActivityLogs';
import Agents from './pages/Agents';
import SecurityPolicies from './pages/SecurityPolicies';
import { resetData } from './store';

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Agents', path: '/agents', icon: BotIcon },
    { name: 'Simulate Request', path: '/simulate', icon: PlayCircle },
    { name: 'Live Requests', path: '/live', icon: ClipboardList },
    { name: 'Approval Center', path: '/approvals', icon: CheckCircle2 },
    { name: 'Activity Logs', path: '/logs', icon: List },
    { name: 'Security Policies', path: '/policies', icon: ShieldCheck },
  ];

  return (
    <div className="w-64 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 text-slate-300 h-screen flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3">
        <Shield className="w-8 h-8 text-indigo-500" />
        <div>
          <h1 className="text-white font-bold text-lg leading-tight">Agent Security</h1>
          <p className="text-xs text-indigo-400 font-medium tracking-wider uppercase">Gateway</p>
        </div>
      </div>
      
      <nav className="flex-1 mt-6 px-4 space-y-1">
        {links.map(link => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-indigo-500/20 text-indigo-300 font-medium border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
                  : 'hover:bg-slate-800/50 hover:text-white border border-transparent'
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
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white w-full justify-center py-3 bg-slate-800/50 rounded-xl transition-colors border border-slate-700 hover:border-slate-500"
        >
          <FileWarning className="w-4 h-4" />
          Reset Demo Data
        </button>
      </div>
    </div>
  );
};

// SVG Icon component for Bot since lucide-react might have Bot missing depending on version, wait, it has Bot.
import { Bot as BotIcon } from 'lucide-react';

const TopBar = () => (
  <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8">
    <div className="font-semibold text-slate-200">
      Dynamic Agent Security Gateway
    </div>
    <div className="flex items-center gap-2 text-sm font-medium">
      <span className="text-slate-400">Gateway Status:</span>
      <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20 shadow-[0_0_10px_rgba(52,211,153,0.2)]">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        ACTIVE
      </span>
    </div>
  </header>
);

const App = () => {
  return (
    <Router>
      <div className="flex bg-slate-950 min-h-screen font-sans text-slate-200 selection:bg-indigo-500/30">
        <Sidebar />
        <div className="ml-64 flex-1 flex flex-col min-h-screen relative">
          {/* Subtle background glow effects */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] pointer-events-none"></div>
          
          <TopBar />
          <main className="flex-1 p-8 relative z-10">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/simulate" element={<Simulate />} />
              <Route path="/live" element={<LiveRequests />} />
              <Route path="/approvals" element={<ApprovalCenter />} />
              <Route path="/logs" element={<ActivityLogs />} />
              <Route path="/policies" element={<SecurityPolicies />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
